/**
 * Utilitários para verificação de permissões de configuração de expiração de OS
 */

import { supabase } from '../api/supabase.js';
import { dbSelect } from './authInterceptor.js';
import { getSelectedStoreId } from './globals.js';

// Cache das permissões do usuário atual
let userExpirationPermissions = null;

/**
 * Verifica se o usuário atual tem permissão para configurar expiração de OS
 * @returns {Promise<boolean>}
 */
export async function canManageOSExpiration() {
    try {
        // Se já temos as permissões em cache, usar elas
        if (userExpirationPermissions !== null) {
            return userExpirationPermissions;
        }

        // Buscar permissões do usuário atual
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
            userExpirationPermissions = false;
            return false;
        }

        const { data: permissions, error } = await dbSelect('user_store_permissions', {
            select: 'can_manage_os_expiration',
            eq: { user_id: user.id }
        });

        if (error || !permissions || permissions.length === 0) {
            userExpirationPermissions = false;
            return false;
        }

        // Verificar se tem permissão em pelo menos uma loja
        userExpirationPermissions = permissions.some(p => p.can_manage_os_expiration);
        return userExpirationPermissions;
    } catch (error) {
        console.error('Erro ao verificar permissões de configuração de expiração:', error);
        userExpirationPermissions = false;
        return false;
    }
}

/**
 * Limpa o cache de permissões (usar quando as permissões mudarem)
 */
export function clearExpirationPermissionsCache() {
    userExpirationPermissions = null;
}

/**
 * Oculta ou desabilita a seção de configuração de expiração se o usuário não tiver permissão
 */
export async function applyExpirationPermissions() {
    const hasPermission = await canManageOSExpiration();
    const expirationSection = document.getElementById('os-expiration-config-section');
    
    if (!hasPermission && expirationSection) {
        // Adicionar uma mensagem de permissão negada
        expirationSection.innerHTML = `
            <h3>⏰ Tempo de Expiração de Ordens de Serviço</h3>
            <div class="permission-denied-message">
                <div class="alert alert-warning">
                    <strong>🔒 Acesso Restrito</strong>
                    <p>Você não tem permissão para modificar as configurações de tempo de expiração de ordens de serviço.</p>
                    <p>Entre em contato com um administrador para solicitar acesso.</p>
                </div>
            </div>
        `;
        expirationSection.style.opacity = '0.6';
    }
}

/**
 * Verifica permissões antes de permitir salvamento da configuração
 * @returns {Promise<boolean>}
 */
export async function validateExpirationSavePermission() {
    const hasPermission = await canManageOSExpiration();
    
    if (!hasPermission) {
        alert('❌ Você não tem permissão para modificar as configurações de tempo de expiração de ordens de serviço.');
        return false;
    }
    
    return true;
}