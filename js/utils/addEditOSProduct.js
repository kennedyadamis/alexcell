import { formatPriceForDisplay } from './formatPriceForDisplay.js';

/**
 * Adiciona um produto à lista de produtos na edição de OS
 * @param {Object} product - Objeto do produto a ser adicionado
 */
export function addEditOSProduct(product) {
    const editProductsList = document.getElementById('edit-os-products-list');
    if (!editProductsList) {
        console.error('Lista de produtos para edição não encontrada');
        return;
    }

    // Criar elemento do produto
    const productDiv = document.createElement('div');
    productDiv.className = 'product-item-edit'; // Corrigido para corresponder ao que updateEditOSTotal espera
    productDiv.dataset.productId = product.id;
    productDiv.dataset.costPrice = product.cost_price || 0;

    // Usar price ao invés de sale_price e incluir quantidade
    const quantity = product.quantity || 1;
    const price = product.price || 0;

    productDiv.innerHTML = `
        <div class="product-info">
            <strong class="product-name">${product.name || 'Produto sem nome'}</strong><br>
            <small>Qtd: ${quantity} x R$ ${formatPriceForDisplay(price)} = R$ ${formatPriceForDisplay(quantity * price)}</small>
        </div>
        <div class="product-actions">
            <button type="button" class="btn-edit-price" onclick="editOSProductPrice('${product.id}')">
                ✏️ Editar Preço
            </button>
            <button type="button" class="btn-remove-product" onclick="removeOSProduct('${product.id}')">
                🗑️ Remover
            </button>
        </div>
    `;

    editProductsList.appendChild(productDiv);
}