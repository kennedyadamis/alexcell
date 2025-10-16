/**
 * Utilitários para verificação de permissões de caixa registradora
 * (Abrir, Fechar, Reabrir e Excluir transações)
 */

import { supabase } from '../api/supabase.js';
import { dbSelect } from './authInterceptor.js';

// Cache das permissões do usuário atual
let userCashRegisterPermissions = null;
let userReopenCashPermissions = null;
let userDeleteCashPermissions = null;

/**
 * Verifica se o usuário atual tem permissão para gerenciar caixa registradora
 * (Abrir e Fechar caixa)
 * @returns {Promise<boolean>}
 */
export async function canManageCashRegister() {
    try {
        // Se já temos as permissões em cache, usar elas
        if (userCashRegisterPermissions !== null) {
            return userCashRegisterPermissions;
        }

        // Buscar permissões do usuário atual
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
            userCashRegisterPermissions = false;
            return false;
        }

        const { data: permissions, error } = await dbSelect('user_store_permissions', {
            select: 'can_manage_cash_register',
            eq: { user_id: user.id }
        });

        if (error || !permissions || permissions.length === 0) {
            userCashRegisterPermissions = false;
            return false;
        }

        // Verificar se tem permissão em pelo menos uma loja
        userCashRegisterPermissions = permissions.some(p => p.can_manage_cash_register);
        return userCashRegisterPermissions;
    } catch (error) {
        console.error('Erro ao verificar permissões de caixa registradora:', error);
        userCashRegisterPermissions = false;
        return false;
    }
}

/**
 * Verifica se o usuário atual tem permissão para reabrir caixa fechado
 * @returns {Promise<boolean>}
 */
export async function canReopenCashRegister() {
    try {
        // Se já temos as permissões em cache, usar elas
        if (userReopenCashPermissions !== null) {
            return userReopenCashPermissions;
        }

        // Buscar permissões do usuário atual
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
            userReopenCashPermissions = false;
            return false;
        }

        const { data: permissions, error } = await dbSelect('user_store_permissions', {
            select: 'can_reopen_cash_register',
            eq: { user_id: user.id }
        });

        if (error || !permissions || permissions.length === 0) {
            userReopenCashPermissions = false;
            return false;
        }

        // Verificar se tem permissão em pelo menos uma loja
        userReopenCashPermissions = permissions.some(p => p.can_reopen_cash_register);
        return userReopenCashPermissions;
    } catch (error) {
        console.error('Erro ao verificar permissões de reabrir caixa:', error);
        userReopenCashPermissions = false;
        return false;
    }
}

/**
 * Verifica se o usuário atual tem permissão para excluir transações do caixa
 * @returns {Promise<boolean>}
 */
export async function canDeleteCashTransactions() {
    try {
        // Se já temos as permissões em cache, usar elas
        if (userDeleteCashPermissions !== null) {
            return userDeleteCashPermissions;
        }

        // Buscar permissões do usuário atual
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
            userDeleteCashPermissions = false;
            return false;
        }

        const { data: permissions, error } = await dbSelect('user_store_permissions', {
            select: 'can_delete_cash_transactions',
            eq: { user_id: user.id }
        });

        if (error || !permissions || permissions.length === 0) {
            userDeleteCashPermissions = false;
            return false;
        }

        // Verificar se tem permissão em pelo menos uma loja
        userDeleteCashPermissions = permissions.some(p => p.can_delete_cash_transactions);
        return userDeleteCashPermissions;
    } catch (error) {
        console.error('Erro ao verificar permissões de excluir transações:', error);
        userDeleteCashPermissions = false;
        return false;
    }
}

/**
 * Limpa o cache de permissões (útil quando o usuário muda ou as permissões são atualizadas)
 */
export function clearCashRegisterPermissionsCache() {
    userCashRegisterPermissions = null;
    userReopenCashPermissions = null;
    userDeleteCashPermissions = null;
}