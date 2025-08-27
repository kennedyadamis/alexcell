/**
 * Função para resetar modal para estado original
 */
export function resetAddProductModal() {

    
    const modal = document.getElementById('add-product-modal');
    if (!modal) {

        return;
    }
    
    // Restaurar título
    const title = modal.querySelector('h2');
    if (title) {
        title.textContent = '🛒 Adicionar Produto à OS';
    }
    
    // Restaurar botão
    const confirmBtn = modal.querySelector('.btn-primary');
    if (confirmBtn) {
        confirmBtn.textContent = '✅ Adicionar à OS';
        // Note: confirmAddProduct deve ser importado onde necessário
        if (typeof confirmAddProduct !== 'undefined') {
            confirmBtn.onclick = confirmAddProduct;
        }
    }
    
    // Limpar campos do modal
    const quantityInput = document.getElementById('product-quantity');
    const priceInput = document.getElementById('product-custom-price');
    const subtotalElement = document.getElementById('product-subtotal');
    const nameElement = document.getElementById('selected-product-name');
    
    if (quantityInput) {
        quantityInput.value = '1';

    }
    
    if (priceInput) {
        priceInput.value = '0,00';

    }
    
    if (subtotalElement) {
        subtotalElement.textContent = 'R$ 0,00';

    }
    
    if (nameElement) {
        nameElement.textContent = '';

    }
    
    // Limpar dados de controle de estoque
    delete modal.dataset.trackStock;
    delete modal.dataset.actualStock;
    
    // Limpar referências
    if (typeof window !== 'undefined') {
        window.editingProductDiv = null;
        window.selectedProductForOS = null;
    
    }
    

}