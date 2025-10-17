/**
 * Utilitários para verificação de permissões de caixa
 */

import { supabase } from '../api/supabase.js';
import { dbSelect } from './authInterceptor.js';

// Cache das permissões do usuário atual
let userCashPermissions = null;

/**
 * Verifica se o usuário atual tem permissão para gerenciar caixa
 * @returns {Promise<boolean>}
 */
export async function canManageCash() {
    try {
        // Se já temos as permissões em cache, usar elas
        if (userCashPermissions !== null) {
            return userCashPermissions;
        }

        // Buscar permissões do usuário atual
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
            userCashPermissions = false;
            return false;
        }

        const { data: permissions, error } = await dbSelect('user_store_permissions', {
            select: 'can_manage_cash_register',
            eq: { user_id: user.id }
        });

        if (error || !permissions || permissions.length === 0) {
            userCashPermissions = false;
            return false;
        }

        // Verificar se tem permissão em pelo menos uma loja
        userCashPermissions = permissions.some(p => p.can_manage_cash_register);
        return userCashPermissions;
    } catch (error) {
        console.error('Erro ao verificar permissões de caixa:', error);
        userCashPermissions = false;
        return false;
    }
}

/**
 * Limpa o cache de permissões (útil quando o usuário muda ou as permissões são atualizadas)
 */
export function clearCashPermissionsCache() {
    userCashPermissions = null;
}