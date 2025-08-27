/**
 * Formata um valor numérico para exibição como preço em Real brasileiro
 * @param {number|string} price - Valor a ser formatado
 * @returns {string} - Valor formatado como "R$ 0,00"
 */
export function formatPriceForDisplay(price) {
    // Converte para número se for string
    const numericPrice = typeof price === 'string' ? parseFloat(price) : price;
    
    // Verifica se é um número válido
    if (isNaN(numericPrice)) {
        return 'R$ 0,00';
    }
    
    // Formata o valor para moeda brasileira
    return new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL'
    }).format(numericPrice);
} 