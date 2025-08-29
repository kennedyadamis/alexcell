import { supabase } from '../api/supabase.js';

// ========================================
// INTERCEPTADOR DE AUTENTICAÇÃO
// ========================================

/**
 * Interceptador para renovar automaticamente tokens expirados
 * Wrapper para operações do Supabase que podem falhar por token expirado
 */

class AuthInterceptor {
    constructor() {
        this.isRefreshing = false;
        this.failedQueue = [];
    }

    /**
     * Processa a fila de requisições que falharam durante a renovação do token
     */
    processQueue(error, token = null) {
        this.failedQueue.forEach(({ resolve, reject }) => {
            if (error) {
                reject(error);
            } else {
                resolve(token);
            }
        });
        
        this.failedQueue = [];
    }

    /**
     * Tenta renovar a sessão do usuário
     */
    async refreshSession() {
        try {
            console.log('🔄 Tentando renovar sessão...');
            const { data, error } = await supabase.auth.refreshSession();
            
            if (error) {
                console.error('❌ Erro ao renovar sessão:', error);
                throw error;
            }
            
            console.log('✅ Sessão renovada com sucesso');
            return data.session;
        } catch (error) {
            console.error('❌ Falha na renovação da sessão:', error);
            throw error;
        }
    }

    /**
     * Verifica se o erro é relacionado a token expirado
     */
    isTokenExpiredError(error) {
        return error && (
            error.code === 'PGRST301' ||
            error.message?.includes('JWT expired') ||
            error.message?.includes('invalid JWT') ||
            error.status === 401
        );
    }

    /**
     * Intercepta operações do Supabase e tenta renovar token se necessário
     */
    async interceptSupabaseOperation(operation) {
        try {
            // Primeira tentativa da operação
            const result = await operation();
            return result;
        } catch (error) {
            console.log('🔍 Erro detectado:', error);
            
            // Verifica se é erro de token expirado
            if (!this.isTokenExpiredError(error)) {
                throw error;
            }

            console.log('🔑 Token expirado detectado, tentando renovar...');

            // Se já está renovando, adiciona à fila
            if (this.isRefreshing) {
                return new Promise((resolve, reject) => {
                    this.failedQueue.push({ resolve, reject });
                }).then(() => {
                    // Tenta a operação novamente após a renovação
                    return operation();
                });
            }

            this.isRefreshing = true;

            try {
                // Tenta renovar a sessão
                await this.refreshSession();
                
                // Processa a fila de requisições pendentes
                this.processQueue(null);
                
                // Tenta a operação novamente
                const result = await operation();
                return result;
            } catch (refreshError) {
                console.error('❌ Falha na renovação, redirecionando para login');
                
                // Processa a fila com erro
                this.processQueue(refreshError);
                
                // Limpa dados de sessão e redireciona para login
                await supabase.auth.signOut();
                sessionStorage.clear();
                localStorage.clear();
                
                // Redireciona para login se não estiver já na página de auth
                if (!window.location.pathname.includes('auth.html')) {
                    window.location.href = 'auth.html';
                }
                
                throw refreshError;
            } finally {
                this.isRefreshing = false;
            }
        }
    }

    /**
     * Wrapper para operações de SELECT
     */
    async select(table, options = {}) {
        return this.interceptSupabaseOperation(async () => {
            let query = supabase.from(table).select(options.select || '*');
            
            if (options.eq) {
                Object.entries(options.eq).forEach(([key, value]) => {
                    query = query.eq(key, value);
                });
            }
            
            if (options.order) {
                query = query.order(options.order.column, { ascending: options.order.ascending });
            }
            
            if (options.range) {
                query = query.range(options.range.from, options.range.to);
            }
            
            // Adicionar suporte para single
            if (options.single) {
                query = query.single();
            }
            
            const { data, error } = await query;
            
            if (error) throw error;
            return { data, error: null };
        });
    }

    /**
     * Wrapper para operações de INSERT
     */
    async insert(table, data) {
        return this.interceptSupabaseOperation(async () => {
            const { data: result, error } = await supabase.from(table).insert(data).select();
            
            if (error) throw error;
            return { data: result, error: null };
        });
    }

    /**
     * Wrapper para operações de UPDATE
     */
    async update(table, data, conditions) {
        return this.interceptSupabaseOperation(async () => {
            let query = supabase.from(table).update(data);
            
            if (conditions.eq) {
                Object.entries(conditions.eq).forEach(([key, value]) => {
                    query = query.eq(key, value);
                });
            }
            
            const { data: result, error } = await query.select();
            
            if (error) throw error;
            return { data: result, error: null };
        });
    }

    /**
     * Wrapper para operações de DELETE
     */
    async delete(table, conditions) {
        return this.interceptSupabaseOperation(async () => {
            let query = supabase.from(table).delete();
            
            if (conditions.eq) {
                Object.entries(conditions.eq).forEach(([key, value]) => {
                    query = query.eq(key, value);
                });
            }
            
            if (conditions.in) {
                Object.entries(conditions.in).forEach(([key, value]) => {
                    query = query.in(key, value);
                });
            }
            
            const { data, error } = await query;
            
            if (error) throw error;
            return { data, error: null };
        });
    }

    /**
     * Wrapper para RPC (Remote Procedure Call)
     */
    async rpc(functionName, params = {}) {
        return this.interceptSupabaseOperation(async () => {
            const { data, error } = await supabase.rpc(functionName, params);
            
            if (error) throw error;
            return { data, error: null };
        });
    }
}

// Instância singleton do interceptador
const authInterceptor = new AuthInterceptor();

// Exporta a instância e métodos utilitários
export { authInterceptor };

// Exporta métodos de conveniência
export const dbSelect = (table, options) => authInterceptor.select(table, options);
export const dbInsert = (table, data) => authInterceptor.insert(table, data);
export const dbUpdate = (table, data, conditions) => authInterceptor.update(table, data, conditions);
export const dbDelete = (table, conditions) => authInterceptor.delete(table, conditions);
export const dbRpc = (functionName, params) => authInterceptor.rpc(functionName, params);

/**
 * Função utilitária para verificar se o usuário está autenticado
 */
export async function checkAuthStatus() {
    try {
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
            console.error('Erro ao verificar sessão:', error);
            return false;
        }
        
        return !!session;
    } catch (error) {
        console.error('Erro ao verificar status de autenticação:', error);
        return false;
    }
}

/**
 * Função para forçar logout e limpeza de dados
 */
export async function forceLogout() {
    try {
        await supabase.auth.signOut();
        sessionStorage.clear();
        localStorage.clear();
        
        if (!window.location.pathname.includes('auth.html')) {
            window.location.href = 'auth.html';
        }
    } catch (error) {
        console.error('Erro durante logout forçado:', error);
        // Mesmo com erro, limpa os dados locais
        sessionStorage.clear();
        localStorage.clear();
        window.location.href = 'auth.html';
    }
}