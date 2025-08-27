/**
 * Utilitários para verificação de permissões de preços de custo
 */

import { supabase } from '../api/supabase.js';
import { dbSelect } from './authInterceptor.js';
import { formatCurrencyBR } from './formatters.js';

// Cache das permissões do usuário atual
let userCostPermissions = null;

/**
 * Verifica se o usuário atual tem permissão para ver preços de custo
 * @returns {Promise<boolean>}
 */
export async function canViewCostPrices() {
    try {
        // Se já temos as permissões em cache, usar elas
        if (userCostPermissions !== null) {
            return userCostPermissions;
        }

        // Buscar permissões do usuário atual
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
            userCostPermissions = false;
            return false;
        }

        const { data: permissions, error } = await dbSelect('user_store_permissions', {
            select: 'can_manage_cost_prices',
            eq: { user_id: user.id }
        });

        if (error || !permissions || permissions.length === 0) {
            userCostPermissions = false;
            return false;
        }

        // Verificar se tem permissão em pelo menos uma loja
        userCostPermissions = permissions.some(p => p.can_manage_cost_prices);
        return userCostPermissions;
    } catch (error) {
        console.error('Erro ao verificar permissões de custo:', error);
        userCostPermissions = false;
        return false;
    }
}

/**
 * Limpa o cache de permissões (usar quando as permissões mudarem)
 */
export function clearCostPermissionsCache() {
    userCostPermissions = null;
}

/**
 * Oculta elementos relacionados a preços de custo se o usuário não tiver permissão
 * @param {string[]} selectors - Array de seletores CSS dos elementos a ocultar
 */
export async function hideCostElementsIfNoPermission(selectors) {
    const hasPermission = await canViewCostPrices();
    
    if (!hasPermission) {
        selectors.forEach(selector => {
            const elements = document.querySelectorAll(selector);
            elements.forEach(element => {
                element.style.display = 'none';
            });
        });
    }
}

/**
 * Formata o preço de custo baseado nas permissões do usuário
 * @param {number} costPrice - Preço de custo
 * @returns {Promise<string>} - Preço formatado ou texto oculto
 */
export async function formatCostPrice(costPrice) {
    const hasPermission = await canViewCostPrices();
    
    if (!hasPermission) {
        return '***';
    }
    
    return formatCurrencyBR(costPrice);
}

/**
 * Calcula e formata o lucro baseado nas permissões do usuário
 * @param {number} salePrice - Preço de venda
 * @param {number} costPrice - Preço de custo
 * @returns {Promise<string>} - Lucro formatado ou texto oculto
 */
export async function formatProfit(salePrice, costPrice) {
    const hasPermission = await canViewCostPrices();
    
    if (!hasPermission) {
        return '***';
    }
    
    const profit = salePrice - costPrice;
    return formatCurrencyBR(profit);
}