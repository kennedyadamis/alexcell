import { supabase } from '../api/supabase.js';
import { updatePaginationUI, showToast } from '../utils/utils.js';
import { RECORDS_PER_PAGE } from '../utils/constants.js';
import { debounce } from '../utils/debounce.js';
import { formatPriceForDisplay } from '../utils/formatPriceForDisplay.js';
import { trapFocus } from '../utils/trapFocus.js';
import { formatCurrencyBR, formatPhone, formatDateForDisplay } from '../utils/formatters.js';
import { resetAddProductModal } from '../utils/resetAddProductModal.js';
import { addEditOSProduct } from '../utils/addEditOSProduct.js';
// PatternLock é carregado globalmente via script tag
import { setupCustomerSearch, setupValueFormatting } from './customerManagement.js';
import { getCurrentUser, getSelectedStoreId } from '../utils/globals.js';
import { initializeOrderForm } from './orderForm.js';
import { dbSelect, dbInsert, dbUpdate, dbDelete, authInterceptor } from '../utils/authInterceptor.js';

// Re-exportar addEditOSProduct para que possa ser importada pelo main.js
export { addEditOSProduct };

// Flag para evitar carregamento duplicado da tabela de OS
let isLoadingOSTable = false;

export async function loadOSTable(page = 1, selectedStoreId = null, printWithToastCallback = null) {
    // Verificação para evitar carregamento duplicado
    if (isLoadingOSTable) {
        console.log('loadOSTable já está em execução, ignorando chamada duplicada');
        return;
    }
    
    const tbody = document.getElementById('os-table-body');
    if (!tbody) return;
    
    // Marcar como carregando
    isLoadingOSTable = true;
    tbody.innerHTML = '<tr><td colspan="7">Carregando...</td></tr>';

    const from = (page - 1) * RECORDS_PER_PAGE;
    const to = from + RECORDS_PER_PAGE - 1;

    try {
        const options = {
            select: '*',
            count: 'exact',
            order: { column: 'created_at', ascending: false },
            range: { from, to }
        };
            
        // Só filtra por store_id se houver uma loja selecionada
        if (selectedStoreId) {
            options.eq = { store_id: selectedStoreId };
        }
        
        const { data, error, count } = await dbSelect('service_orders', options);

        if (error) throw error;
        
        updatePaginationUI('os', page, count);

        if (data.length === 0) {
            tbody.innerHTML = '<tr><td colspan="7">Nenhuma ordem de serviço encontrada.</td></tr>';
            return;
        }
        tbody.innerHTML = '';
        for (const os of data) {
            let customerName = os.client_name || 'N/A';
            // Se não houver nome, mas houver customer_id, busca o nome real
            if ((!os.client_name || os.client_name.trim() === '') && os.customer_id) {
                const { data: customer, error } = await dbSelect('customers', { select: 'full_name', eq: { id: os.customer_id }, single: true });
                if (customer) customerName = customer.full_name;
            }

            const row = document.createElement('tr');
            if (os.status === 'delivered') {
                row.classList.add('os-delivered');
            }
            row.innerHTML = `
                <td><strong>${os.id}</strong></td>
                <td>${customerName}</td>
                <td>${os.equipment_brand || ''} ${os.equipment_model || ''}</td>
                <td>${os.problem_description}</td>
                <td><span class="status-badge status-${os.status === 'pending' || os.status === 'completed' ? 'progress' : os.status}">${getStatusText(os.status)}</span></td>
                <td>${new Date(os.created_at).toLocaleDateString('pt-BR')}</td>
                <td class="os-actions"></td>
            `;

            // --- CORREÇÃO FINAL ---
            const actionsCell = row.querySelector('.os-actions');
            
            const viewBtn = document.createElement('button');
            viewBtn.className = 'action-btn'; viewBtn.title = 'Visualizar'; viewBtn.innerHTML = '👁️';
            viewBtn.addEventListener('click', (e) => {
                e.preventDefault();
                console.log('Clique no botão visualizar, OS ID:', os.id);
                viewOS(os.id, printWithToastCallback);
            });
            actionsCell.appendChild(viewBtn);

            const editBtn = document.createElement('button');
            editBtn.className = 'action-btn'; editBtn.title = 'Editar'; editBtn.innerHTML = '✏️';
            editBtn.addEventListener('click', (e) => {
                e.preventDefault();
                // Editando OS
                editOS(os.id, getCurrentUser(), getSelectedStoreId());
            });
            actionsCell.appendChild(editBtn);

            const printBtn = document.createElement('button');
            printBtn.className = 'action-btn'; printBtn.title = 'Imprimir'; printBtn.innerHTML = '🖨️';
            printBtn.addEventListener('click', () => {
                if (printWithToastCallback) printWithToastCallback(os.id);
            });
            actionsCell.appendChild(printBtn);

            const deleteBtn = document.createElement('button');
            deleteBtn.className = 'action-btn'; deleteBtn.title = 'Excluir'; deleteBtn.innerHTML = '🗑️';
            deleteBtn.addEventListener('click', () => deleteOS(os.id, getSelectedStoreId()));
            actionsCell.appendChild(deleteBtn);

            // Lógica de botões de status EXCLUSIVA E CORRIGIDA
            if (os.status === 'completed' || os.status === 'progress' || os.status === 'pending') {
                // Se estiver em concerto/concluído, o próximo passo é aguardar retirada.
                const awaitingBtn = document.createElement('button');
                awaitingBtn.className = 'action-btn'; awaitingBtn.title = 'Marcar como Aguardando Retirada'; awaitingBtn.innerHTML = '📬';
                awaitingBtn.addEventListener('click', () => markAsAwaitingPickup(os.id));
                actionsCell.appendChild(awaitingBtn);
            
            } else if (os.status === 'awaiting_pickup') {
                // Se estiver aguardando, o próximo passo é marcar como entregue.
                const deliveredBtn = document.createElement('button');
                deliveredBtn.className = 'action-btn'; deliveredBtn.title = 'Marcar como Entregue'; deliveredBtn.innerHTML = '✅';
                deliveredBtn.addEventListener('click', () => markAsDelivered(os.id));
                actionsCell.appendChild(deliveredBtn);

            } else if (os.status !== 'delivered' && os.status !== 'cancelled') {
                // Para os demais status ativos, oferece um atalho para marcar como entregue.
                const deliveredBtn = document.createElement('button');
                deliveredBtn.className = 'action-btn'; deliveredBtn.title = 'Marcar como Entregue'; deliveredBtn.innerHTML = '✅';
                deliveredBtn.addEventListener('click', () => markAsDelivered(os.id));
                actionsCell.appendChild(deliveredBtn);
            }
            // Se o status for 'delivered' ou 'cancelled', nenhum botão de mudança de status aparece, mas o de edição (✏️) continua visível.
            
            tbody.appendChild(row);
        }
    } catch (error) {
        console.error('Erro ao carregar ordens de serviço:', error);
        tbody.innerHTML = `<tr><td colspan="7">Erro ao carregar dados. Tente novamente. (${error.message})</td></tr>`;
    } finally {
        // Desmarcar como carregando
        isLoadingOSTable = false;
    }
}

// Obter texto do status
export function getStatusText(status) {
    const statusMap = {
        'progress': 'Em Concerto',
        'completed': 'Em Concerto', // Mapeia status antigo para novo
        'pending': 'Em Concerto',   // Mapeia status antigo para novo
        'awaiting_pickup': 'Aguardando Retirada',
        'delivered': 'Entregue',
        'cancelled': 'Cancelada'
    };
    return statusMap[status] || 'Em Concerto'; // Padrão para qualquer status não mapeado
}

// Atualizar lista de OS
export async function refreshOSList(selectedStoreId, printWithToastCallback = null) {
    await loadOSTable(1, selectedStoreId, printWithToastCallback);
    showToast('Lista de OS atualizada!');
}

// Função para buscar OS por nome do cliente ou telefone
export async function searchOSByCustomer(selectedStoreId = null, printWithToastCallback = null) {
    const searchInput = document.getElementById('os-search-input');
    const searchTerm = searchInput ? searchInput.value.trim() : '';
    
    if (!searchTerm) {
        showToast('Por favor, digite um termo de busca', 'warning');
        return;
    }
    
    const tbody = document.getElementById('os-table-body');
    if (!tbody) return;
    
    tbody.innerHTML = '<tr><td colspan="7">Buscando...</td></tr>';
    
    try {
        // Busca todas as OS com dados do cliente
        const options = {
            select: '*, customers(id, full_name, phone)'
        };
        
        // Filtra por loja se especificado
        if (selectedStoreId) {
            options.eq = { store_id: selectedStoreId };
        }
        
        const { data, error } = await dbSelect('service_orders', options);
        
        if (error) throw error;
        
        // Filtra os resultados localmente
        const filteredData = data.filter(os => {
            const customerName = os.customers?.full_name || os.client_name || '';
            const customerPhone = os.customers?.phone || '';
            
            // Remove formatação do telefone para comparação
            const cleanPhone = customerPhone.replace(/\D/g, '');
            const cleanSearchTerm = searchTerm.replace(/\D/g, '');
            
            return customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                   cleanPhone.includes(cleanSearchTerm);
        });
        
        // Oculta controles de paginação durante a busca
        const paginationControls = document.getElementById('os-pagination');
        if (paginationControls) {
            paginationControls.style.display = 'none';
        }
        
        if (filteredData.length === 0) {
            tbody.innerHTML = '<tr><td colspan="7">Nenhuma ordem de serviço encontrada para "' + searchTerm + '".</td></tr>';
            return;
        }
        
        tbody.innerHTML = '';
        for (const os of filteredData) {
            let customerName = os.customers?.full_name || os.client_name || 'N/A';
            
            // Se não houver nome, mas houver customer_id, busca o nome real
            if (!customerName || customerName === 'N/A' || customerName.trim() === '') {
                if (os.customer_id) {
                    const { data: customer, error } = await dbSelect('customers', { 
                        select: 'full_name', 
                        eq: { id: os.customer_id }, 
                        single: true 
                    });
                    if (customer) customerName = customer.full_name;
                }
            }
            
            const row = document.createElement('tr');
            if (os.status === 'delivered') {
                row.classList.add('os-delivered');
            }
            row.innerHTML = `
                <td><strong>${os.id}</strong></td>
                <td>${customerName}</td>
                <td>${os.equipment_brand || ''} ${os.equipment_model || ''}</td>
                <td>${os.problem_description}</td>
                <td><span class="status-badge status-${os.status === 'pending' || os.status === 'completed' ? 'progress' : os.status}">${getStatusText(os.status)}</span></td>
                <td>${new Date(os.created_at).toLocaleDateString('pt-BR')}</td>
                <td class="os-actions"></td>
            `;
            
            // Adiciona botões de ação
            const actionsCell = row.querySelector('.os-actions');
            
            const viewBtn = document.createElement('button');
            viewBtn.className = 'action-btn'; viewBtn.title = 'Visualizar'; viewBtn.innerHTML = '👁️';
            viewBtn.addEventListener('click', (e) => {
                e.preventDefault();
                viewOS(os.id, printWithToastCallback);
            });
            
            const editBtn = document.createElement('button');
            editBtn.className = 'action-btn'; editBtn.title = 'Editar'; editBtn.innerHTML = '✏️';
            editBtn.addEventListener('click', (e) => {
                e.preventDefault();
                const currentUser = getCurrentUser();
                editOS(os.id, currentUser, selectedStoreId);
            });
            
            const deleteBtn = document.createElement('button');
            deleteBtn.className = 'action-btn delete-btn'; deleteBtn.title = 'Excluir'; deleteBtn.innerHTML = '🗑️';
            deleteBtn.addEventListener('click', (e) => {
                e.preventDefault();
                deleteOS(os.id, selectedStoreId, printWithToastCallback);
            });
            
            actionsCell.appendChild(viewBtn);
            actionsCell.appendChild(editBtn);
            actionsCell.appendChild(deleteBtn);
            
            tbody.appendChild(row);
        }
        
    } catch (error) {
        console.error('Erro na busca de OS:', error);
        tbody.innerHTML = '<tr><td colspan="7">Erro ao buscar ordens de serviço.</td></tr>';
    }
}

// Função para limpar a busca e voltar à listagem normal
export async function clearOSSearch(selectedStoreId = null, printWithToastCallback = null) {
    // Limpa o campo de busca
    const searchInput = document.getElementById('os-search-input');
    if (searchInput) {
        searchInput.value = '';
    }
    
    // Mostra controles de paginação novamente
    const paginationControls = document.getElementById('os-pagination');
    if (paginationControls) {
        paginationControls.style.display = 'flex';
    }
    
    // Recarrega a tabela normal
    await loadOSTable(1, selectedStoreId, printWithToastCallback);
}



// NOVO: Busca o endereço a partir de um CEP usando a API ViaCEP
export async function fetchAddressByCEP(cep, prefix = 'customer') {
    const cleanCep = cep.replace(/\D/g, '');

    if (cleanCep.length !== 8) {
        return; // Não faz nada se o CEP for inválido
    }

    try {
        const response = await fetch(`https://viacep.com.br/ws/${cleanCep}/json/`);
        const data = await response.json();

        if (data.erro) {
            alert('CEP não encontrado. Por favor, verifique o número.');
            return;
        }

        // Usa o prefixo para formar os IDs corretos
        const streetField = document.getElementById(`${prefix}-street`);
        const neighborhoodField = document.getElementById(`${prefix}-neighborhood`);
        const cityField = document.getElementById(`${prefix}-city`);
        const stateField = document.getElementById(`${prefix}-state`);
        const numberField = document.getElementById(`${prefix}-number`);
        
        if (streetField) streetField.value = data.logradouro || '';
        if (neighborhoodField) neighborhoodField.value = data.bairro || '';
        if (cityField) cityField.value = data.localidade || '';
        if (stateField) stateField.value = data.uf || '';
        
        // Foca no campo de número após preencher
        if (numberField) numberField.focus();

    } catch (error) {
        console.error('Erro ao buscar CEP:', error);
        alert('Não foi possível buscar o endereço. Tente novamente.');
    }
}

// Função específica para inicializar o PatternLock
export function initializePatternLock() {
    const canvas = document.getElementById('pattern-lock-canvas');
    const container = document.getElementById('pattern-lock-container');
    
    console.log('🔒 Inicializando PatternLock...', {
        canvas: !!canvas,
        container: !!container,
        PatternLock: !!window.PatternLock,
        canvasVisible: canvas ? canvas.offsetParent !== null : false,
        canvasSize: canvas ? `${canvas.clientWidth}x${canvas.clientHeight}` : 'N/A',
        containerRect: container ? container.getBoundingClientRect() : null,
        canvasRect: canvas ? canvas.getBoundingClientRect() : null
    });
    
    if (!canvas || !container) {
        console.error('❌ Canvas ou container não encontrado');
        // Adicionar indicação visual de erro
        if (container) {
            container.innerHTML = '<div style="color: red; text-align: center; padding: 20px;">❌ Canvas não encontrado</div>';
        }
        return false;
    }
    
    if (!window.PatternLock) {
        console.error('❌ Biblioteca PatternLock não carregada');
        container.innerHTML = '<div style="color: red; text-align: center; padding: 20px;">❌ PatternLock não carregado</div>';
        return false;
    }
    
    try {
        // Garantir que o canvas tenha as dimensões corretas
        canvas.width = 180;
        canvas.height = 180;
        canvas.style.width = '180px';
        canvas.style.height = '180px';
        canvas.style.display = 'block';
        canvas.style.backgroundColor = '#fff';
        canvas.style.border = '2px solid #28a745'; // Verde para indicar sucesso
        
        // Forçar reflow para garantir que o canvas esteja renderizado
        canvas.offsetHeight;
        
        // Adicionar indicação visual temporária
        const ctx = canvas.getContext('2d');
        ctx.fillStyle = '#f0f0f0';
        ctx.fillRect(0, 0, 180, 180);
        ctx.fillStyle = '#333';
        ctx.font = '14px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('Inicializando...', 90, 90);
        
        // Criar nova instância
        window.osPattern = new PatternLock('#pattern-lock-canvas');
        
        // Conectar ao campo hidden
        const hiddenInput = document.getElementById('os-pattern-lock-value');
        if (hiddenInput) {
            window.osPattern.on('change', value => {
                hiddenInput.value = value;
                // Debug removido
            });
        }
        
        // Conectar botão de reset
        const btnReset = document.getElementById('btn-reset-pattern');
        if (btnReset) {
            btnReset.onclick = () => {
                if (window.osPattern) {
                    window.osPattern.reset();
                    // Debug removido
                }
            };
        }
        
        // Debug removido
        
        // Limpar indicação visual após inicialização
        setTimeout(() => {
            canvas.style.border = '1px solid #ddd';
        }, 1000);
        
        return true;
    } catch (error) {
        console.error('❌ Erro ao inicializar PatternLock:', error);
        container.innerHTML = '<div style="color: red; text-align: center; padding: 20px;">❌ Erro: ' + error.message + '</div>';
        return false;
    }
}

export function openNewOSModal(currentUser, selectedStoreId) {
    const modal = document.getElementById('os-modal-container');
    if (!modal) return;
    
    // Exibe em flex para garantir centralização
    modal.style.display = 'flex';
    
    // Limpar formulário
    const form = document.getElementById('new-os-form');
    if (form) form.reset();
    
    // Limpar resultados de autocomplete
    const resultsContainer = document.getElementById('os-customer-results');
    if (resultsContainer) {
        resultsContainer.innerHTML = '';
        resultsContainer.style.display = 'none';
    }
    
    // Resetar padrão existente
    if(window.osPattern) {
        window.osPattern.reset();
    }
    
    // Definir status padrão
    const statusSelect = document.getElementById('os-status');
    if (statusSelect) statusSelect.value = 'progress';
    
    // Configuração do formulário será feita pelo main.js para evitar duplicação de event listeners
    
    // Inicializar PatternLock com múltiplas tentativas
    setTimeout(() => {
        if (!initializePatternLock()) {
            // Tentar novamente após mais tempo
            setTimeout(() => {
                if (!initializePatternLock()) {
                    // Última tentativa
                    setTimeout(() => {
                        initializePatternLock();
                    }, 1000);
                }
            }, 500);
        }
    }, 300);
}

export function closeNewOSModal() {
    const modal = document.getElementById('os-modal-container');
    if (modal) modal.style.display = 'none';
    // Ao fechar, também limpa o padrão
    if (window.osPattern) window.osPattern.reset();
}

// Função para configurar autocomplete de produtos na OS
export function setupOSProductAutocomplete() {

    
    const searchInput = document.getElementById('os-product-search');
    const resultsDiv = document.getElementById('os-product-results');
    

    
    if (!searchInput || !resultsDiv) {
        console.warn('Elementos de busca de produto para OS não encontrados.');
        return;
    }

    // Define a função de click em uma variável para poder removê-la depois
    const handleResultClick = (e) => {

        
        const resultDiv = e.target.closest('.autocomplete-result');

        
        if (resultDiv && resultDiv.dataset.productId) {
            const product = {
                id: resultDiv.dataset.productId,
                name: resultDiv.dataset.productName,
                price: parseFloat(resultDiv.dataset.productPrice || 0),
                cost_price: parseFloat(resultDiv.dataset.productCostPrice || 0),
                stock: parseInt(resultDiv.dataset.productStock || 0),
                track_stock: resultDiv.dataset.trackStock === 'true'
            };
            

            
            try {
                addOSProduct(product);

            } catch (error) {

            }
            
            searchInput.value = '';
            resultsDiv.style.display = 'none';
        } else {

        }
    };

    // Remove existing event listener before adding a new one
    resultsDiv.removeEventListener('click', handleResultClick);
    resultsDiv.addEventListener('click', handleResultClick);
    


    let searchTimeout;
    
    searchInput.addEventListener('input', (e) => {
        clearTimeout(searchTimeout);
        searchTimeout = setTimeout(async () => {
            const query = e.target.value.trim();

            if (query.length < 2) {
                resultsDiv.innerHTML = '';
                resultsDiv.style.display = 'none';
                return;
            }

            try {
                const { data: products, error } = await supabase
                    .from('products')
                    .select('id, name, price, cost_price, stock, track_stock')
                    .ilike('name', `%${query}%`)
                    .limit(5);

                if (error) {
                    console.error('Erro na busca de produtos:', error);
                    return;
                }

                if (products.length === 0) {
                    resultsDiv.innerHTML = '<div class="autocomplete-result">Nenhum produto encontrado</div>';
                } else {
                    resultsDiv.innerHTML = products.map(p => `
                        <div class="autocomplete-result" 
                            data-product-id="${p.id}" 
                            data-product-name="${p.name}"
                            data-product-price="${p.price}"
                            data-product-cost-price="${p.cost_price || 0}"
                            data-product-stock="${p.stock || 0}"
                            data-track-stock="${p.track_stock}">
                            ${p.name} <small>(R$ ${p.price.toFixed(2)}${p.track_stock ? `, Estoque: ${p.stock || 0}` : ''})</small>
                        </div>
                    `).join('');
                }
                resultsDiv.style.display = 'block';

            } catch (error) {
                console.error('Erro geral na busca:', error);
            }
        }, 300); // Debounce de 300ms
    });
}

// Função para adicionar produto à lista da OS (chamada interna)
function addOSProduct(product) {

    
    // Definir o produto selecionado para o modal de confirmação
    window.selectedProductForOS = product;


    // Preencher campos do modal usando os IDs corretos do HTML
    const productNameDisplay = document.getElementById('selected-product-name');
    const productStockDisplay = document.getElementById('selected-product-stock');
    const productPriceDisplay = document.getElementById('selected-product-price');
    const productQuantity = document.getElementById('product-quantity');
    const productCustomPrice = document.getElementById('product-custom-price');
    

    
    if (productNameDisplay) productNameDisplay.textContent = product.name;
    if (productStockDisplay) productStockDisplay.textContent = product.stock || 0;
    if (productPriceDisplay) productPriceDisplay.textContent = `R$ ${formatPriceForDisplay(product.price)}`;
    if (productQuantity) productQuantity.value = 1; // Default
    if (productCustomPrice) productCustomPrice.value = formatPriceForDisplay(product.price);
    

    
    // Armazenar estoque real e flag de controle de estoque no modal
    const modal = document.getElementById('add-product-modal');

    
    if (modal) {
        modal.dataset.actualStock = product.stock;
        modal.dataset.trackStock = product.track_stock;

    }
    
    // Exibir modal
    try {
        openAddProductModal(product);
    } catch (error) {
        console.error('Erro ao abrir modal de produto:', error);
    }
}

// Função para confirmar adição do produto
export function confirmAddProduct() {
    const product = window.selectedProductForOS;
    if (!product) return;
    
    const confirmButton = document.getElementById('btn-confirm-add-product');
    if (confirmButton) {
        confirmButton.disabled = true;
        confirmButton.textContent = 'Adicionando...';
    }
    
    const quantityElement = document.getElementById('product-quantity');
    const priceElement = document.getElementById('product-custom-price');
    
    const quantity = parseInt(quantityElement?.value) || 1;
    const priceText = priceElement?.value || '0,00';
    const price = parseFloat(priceText.replace(/\./g, '').replace(',', '.'));
    
    if (quantity <= 0 || price < 0) {
        showToast('Quantidade e preço devem ser válidos', 'error');
        if (confirmButton) {
            confirmButton.disabled = false;
            confirmButton.textContent = '✅ Adicionar à OS';
        }
        return;
    }
    
    // Verificar estoque apenas se o produto controla estoque
    const modal = document.getElementById('add-product-modal');
    const trackStock = modal.dataset.trackStock === 'true';
    
    if (trackStock) {
        const availableStock = parseInt(modal.dataset.actualStock) || 0;
        if (quantity > availableStock) {
            showToast(`Quantidade solicitada (${quantity}) excede o estoque disponível (${availableStock})`, 'error');
            if (confirmButton) {
                confirmButton.disabled = false;
                confirmButton.textContent = '✅ Adicionar à OS';
            }
            return;
        }
    }
    
    const total = price * quantity;
    
    // Adicionar produto à lista da OS
    const productsList = document.getElementById('os-products-list');
    const productDiv = document.createElement('div');
    productDiv.className = 'product-item';
    productDiv.dataset.productId = product.id;
    
    // Formatar preços corretamente
    const formattedPrice = formatPriceForDisplay(price);
    const formattedTotal = formatPriceForDisplay(total);
    
    productDiv.innerHTML = `
        <div class="product-info">
            <strong>${product.name}</strong><br>
            <small>Qtd: ${quantity} x R$ ${formattedPrice} = R$ ${formattedTotal}</small>
        </div>
        <div class="product-actions">
            <button type="button" onclick="editOSProductPrice('${product.id}')" class="btn-edit-product">Editar</button>
            <button type="button" onclick="removeOSProduct('${product.id}')" class="btn-remove-product">Remover</button>
        </div>
    `;
    
    // Adicionar dados do produto como data attributes
    productDiv.dataset.quantity = quantity;
    productDiv.dataset.price = price;
    // ALTERAÇÃO: Salvar cost_price como data attribute
    productDiv.dataset.costPrice = product.cost_price;
    
    productsList.appendChild(productDiv);
    
    // Atualizar total da OS
    updateOSTotal();
    
    // Fechar modal
    closeAddProductModal();
    
    showToast(`Produto "${product.name}" adicionado à OS!`, 'success');

    // Reabilitar o botão após o sucesso
    if (confirmButton) {
        confirmButton.disabled = false;
        confirmButton.textContent = '✅ Adicionar à OS';
    }
}

// Função para atualizar o total do produto no modal
export function updateProductTotal() {

    
    const quantityElement = document.getElementById('product-quantity');
    const priceElement = document.getElementById('product-custom-price');
    const subtotalElement = document.getElementById('product-subtotal');
    

    
    const quantity = parseInt(quantityElement?.value) || 1;
    const priceText = priceElement?.value || '0,00';
    const price = parseFloat(priceText.replace(/\./g, '').replace(',', '.'));
    const total = quantity * price;
    

    
    if (subtotalElement) {
        const formattedTotal = formatPriceForDisplay(total);
        subtotalElement.textContent = `R$ ${formattedTotal}`;

    } else {

    }
}

// Função para ajustar quantidade no modal
export function adjustQuantity(change) {
    const quantityInput = document.getElementById('product-quantity');
    if (quantityInput) {
        const currentValue = parseInt(quantityInput.value) || 1;
        const newValue = Math.max(1, currentValue + change);
        quantityInput.value = newValue;
        updateProductTotal();
    }
}

// Função para formatar entrada de moeda
export function formatCurrencyInput(input) {
    let value = input.value.replace(/\D/g, '');
    if (value === '') {
        input.value = '';
        return;
    }
    
    value = (parseInt(value) / 100).toFixed(2);
    value = value.replace('.', ',');
    value = value.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
    input.value = value;
    
    updateProductTotal();
}

// Função para abrir o modal de adicionar produto
export function openAddProductModal(product = null) {

    
    const modal = document.getElementById('add-product-modal');

    
    if (modal) {
        // Resetar modal primeiro
        resetAddProductModal();
        
        // Se um produto foi fornecido, preencher os campos
        if (product) {

            
            // Armazenar produto selecionado
            window.selectedProductForOS = product;
            
            // Preencher informações do produto
            const productName = document.getElementById('selected-product-name');
            const productPrice = document.getElementById('product-custom-price');
            const quantityInput = document.getElementById('product-quantity');
            
            if (productName) {
                productName.textContent = product.name;

            }
            
            if (productPrice) {
                const formattedPrice = formatCurrencyBR(product.price);
                productPrice.value = formattedPrice;

            }
            
            if (quantityInput) {
                quantityInput.value = '1';

            }
        }
        

        modal.classList.add('active');
        
        // Verificar estilo computado do modal
        const computedStyle = window.getComputedStyle(modal);

        

        trapFocus(modal); // Garante que o foco fique dentro do modal
        
        // Aguardar um pouco para garantir que os campos foram preenchidos
        setTimeout(() => {

            updateProductTotal();
        }, 100);
        

    } else {
        console.error('Modal add-product-modal não encontrado!');
    }
}

// Função para fechar o modal de adicionar produto
export function closeAddProductModal() {
    const modal = document.getElementById('add-product-modal');
    if (modal) {
        modal.classList.remove('active');
        resetAddProductModal(); // Resetar campos do modal
    }
}

// Função para fechar o modal de visualização de OS
export function closeViewOSModal() {
    const modal = document.getElementById('view-os-modal-container');
    if (modal) {
        modal.classList.remove('active');
    }
}

// Função para editar o preço de um produto na lista da OS
export function editOSProductPrice(productId) {
    const productItem = document.querySelector(`.product-item[data-product-id="${productId}"]`);
    if (!productItem) return;

    const currentQuantity = parseInt(productItem.dataset.quantity);
    const currentPrice = parseFloat(productItem.dataset.price);

    // Salvar o produto selecionado no window para acesso do modal
    window.selectedProductForOS = {
        id: productId,
        name: productItem.querySelector('strong').textContent,
        quantity: currentQuantity,
        price: currentPrice
    };

    // Preencher o modal de edição
    const productNameDisplay = document.getElementById('selected-product-name');
    const productQuantity = document.getElementById('product-quantity');
    const productCustomPrice = document.getElementById('product-custom-price');
    
    if (productNameDisplay) productNameDisplay.textContent = productItem.querySelector('strong').textContent;
    if (productQuantity) productQuantity.value = currentQuantity;
    if (productCustomPrice) productCustomPrice.value = formatPriceForDisplay(currentPrice);

    // O modal de adicionar produto é reutilizado para edição
    openAddProductModal(window.selectedProductForOS);

    // Trocar o manipulador do botão de confirmação para edição
    const confirmButton = document.getElementById('btn-confirm-add-product');
    if (confirmButton) {
        // Remover o listener anterior para evitar duplicação
        confirmButton.removeEventListener('click', saveEditedOSProduct);
        
        // Adicionar o novo listener para salvar a edição
        confirmButton.onclick = () => saveEditedOSProduct(productId);
        confirmButton.textContent = 'Salvar Edição';
    }
}

// Função para salvar o produto editado
export function saveEditedOSProduct(productId) {
    const productItem = document.querySelector(`.product-item[data-product-id="${productId}"]`);
    if (!productItem) return;

    const quantityElement = document.getElementById('product-quantity');
    const priceElement = document.getElementById('product-custom-price');
    
    const newQuantity = parseInt(quantityElement?.value) || 1;
    const newPriceText = priceElement?.value || '0,00';
    const newPrice = parseFloat(newPriceText.replace(/\./g, '').replace(',', '.'));

    if (newQuantity <= 0 || newPrice < 0) {
        showToast('Quantidade e preço devem ser válidos', 'error');
        return;
    }

    // Atualizar os data attributes do elemento
    productItem.dataset.quantity = newQuantity;
    productItem.dataset.price = newPrice;

    // Atualizar o HTML visível
    const formattedPrice = formatPriceForDisplay(newPrice);
    const formattedTotal = formatPriceForDisplay(newQuantity * newPrice);
    productItem.querySelector('small').innerHTML = `Qtd: ${newQuantity} x R$ ${formattedPrice} = R$ ${formattedTotal}`;

    updateOSTotal();
    closeAddProductModal();
    showToast('Produto atualizado com sucesso!', 'success');

    // Restaurar o manipulador original do botão de confirmação
    const confirmButton = document.getElementById('btn-confirm-add-product');
    if (confirmButton) {
        confirmButton.removeEventListener('click', saveEditedOSProduct);
        confirmButton.onclick = confirmAddProduct; // Reverter para a função original de adicionar
        confirmButton.textContent = '✅ Adicionar à OS';
    }
}

// Função para remover produto da lista da OS
export function removeOSProduct(productId) {
    if (confirm('Tem certeza que deseja remover este produto da OS?')) {
        const productItem = document.querySelector(`.product-item[data-product-id="${productId}"]`);
        if (productItem) {
            productItem.remove();
            updateOSTotal();
            showToast('Produto removido da OS.', 'info');
        }
    }
}

// Função para atualizar total da OS
export function updateOSTotal() {
    const productItems = document.querySelectorAll('.product-item[data-product-id]');
    let productsTotal = 0;
    
    productItems.forEach(item => {
        const quantity = parseInt(item.dataset.quantity) || 0;
        const price = parseFloat(item.dataset.price) || 0;
        productsTotal += quantity * price;
    });
    
    // Obter valor base da OS (serviço)
    const quoteValueInput = document.getElementById('os-quote-value');
    if (quoteValueInput) {
        // Se não há valor base, usar apenas o total dos produtos
        let baseValue = 0;
        if (!quoteValueInput.dataset.baseValue) {
            const currentValue = parseFloat(quoteValueInput.value.replace(/\./g, '').replace(',', '.')) || 0;
            // Se o valor atual é diferente do total de produtos, assumir que é o valor base
            if (currentValue !== productsTotal) {
                baseValue = currentValue - (parseFloat(quoteValueInput.dataset.lastProductsTotal) || 0);
                quoteValueInput.dataset.baseValue = baseValue;
            }
        } else {
            baseValue = parseFloat(quoteValueInput.dataset.baseValue) || 0;
        }
        
        const newTotal = baseValue + productsTotal;
        const formattedTotal = formatPriceForDisplay(newTotal);
        quoteValueInput.value = formattedTotal;
        quoteValueInput.dataset.lastProductsTotal = productsTotal;
    }
}

export function setupOrderForm(currentUser, selectedStoreId) {
    const searchInput = document.getElementById('os-customer-search');
    const resultsContainer = document.getElementById('os-customer-results');
    const selectedCustomerIdInput = document.getElementById('os-selected-customer-id');
    const osForm = document.getElementById('new-os-form');

    // Configurar busca inicialmente
    setupCustomerSearch('os-customer-search', 'os-customer-results', 'os-selected-customer-id');
    
    // Configurar formatação de valores
    setupValueFormatting(['os-quote-value', 'os-amount-paid']);
    
    // Configurar autocomplete de produtos
    setupOSProductAutocomplete();

    // Inicializar o formulário de ordem de serviço (com validação e envio)
    initializeOrderForm();

    // Configurar botão para abrir modal de novo cliente com timeout para garantir que o DOM esteja carregado
    setTimeout(() => {
        const btnOpenNewCustomerModal = document.getElementById('btn-open-new-customer-modal');
        
        if (btnOpenNewCustomerModal) {
            
            // Remover event listeners existentes para evitar duplicação
            btnOpenNewCustomerModal.removeEventListener('click', handleNewCustomerClick);
            
            // Adicionar novo event listener
            btnOpenNewCustomerModal.addEventListener('click', handleNewCustomerClick);
        }
    }, 200);
    
    // Função para lidar com o clique no botão de novo cliente
    function handleNewCustomerClick(e) {
        e.preventDefault();
        e.stopPropagation();
        
        if (typeof window.openNewCustomerModal === 'function') {
            window.openNewCustomerModal();
        } else if (typeof openNewCustomerModal === 'function') {
            openNewCustomerModal();
        }
    }
    
    // Configurar eventos do modal de novo cliente
    const newCustomerModal = document.getElementById('new-customer-modal');
    if (newCustomerModal) {
        // Botão fechar (X)
        const btnCloseNewCustomer = document.getElementById('btn-close-new-customer-modal');
        if (btnCloseNewCustomer) {
            btnCloseNewCustomer.addEventListener('click', closeNewCustomerModal);
        }
        
        // Botão cancelar
        const btnCancelNewCustomer = document.getElementById('btn-cancel-new-customer-modal');
        if (btnCancelNewCustomer) {
            btnCancelNewCustomer.addEventListener('click', closeNewCustomerModal);
        }
        
        // Event listener do formulário será configurado pelo main.js para evitar duplicação
        
        // Fechar modal ao clicar fora
        newCustomerModal.addEventListener('click', function(e) {
            if (e.target === newCustomerModal) {
                closeNewCustomerModal();
            }
        });
        
        // Fechar modal com ESC
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape' && newCustomerModal.style.display === 'flex') {
                closeNewCustomerModal();
            }
        });
    }

    // Salvamento da OS
    if (osForm) {
        // Remove event listeners existentes para evitar duplicação
        const newForm = osForm.cloneNode(true);
        osForm.parentNode.replaceChild(newForm, osForm);
        
        // Atualizar referências após clonagem
        const newSelectedCustomerIdInput = document.getElementById('os-selected-customer-id');
        const newCustomerFormContainer = document.getElementById('new-customer-os-form');
        
        // Reconfigurar busca de clientes após clonagem
        setupCustomerSearch('os-customer-search', 'os-customer-results', 'os-selected-customer-id');
        
        // Reconfigurar formatação de valores após clonagem
        setupValueFormatting(['os-quote-value', 'os-amount-paid']);
        
        // Reconfigurar autocomplete de produtos após clonagem
        setupOSProductAutocomplete();
        
        newForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const submitBtn = newForm.querySelector('button[type="submit"]');
            submitBtn.disabled = true;
            submitBtn.textContent = 'Salvando...';
            
            // Validação de campos obrigatórios
            const requiredFields = [
                { id: 'os-brand', name: 'Marca' },
                { id: 'os-model', name: 'Modelo' },
                { id: 'os-color', name: 'Cor' },
                { id: 'os-quote-value', name: 'Valor' },
                { id: 'os-problem', name: 'Defeito' },
                { id: 'os-delivery-date', name: 'Data de Entrega' }
            ];
            
            for (const field of requiredFields) {
                const element = document.getElementById(field.id);
                if (!element) {
                    showToast(`Campo "${field.name}" não encontrado!`, 'error');
                    submitBtn.disabled = false;
                    submitBtn.textContent = '💾 Salvar OS';
                    return;
                }
                
                // Validação especial para select
                if (element.tagName === 'SELECT') {
                    if (!element.value || element.value === '') {
                        showToast(`Campo "${field.name}" é obrigatório!`, 'error');
                        element.focus();
                        submitBtn.disabled = false;
                        submitBtn.textContent = '💾 Salvar OS';
                        return;
                    }
                } else {
                    if (!element.value || !element.value.trim()) {
                        showToast(`Campo "${field.name}" é obrigatório!`, 'error');
                        element.focus();
                        submitBtn.disabled = false;
                        submitBtn.textContent = '💾 Salvar OS';
                        return;
                    }
                }
            }
            
            try {
                let customerId = newSelectedCustomerIdInput.value ? Number(newSelectedCustomerIdInput.value) : null;
                if (!customerId && newCustomerFormContainer && newCustomerFormContainer.style.display !== 'none') {
                    const customerData = {
                        full_name: document.getElementById('os-new-customer-name')?.value || '',
                        phone: document.getElementById('os-new-customer-phone')?.value || '',
                        birth_date: document.getElementById('os-new-customer-birth-date')?.value || null,
                        address: {
                            street: document.getElementById('os-new-customer-street')?.value || '',
                            number: document.getElementById('os-new-customer-number')?.value || '',
                            neighborhood: document.getElementById('os-new-customer-neighborhood')?.value || '',
                            city: document.getElementById('os-new-customer-city')?.value || '',
                            state: document.getElementById('os-new-customer-state')?.value || '',
                            zip: document.getElementById('os-new-customer-zip')?.value || ''
                        },
                        user_id: getCurrentUser()?.id || null
                    };

                    const { data: newCustomer, error: customerError } = await dbInsert('customers', [customerData], '*');

                    if (customerError) {
                        console.error('Erro ao cadastrar novo cliente para OS:', customerError);
                        showToast(`Erro ao cadastrar cliente: ${customerError.message}`, 'error');
                        submitBtn.disabled = false;
                        submitBtn.textContent = '💾 Salvar OS';
                        return;
                    }
                    customerId = newCustomer[0].id;
                }

                // Coletar produtos adicionados à OS
                const productsList = document.getElementById('os-products-list');
                const osProducts = [];
                if (productsList) {
                    const productItems = productsList.querySelectorAll('.product-item');
                    productItems.forEach(item => {
                        osProducts.push({
                            id: item.dataset.productId,
                            name: item.querySelector('strong').textContent,
                            quantity: parseInt(item.dataset.quantity),
                            price: parseFloat(item.dataset.price),
                            cost_price: parseFloat(item.dataset.costPrice)
                        });
                    });
                }
                
                // Captura os dados do checklist
                const checkBateria = document.querySelector('input[name="check-bateria"]:checked')?.value || 'nao';
                const checkChip = document.querySelector('input[name="check-chip"]:checked')?.value || 'nao';
                const checkCarregador = document.querySelector('input[name="check-carregador"]:checked')?.value || 'nao';
                const checkFone = document.querySelector('input[name="check-fone"]:checked')?.value || 'nao';
                const checkAranhado = document.querySelector('input[name="check-aranhado"]:checked')?.value || 'nao';

                const osData = {
                    customer_id: customerId,
                    client_name: document.getElementById('os-new-customer-name')?.value || '',
                    equipment_brand: document.getElementById('os-brand')?.value || '',
                    equipment_model: document.getElementById('os-model')?.value || '',
                    color: document.getElementById('os-color')?.value || '',
                    serial_number: '',
                    problem_description: document.getElementById('os-problem')?.value || '',
                    solution: document.getElementById('os-solution')?.value || '',
                    quote_value: parseFloat((document.getElementById('os-quote-value')?.value || '0').replace(/\./g, '').replace(',', '.')),
                    amount_paid: parseFloat((document.getElementById('os-amount-paid')?.value || '0').replace(/\./g, '').replace(',', '.')),
                    payment_method: document.getElementById('os-payment-method')?.value || '',
                    estimated_delivery_date: (() => {
                        const deliveryDateElement = document.getElementById('os-delivery-date');
                        const deliveryDateValue = deliveryDateElement?.value || '';
                        
                        // Se há valor, converter para timestamp mantendo o timezone local
                        let finalValue = '';
                        if (deliveryDateValue) {
                            // Criar timestamp no timezone local (sem conversão UTC)
                            const localDate = new Date(deliveryDateValue);
                            // Ajustar para timezone local brasileiro (UTC-3)
                            const offsetMinutes = localDate.getTimezoneOffset();
                            const localTimestamp = new Date(localDate.getTime() - (offsetMinutes * 60000));
                            finalValue = localTimestamp.toISOString();
                        }
                        
                        console.log('🕐 Data de entrega capturada:', {
                            elemento: deliveryDateElement,
                            valorOriginal: deliveryDateValue,
                            tipoInput: deliveryDateElement?.type,
                            valorFinal: finalValue
                        });
                        
                        return finalValue;
                    })(),
                    equipment_password: document.getElementById('os-password')?.value || '',
                    pattern_lock_value: document.getElementById('os-pattern-lock-value')?.value || '',
                    status: document.getElementById('os-status')?.value || 'pending',
                    notes: document.getElementById('os-notes')?.value || '',
                    user_id: getCurrentUser()?.id,
                    store_id: getSelectedStoreId(),
                    // Dados do checklist como JSON
                    accessories_checklist: {
                        bateria: checkBateria,
                        chip: checkChip,
                        carregador: checkCarregador,
                        fone: checkFone,
                        aranhado: checkAranhado
                    },
                    products: osProducts // Adiciona os produtos
                };

                const { data, error } = await dbInsert('service_orders', [osData], '*');

                if (error) throw error;
                
                // Log dos dados salvos no banco
                console.log('✅ OS salva no banco:', {
                    dadosEnviados: osData,
                    dadosRetornados: data,
                    dataEntregaEnviada: osData.estimated_delivery_date,
                    dataEntregaSalva: data?.[0]?.estimated_delivery_date
                });
                
                showToast('Ordem de Serviço criada com sucesso!', 'success');
                closeNewOSModal();
                refreshOSList(selectedStoreId);
                document.getElementById('new-os-form').reset();
                document.getElementById('os-products-list').innerHTML = ''; // Limpar lista de produtos
            } catch (error) {
                console.error('Erro ao salvar OS:', error);
                showToast(`Erro ao salvar OS: ${error.message}`, 'error');
            } finally {
                submitBtn.disabled = false;
                submitBtn.textContent = '💾 Salvar OS';
            }
        });
    }
}

// Função loadOSBrands removida - agora usamos input de texto para marcas

// Função para atualizar o status da OS
export async function updateOSStatus(osId, newStatus) {
    try {
        const { error } = await dbUpdate('service_orders', { status: newStatus }, { eq: { id: osId } });

        if (error) throw error;

        showToast(`Status da OS ${osId} atualizado para: ${newStatus}`, 'success');
        const selectedStoreId = getSelectedStoreId();
        refreshOSList(selectedStoreId);
    } catch (error) {
        console.error('Erro ao atualizar status da OS:', error);
        showToast(`Erro ao atualizar status: ${error.message}`, 'error');
    }
}

// Funções de atalho para atualização de status
export function markAsAwaitingPickup(osId) {
    updateOSStatus(osId, 'awaiting_pickup');
}

export async function markAsDelivered(osId) {
    // Marcando como entregue
    // Mostrar modal de confirmação
    showDeliveryConfirmationModal(osId);
}

// Função para mostrar modal de confirmação de entrega
function showDeliveryConfirmationModal(osId) {
    // Mostrando modal de confirmação
    
    const modal = document.getElementById('delivery-confirmation-modal');
    const osIdSpan = document.getElementById('delivery-confirmation-os-id');
    const confirmBtn = document.getElementById('btn-confirm-delivery');
    const cancelBtn = document.getElementById('btn-cancel-delivery');
    const closeBtn = document.getElementById('btn-close-delivery-confirmation');
    
    // Elementos do modal verificados
    
    if (!modal) {
        console.error('❌ Modal delivery-confirmation-modal não encontrado!');
        return;
    }
    
    // Definir o ID da OS no modal
    if (osIdSpan) {
        osIdSpan.textContent = osId;
    }
    
    // Mostrar o modal
    modal.style.display = 'flex';
    
    // Função para fechar o modal
    const closeModal = () => {
        modal.style.display = 'none';
        // Remover event listeners
        confirmBtn.removeEventListener('click', handleConfirm);
        cancelBtn.removeEventListener('click', closeModal);
        closeBtn.removeEventListener('click', closeModal);
    };
    
    // Função para confirmar a entrega
    const handleConfirm = () => {
        closeModal();
        processDelivery(osId);
    };
    
    // Adicionar event listeners
    confirmBtn.addEventListener('click', handleConfirm);
    cancelBtn.addEventListener('click', closeModal);
    closeBtn.addEventListener('click', closeModal);
}

// Função para processar a entrega após confirmação
async function processDelivery(osId) {
    // Processando entrega
    try {
        const { error } = await dbUpdate('service_orders', { status: 'delivered' }, { eq: { id: osId } });

        if (error) throw error;
        
        showToast('OS marcada como entregue com sucesso!', 'success');
        const selectedStoreId = getSelectedStoreId();
        
        // Buscar produtos da OS diretamente da tabela service_orders
        const { data: serviceOrder, error: osError } = await dbSelect('service_orders', {
            select: 'products',
            eq: { id: osId }
        });
        
        // OS encontrada
        
        if (osError) {
            console.error('Erro ao buscar OS:', osError);
        }
        
        // Se há produtos na coluna products, abrir modal de lançamento no caixa automaticamente
        if (serviceOrder && serviceOrder[0] && serviceOrder[0].products && serviceOrder[0].products.length > 0) {
            // Produtos carregados
            const products = serviceOrder[0].products;
            
            // Verificar se há um caixa aberto para a loja selecionada
            // Verificando caixa aberto
            const { data: openCash, error: cashError } = await supabase
                .from('cash_registers')
                .select('id')
                .eq('status', 'open')
                .eq('store_id', selectedStoreId)
                .order('opened_at', { ascending: false })
                .limit(1)
                .single();

            // Resultado da busca por caixa obtido

            if (cashError && cashError.details !== 'No rows found') {
                console.error('Erro ao buscar caixa aberto:', cashError);
                showToast('Nenhum caixa aberto para esta loja. Abra um caixa primeiro.', 'error');
                refreshOSList(selectedStoreId);
                return;
            }

            if (!openCash) {
    
                showToast('Nenhum caixa aberto para esta loja. Abra um caixa primeiro.', 'error');
                refreshOSList(selectedStoreId);
                return;
            }
            
            const cashRegisterId = openCash.id;
            const totalAmount = calculateOSProductsTotal(products);
            
            // Abrindo modal de pagamento
            // Abrir modal de pagamento diretamente
            openOSPaymentModal(osId, products, totalAmount, cashRegisterId, window.printWithToast);
        } else {

            refreshOSList(selectedStoreId);
        }
        
    } catch (error) {
        console.error('Erro ao marcar OS como entregue:', error);
        showToast(`Erro ao marcar como entregue: ${error.message}`, 'error');
    }
}

// Função para calcular o total dos produtos da OS
export function calculateOSProductsTotal(products) {
    return products.reduce((total, product) => total + (product.quantity * product.price), 0);
}

// Função para lançar produtos de uma OS para o caixa (PDV) - REMOVIDA
// A lógica foi movida para markAsDelivered para abrir o modal automaticamente

// Função para abrir o modal de pagamento da OS
export async function openOSPaymentModal(osId, products, totalAmount, cashRegisterId, printWithToastCallback = null) {
    // Abrindo modal de pagamento da OS
    
    const modal = document.getElementById('os-payment-modal');
    const totalDisplay = document.getElementById('os-payment-total');
    const osIdInput = document.getElementById('os-payment-os-id');
    const cashRegisterIdInput = document.getElementById('os-payment-cash-register-id');
    const productsInput = document.getElementById('os-payment-products');

    // Elementos do modal verificados

    if (modal && totalDisplay && osIdInput && cashRegisterIdInput && productsInput) {
        // Todos os elementos encontrados
        totalDisplay.textContent = formatCurrencyBR(totalAmount);
        osIdInput.value = osId;
        cashRegisterIdInput.value = cashRegisterId;
        productsInput.value = JSON.stringify(products);
        
        // Remove o style inline que pode estar bloqueando a exibição
        modal.style.display = 'flex';
        modal.classList.add('active');
        
        // Modal configurado e exibido
        
        trapFocus(modal);
        setupOSPaymentEvents(totalAmount);
    } else {
        console.error('❌ Alguns elementos do modal de pagamento não foram encontrados');
    }
}

// Função para configurar eventos do modal de pagamento da OS (divisão de pagamento)
export function setupOSPaymentEvents(totalAmount) {
    const osPaymentModal = document.getElementById('os-payment-modal');
    const btnFinishPaymentOS = document.getElementById('btn-finish-payment-os');
    const osPaymentMethodsDiv = document.getElementById('os-payment-methods');
    const osPaymentAmountPaidInput = document.getElementById('os-payment-amount-paid');

    // Garante que o totalDisplay esteja formatado na moeda correta
    document.getElementById('os-payment-total').textContent = formatCurrencyBR(totalAmount);

    const paymentFields = {
        'os-payment-dinheiro': 0,
        'os-payment-credito': 0,
        'os-payment-debito': 0,
        'os-payment-pix': 0
    };

    // Remove listeners existentes antes de adicionar novos para evitar duplicação
    const oldBtnFinishPaymentOS = btnFinishPaymentOS.cloneNode(true);
    btnFinishPaymentOS.parentNode.replaceChild(oldBtnFinishPaymentOS, btnFinishPaymentOS);
    const newBtnFinishPaymentOS = document.getElementById('btn-finish-payment-os');

    const oldOsPaymentMethodsDiv = osPaymentMethodsDiv.cloneNode(true);
    osPaymentMethodsDiv.parentNode.replaceChild(oldOsPaymentMethodsDiv, osPaymentMethodsDiv);
    const newOsPaymentMethodsDiv = document.getElementById('os-payment-methods');

    const oldOsPaymentAmountPaidInput = osPaymentAmountPaidInput.cloneNode(true);
    osPaymentAmountPaidInput.parentNode.replaceChild(oldOsPaymentAmountPaidInput, osPaymentAmountPaidInput);
    const newOsPaymentAmountPaidInput = document.getElementById('os-payment-amount-paid');


    // Função auxiliar para preencher o campo com o valor restante ou total
    const preencherCampo = (campo) => {
        const currentTotalPaid = Object.values(paymentFields).reduce((sum, val) => sum + val, 0);
        const remaining = totalAmount - currentTotalPaid;
        if (remaining > 0) {
            campo.value = formatPriceForDisplay(remaining);
        } else {
            campo.value = formatPriceForDisplay(totalAmount); // Valor total se nada foi pago
        }
        campo.focus();
    };

    // Atribui as funções auxiliares aos elementos globais (window) para acesso pelos botões onclick
    window.preencherCampo = preencherCampo;
    window.preencherDinheiroOS = () => preencherCampo(document.getElementById('os-payment-dinheiro'));
    window.preencherCreditoOS = () => preencherCampo(document.getElementById('os-payment-credito'));
    window.preencherDebitoOS = () => preencherCampo(document.getElementById('os-payment-debito'));
    window.preencherPixOS = () => preencherCampo(document.getElementById('os-payment-pix'));

    // Adiciona event listeners para formatar valores e atualizar o resumo da divisão
    newOsPaymentMethodsDiv.querySelectorAll('input[type="text"]').forEach(input => {
        setupValueFormattingForOSPayment(input); // Aplica a formatação em tempo real
        input.addEventListener('input', () => updateOSSplitSummary(totalAmount));
        input.addEventListener('change', () => updateOSSplitSummary(totalAmount)); // Garante atualização ao sair do foco
    });

    // Adiciona listener para o botão de finalizar pagamento
    if (newBtnFinishPaymentOS) {
        newBtnFinishPaymentOS.onclick = async () => {
            // Coletar valores dos inputs de pagamento
            const dinheiroInput = document.getElementById('os-payment-dinheiro');
            const creditoInput = document.getElementById('os-payment-credito');
            const debitoInput = document.getElementById('os-payment-debito');
            const pixInput = document.getElementById('os-payment-pix');
            
            const dinheiroValue = parseFloat((dinheiroInput?.value || '0').replace(/\./g, '').replace(',', '.')) || 0;
            const creditoValue = parseFloat((creditoInput?.value || '0').replace(/\./g, '').replace(',', '.')) || 0;
            const debitoValue = parseFloat((debitoInput?.value || '0').replace(/\./g, '').replace(',', '.')) || 0;
            const pixValue = parseFloat((pixInput?.value || '0').replace(/\./g, '').replace(',', '.')) || 0;
            
            // Calcular o valor total pago
            const amountPaidValue = dinheiroValue + creditoValue + debitoValue + pixValue;
            
            // Valores de pagamento coletados
            
            if (amountPaidValue === 0) {
                showToast('Informe pelo menos um valor de pagamento.', 'error');
                return;
            }

            if (amountPaidValue < totalAmount) {
                showToast('O valor pago é menor que o valor total da OS.', 'error');
                return;
            }
            if (amountPaidValue > totalAmount) {
                showToast('O valor pago é maior que o valor total da OS. Verifique os valores.', 'error');
                return;
            }

            const osId = document.getElementById('os-payment-os-id')?.value || '';
        const cashRegisterId = document.getElementById('os-payment-cash-register-id')?.value || '';
        const products = JSON.parse(document.getElementById('os-payment-products')?.value || '[]');

            // Coletar detalhes dos pagamentos divididos
            const payments = [];
            for (const fieldId in paymentFields) {
                const value = parseFloat((document.getElementById(fieldId)?.value || '0').replace(/\./g, '').replace(',', '.')) || 0;
                if (value > 0) {
                    payments.push({
                        method: fieldId.replace('os-payment-', ''),
                        amount: value
                    });
                }
            }

            try {
                // Inserir os lançamentos no caixa
                const cashEntries = payments.map(p => ({
                    cash_register_id: cashRegisterId,
                    type: 'entrada',
                    amount: p.amount,
                    payment_method: p.method,
                    description: `Venda OS #${osId} - Produto: ${products.map(p => p.name).join(', ')}`,
                    sale_id: null, // Será preenchido após a venda
                    service_order_id: osId
                }));
                
                // Dados preparados para inserção no caixa

                const { error: entryError } = await supabase
                    .from('cash_register_entries')
                    .insert(cashEntries);

                if (entryError) throw entryError;

                // Atualizar status da OS para 'Concluída' ou 'Entregue' se o valor pago for total
                if (amountPaidValue === totalAmount) {
                    await updateOSStatus(osId, 'delivered');
                }

                // Reduzir estoque dos produtos
                for (const product of products) {
                    if (product.track_stock) {
                        const { error: updateError } = await supabase
                            .from('products')
                            .update({ stock: product.stock - product.quantity })
                            .eq('id', product.id);
                        if (updateError) console.error('Erro ao atualizar estoque:', updateError);
                    }
                }
                
                showToast('Pagamento da OS finalizado e estoque atualizado!', 'success');
                closeOSPaymentModal();
                const selectedStoreId = getSelectedStoreId();
                refreshOSList(selectedStoreId);
                // Opcional: imprimir a OS após o pagamento
                if (printWithToastCallback) printWithToastCallback(osId);

            } catch (error) {
                console.error('Erro ao finalizar pagamento da OS:', error);
                showToast(`Erro ao finalizar pagamento: ${error.message}`, 'error');
            }
        };
    }
}

// Função para formatar campos de valor no modal de pagamento da OS (interna)
function setupValueFormattingForOSPayment(field) {
    field.addEventListener('input', function(e) {
        let value = e.target.value.replace(/[^\d,]/g, ''); // Remove tudo exceto números e vírgula
        let parts = value.split(',');
        let integerPart = parts[0];
        let decimalPart = parts[1] || '';
        if (decimalPart.length > 2) decimalPart = decimalPart.substring(0, 2);
        if (integerPart.length > 3) integerPart = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
        let formattedValue = integerPart;
        if (parts.length > 1 || decimalPart) formattedValue += ',' + decimalPart;
        e.target.value = formattedValue;
    });
    
    field.addEventListener('focus', function(e) {
        e.target.value = e.target.value.replace(/\./g, ''); // Remove pontos
    });
    
    field.addEventListener('blur', function(e) {
        let value = e.target.value.replace(/[^\d,]/g, '');
        if (value) {
            let parts = value.split(',');
            let integerPart = parts[0];
            let decimalPart = parts[1] || '';
            if (decimalPart.length > 2) decimalPart = decimalPart.substring(0, 2);
            if (integerPart.length > 3) integerPart = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
            let formattedValue = integerPart;
            if (decimalPart) formattedValue += ',' + decimalPart;
            e.target.value = formattedValue;
        }
    });
}

// Função para atualizar o resumo da divisão de pagamento da OS
export function updateOSSplitSummary(totalAmount) {
    let totalPaid = 0;
    const paymentInputs = [
        document.getElementById('os-payment-dinheiro'),
        document.getElementById('os-payment-credito'),
        document.getElementById('os-payment-debito'),
        document.getElementById('os-payment-pix')
    ];

    paymentInputs.forEach(input => {
        if (input) {
            totalPaid += parseFloat(input.value.replace(/\./g, '').replace(',', '.')) || 0;
        }
    });

    const remaining = totalAmount - totalPaid;
    const totalPaidDisplay = document.getElementById('os-payment-total-paid');
    const remainingDisplay = document.getElementById('os-payment-remaining');
    const btnFinishPaymentOS = document.getElementById('btn-finish-payment-os');

    if (totalPaidDisplay) totalPaidDisplay.textContent = formatCurrencyBR(totalPaid);
    if (remainingDisplay) remainingDisplay.textContent = formatCurrencyBR(remaining);

    if (btnFinishPaymentOS) {
        if (remaining <= 0.01 && remaining >= -0.01) { // Pequena tolerância para float
            btnFinishPaymentOS.disabled = false;
            btnFinishPaymentOS.textContent = '✅ Finalizar Pagamento';
        } else {
            btnFinishPaymentOS.disabled = true;
            btnFinishPaymentOS.textContent = 'Finalizar Pagamento';
        }
    }
}

// Função para deletar uma Ordem de Serviço
export async function deleteOS(osId, selectedStoreId, printWithToastCallback = null) {
    if (confirm('Tem certeza que deseja DELETAR esta Ordem de Serviço? Esta ação é irreversível!')) {
        try {
            const { error } = await supabase
                .from('service_orders')
                .delete()
                .eq('id', osId);

            if (error) throw error;

            showToast('OS deletada com sucesso!', 'success');
            refreshOSList(selectedStoreId, printWithToastCallback);
        } catch (error) {
            console.error('Erro ao deletar OS:', error);
            showToast(`Erro ao deletar OS: ${error.message}`, 'error');
        }
    }
}

// Função para visualizar detalhes da OS em um modal
// Função para desenhar o padrão no modal de visualização
function drawViewPattern(pattern) {
    console.log('drawViewPattern chamada com padrão:', pattern);
    const canvas = document.getElementById('view-pattern-canvas');
    if (!canvas) {
        console.error('Canvas view-pattern-canvas não encontrado!');
        return;
    }
    const ctx = canvas.getContext('2d');
    
    // Limpar canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    const dots = [];
    const margin = 15;
    const radius = 6;
    
    // Criar grid 3x3 de pontos
    for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
            dots.push({ 
                x: margin + j * ((canvas.width - 2 * margin) / 2), 
                y: margin + i * ((canvas.height - 2 * margin) / 2),
                id: i * 3 + j + 1
            });
        }
    }
    
    // Desenhar todos os pontos
    dots.forEach(dot => {
        ctx.beginPath();
        ctx.arc(dot.x, dot.y, radius, 0, 2 * Math.PI);
        ctx.fillStyle = '#ddd';
        ctx.fill();
        ctx.strokeStyle = '#999';
        ctx.lineWidth = 1;
        ctx.stroke();
    });

    // Conectar os pontos do padrão
    if (pattern && pattern.length > 1) {
        const patternDots = pattern.split('').map(id => dots.find(d => d.id == id)).filter(Boolean);
        
        if (patternDots.length > 1) {
            // Destacar pontos do padrão
            patternDots.forEach(dot => {
                ctx.beginPath();
                ctx.arc(dot.x, dot.y, radius, 0, 2 * Math.PI);
                ctx.fillStyle = '#007bff';
                ctx.fill();
                ctx.strokeStyle = '#0056b3';
                ctx.lineWidth = 2;
                ctx.stroke();
            });
            
            // Desenhar linhas conectando os pontos
            ctx.beginPath();
            ctx.moveTo(patternDots[0].x, patternDots[0].y);
            for (let i = 1; i < patternDots.length; i++) {
                ctx.lineTo(patternDots[i].x, patternDots[i].y);
            }
            ctx.strokeStyle = '#007bff';
            ctx.lineWidth = 3;
            ctx.stroke();

            // Desenhar setas para indicar direção
            for (let i = 0; i < patternDots.length - 1; i++) {
                drawViewArrow(ctx, patternDots[i].x, patternDots[i].y, patternDots[i+1].x, patternDots[i+1].y);
            }
        }
    }
    console.log('drawViewPattern executada com sucesso!');
}

// Função auxiliar para desenhar setas
function drawViewArrow(ctx, fromx, fromy, tox, toy) {
    const headlen = 8;
    const angle = Math.atan2(toy-fromy, tox-fromx);
    
    // Calcular ponto no meio da linha para posicionar a seta
    const midx = (fromx + tox) / 2;
    const midy = (fromy + toy) / 2;
    
    ctx.beginPath();
    ctx.moveTo(midx, midy);
    ctx.lineTo(midx - headlen * Math.cos(angle - Math.PI/6), midy - headlen * Math.sin(angle - Math.PI/6));
    ctx.moveTo(midx, midy);
    ctx.lineTo(midx - headlen * Math.cos(angle + Math.PI/6), midy - headlen * Math.sin(angle + Math.PI/6));
    ctx.strokeStyle = '#007bff';
    ctx.lineWidth = 2;
    ctx.stroke();
}

export async function viewOS(osId, printWithToastCallback = null) {
    try {
        const { data: os, error } = await dbSelect('service_orders', {
            select: '*, customers (id, full_name, phone, birth_date, address)',
            eq: { id: osId },
            single: true
        });

        if (error) {
            if (error.code === 'PGRST116') { // No rows found
                showToast('OS não encontrada.', 'error');
                return;
            }
            throw error;
        }

        if (!os) {
            showToast('OS não encontrada.', 'error');
            return;
        }
        
        // Preencher o modal de visualização
        console.log('Dados da OS recebidos:', os);
        
        // Se os dados vierem como array, pegar o primeiro elemento
        const osData = Array.isArray(os) ? os[0] : os;
        console.log('Dados da OS processados:', osData);
        
        // Verificar se os elementos existem antes de preencher
        const elements = {
            'view-os-id': document.getElementById('view-os-id'),
            'view-os-status': document.getElementById('view-os-status'),
            'view-os-customer-name': document.getElementById('view-os-customer-name'),
            'view-os-customer-phone': document.getElementById('view-os-customer-phone'),
            'view-os-customer-address': document.getElementById('view-os-customer-address'),
            'view-os-brand': document.getElementById('view-os-brand'),
            'view-os-model': document.getElementById('view-os-model'),
            'view-os-color': document.getElementById('view-os-color'),
            'view-os-problem': document.getElementById('view-os-problem'),
            'view-os-quote-value': document.getElementById('view-os-quote-value')
        };
        

        
        // Preencher informações básicas
        if (elements['view-os-id']) {
            elements['view-os-id'].textContent = osData.id || 'N/A';
        }
        
        if (elements['view-os-status']) {
            const statusText = getStatusText(osData.status);
            elements['view-os-status'].textContent = statusText;
        }
        
        // Preencher informações do cliente
        if (elements['view-os-customer-name']) {
            const customerName = osData.customers?.full_name || 'N/A';
            elements['view-os-customer-name'].textContent = customerName;
        }
        
        if (elements['view-os-customer-phone']) {
            const customerPhone = osData.customers?.phone ? formatPhone(osData.customers.phone) : 'N/A';
            elements['view-os-customer-phone'].textContent = customerPhone;
        }
        
        if (elements['view-os-customer-address']) {
            const customerAddress = osData.customers?.address ? 
                `${osData.customers.address.street || ''}, ${osData.customers.address.number || ''} - ${osData.customers.address.neighborhood || ''}, ${osData.customers.address.city || ''}/${osData.customers.address.state || ''} - ${osData.customers.address.zip || ''}`.replace(/, \s*-\s*,/g, ', ').replace(/,\s*,/g, ',').trim().replace(/^,/, '').replace(/,$/, '') : 'N/A';
            elements['view-os-customer-address'].textContent = customerAddress;
        }
        
        // Preencher informações do equipamento
        if (elements['view-os-brand']) {
            const brand = osData.equipment_brand || 'N/A';
            elements['view-os-brand'].textContent = brand;
        }
        
        if (elements['view-os-model']) {
            const model = osData.equipment_model || 'N/A';
            elements['view-os-model'].textContent = model;
        }
        
        if (elements['view-os-color']) {
            const color = osData.color || 'N/A';
            elements['view-os-color'].textContent = color;
        }
        
        if (elements['view-os-problem']) {
            const problem = osData.problem_description || 'N/A';
            elements['view-os-problem'].textContent = problem;
        }
        
        // Ocultar campo Solução Aplicada se não houver solução
        const solutionElement = document.getElementById('view-os-solution');
        const solutionContainer = solutionElement?.closest('.os-view-item');
        if (solutionContainer && osData.solution && osData.solution.trim() !== '' && osData.solution !== 'N/A') {
            solutionElement.textContent = osData.solution;
            solutionContainer.style.display = 'block';
        } else if (solutionContainer) {
            solutionContainer.style.display = 'none';
        }
        
        // Preencher informações financeiras
        const quoteValueElement = document.getElementById('view-os-quote-value');
        if (quoteValueElement) {
            let quoteValue = (osData.quote_value !== null && osData.quote_value !== undefined) ? 
                parseFloat(String(osData.quote_value).replace(',', '.')) || 0 : 0;
            
            // Se o valor do orçamento for 0 mas há produtos, calcular o total dos produtos
            if (quoteValue === 0 && osData.products && osData.products.length > 0) {
                quoteValue = calculateOSProductsTotal(osData.products);
            }
            
            const formattedValue = quoteValue.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
            quoteValueElement.textContent = formattedValue;
        }
        
        const amountPaidElement = document.getElementById('view-os-amount-paid');
        if (amountPaidElement) {
            let amountPaid = 0;
            
            // Verificar diferentes possíveis campos para valor pago
            if (osData.amount_paid !== null && osData.amount_paid !== undefined) {
                amountPaid = parseFloat(String(osData.amount_paid).replace(',', '.')) || 0;
            } else if (osData.paid_amount !== null && osData.paid_amount !== undefined) {
                amountPaid = parseFloat(String(osData.paid_amount).replace(',', '.')) || 0;
            }
            
            const formattedAmountPaid = amountPaid.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
            amountPaidElement.textContent = formattedAmountPaid;
        }
        
        const paymentMethodElement = document.getElementById('view-os-payment-method');
        if (paymentMethodElement) {
            const paymentMethod = osData.payment_method || 'N/A';
            paymentMethodElement.textContent = paymentMethod;
        }
        
        const deliveryDateElement = document.getElementById('view-os-delivery-date');
        if (deliveryDateElement) {
            const deliveryDate = osData.estimated_delivery_date ? formatDateForDisplay(osData.estimated_delivery_date, true) : 'N/A';
            deliveryDateElement.textContent = deliveryDate;
        }
        
        const notesElement = document.getElementById('view-os-notes');
        if (notesElement) {
            const notes = osData.notes || 'N/A';
            notesElement.textContent = notes;
        }
        
        const createdAtElement = document.getElementById('view-os-created-at');
        if (createdAtElement) {
            const createdAt = formatDateForDisplay(osData.created_at, true);
            createdAtElement.textContent = createdAt;
        }
        
        const updatedAtElement = document.getElementById('view-os-updated-at');
        if (updatedAtElement) {
            updatedAtElement.textContent = 'N/A'; // Campo updated_at não existe na tabela
        }

        // Produtos da OS
        const viewProductsList = document.getElementById('view-os-products-list');
        if (viewProductsList) {
            viewProductsList.innerHTML = '';
            if (osData.products && osData.products.length > 0) {
                osData.products.forEach(product => {
                    const productItem = document.createElement('div');
                    productItem.className = 'product-item-view';
                    productItem.innerHTML = `<strong>${product.name}</strong> - Qtd: ${product.quantity} x R$ ${formatPriceForDisplay(product.price)} = R$ ${formatPriceForDisplay(product.quantity * product.price)}`;
                    viewProductsList.appendChild(productItem);
                });
            } else {
                viewProductsList.innerHTML = '<p>Nenhum produto associado a esta OS.</p>';
            }
        }

        // Senha Numérica
        const numericPasswordElement = document.getElementById('view-os-numeric-password');
        if (numericPasswordElement) {
            numericPasswordElement.textContent = osData.equipment_password || 'Não informada';
        }

        // Senha Padrão
        const patternSection = document.getElementById('view-os-pattern-section');
        if (patternSection && osData.pattern_lock_value) {
            patternSection.style.display = 'block';
            drawViewPattern(osData.pattern_lock_value);
        } else if (patternSection) {
            patternSection.style.display = 'none';
        }

        // Botões de ação
        document.getElementById('btn-edit-os').onclick = () => editOS(osData.id, getCurrentUser(), getSelectedStoreId());
        document.getElementById('btn-delete-os').onclick = () => deleteOS(osData.id, getSelectedStoreId());
        document.getElementById('btn-print-os').onclick = () => { if (printWithToastCallback) printWithToastCallback(osData.id); };
        document.getElementById('btn-mark-awaiting-pickup').onclick = () => markAsAwaitingPickup(osData.id);
        document.getElementById('btn-mark-delivered').onclick = () => markAsDelivered(osData.id);
        // Botão removido - modal abre automaticamente ao marcar como entregue
        document.getElementById('btn-launch-to-cash').style.display = 'none';

        // Exibir o modal
        const viewOSModal = document.getElementById('view-os-modal-container');
        
        if (viewOSModal) {
            viewOSModal.classList.add('active');
            viewOSModal.style.display = 'flex';
            
            trapFocus(viewOSModal);
            
            // Verificar se o conteúdo está visível
            setTimeout(() => {
                console.log('=== VERIFICAÇÃO FINAL DO MODAL ===');
                console.log('Modal visível:', viewOSModal.offsetHeight > 0 && viewOSModal.offsetWidth > 0);
                console.log('Computed style display:', window.getComputedStyle(viewOSModal).display);
                console.log('Computed style visibility:', window.getComputedStyle(viewOSModal).visibility);
                console.log('Computed style opacity:', window.getComputedStyle(viewOSModal).opacity);
                
                // Verificar alguns elementos específicos
                const testElements = ['view-os-id', 'view-os-customer-name', 'view-os-brand'];
                testElements.forEach(id => {
                    const el = document.getElementById(id);
                    if (el) {
                        console.log(`Elemento ${id}:`, {
                            text: el.textContent,
                            visible: el.offsetHeight > 0 && el.offsetWidth > 0,
                            display: window.getComputedStyle(el).display,
                            opacity: window.getComputedStyle(el).opacity
                        });
                    }
                });
            }, 100);
        } else {
            console.error('ERRO: Modal view-os-modal-container não encontrado!');
        }
    } catch (error) {
        console.error('Erro ao visualizar OS:', error);
        showToast(`Erro ao visualizar OS: ${error.message}`, 'error');
    }
}

// Função para editar uma Ordem de Serviço
export async function editOS(osId, currentUser, selectedStoreId) {
    try {
        // Carregar dados da OS existente
        const { data: os, error } = await dbSelect('service_orders', {
            select: '*',
            eq: { id: osId },
            single: true
        });

        if (error || !os) {
            console.error('❌ Erro ao carregar OS para edição:', error);
            throw error || new Error('OS não encontrada');
        }

        // Carregar dados do cliente separadamente
        let customerData = null;
        if (os.customer_id) {
            const { data: customer, error: customerError } = await dbSelect('customers', {
                select: 'id, full_name, phone, birth_date, address',
                eq: { id: os.customer_id },
                single: true
            });
            if (!customerError) {
                customerData = customer;
            }
        }

        // Buscar produtos diretamente da coluna products da OS
        let serviceOrderProducts = [];
        if (os.products && Array.isArray(os.products)) {
            serviceOrderProducts = os.products;
        }

        // Adicionar os dados relacionados ao objeto OS
        os.customers = customerData;
        os.service_order_products = serviceOrderProducts;
        

        


        
        // Verificar se os dados essenciais estão presentes
        if (!os.customers) {
            console.error('❌ Dados do cliente não encontrados na OS');
        }
        if (!os.service_order_products) {
            console.warn('⚠️ Nenhum produto encontrado para esta OS');
        }
        
        populateEditOSForm(os, os.customers);

        // Campos de marca agora são input de texto - não precisam ser carregados

        // Configurar formatação de valores para campos de edição
        setupEditValueFormatting();
        
        // Configurar autocompletes de cliente e produto para edição
        setupEditCustomerAutocomplete();
        setupEditProductAutocomplete();

        // Adicionar listeners de eventos específicos para o modal de edição
        setupEditOSEvents(osId);

        // Abrir modal de edição
        const editOSModal = document.getElementById('edit-os-modal');
        if (editOSModal) {
            // Abrindo modal de edição da OS
            // Garantir que o modal seja exibido corretamente
            editOSModal.style.display = 'flex';
            editOSModal.classList.add('active');
            
            // Aguardar um frame para garantir que o DOM seja atualizado e então configurar Pattern Lock
            requestAnimationFrame(() => {
                trapFocus(editOSModal);
                // Configurar Pattern Lock após o modal estar visível
                setTimeout(async () => {
            await setupEditPatternLock();
        }, 100);
            });
        } else {
            console.error('❌ Modal de edição não encontrado!');
            showToast('Erro: Modal de edição não encontrado', 'error');
        }
    } catch (error) {
        console.error('Erro ao carregar OS para edição:', error);
        showToast(`Erro ao carregar OS para edição: ${error.message}`, 'error');
    }
}

// Função loadEditOSBrands removida - não é mais necessária após alteração dos campos de marca para input de texto

// Função para preencher o formulário de edição da OS
export async function populateEditOSForm(os, customerData) {
    // Iniciando preenchimento do formulário de edição
    
    // Preencher ID da OS
    const osIdElement = document.getElementById('edit-os-id');
    if (osIdElement) {
        osIdElement.value = os.id;
        // ID da OS preenchido
    } else {
        console.error('❌ Elemento edit-os-id não encontrado');
    }
    
    // Preencher nome do cliente
    const customerNameElement = document.getElementById('edit-os-customer-name-display');
    if (customerNameElement) {
        customerNameElement.textContent = customerData?.full_name || 'N/A';
        // Nome do cliente preenchido
    } else {
        console.error('❌ Elemento edit-os-customer-name-display não encontrado');
    }
    
    // Preencher telefone do cliente
    const customerPhoneElement = document.getElementById('edit-os-customer-phone-display');
    if (customerPhoneElement) {
        customerPhoneElement.textContent = customerData?.phone ? formatPhone(customerData.phone) : 'N/A';
        // Telefone do cliente preenchido
    } else {
        console.error('❌ Elemento edit-os-customer-phone-display não encontrado');
    }
    
    // Preencher ID do cliente (campo oculto)
    const customerIdElement = document.getElementById('edit-os-customer-id-input');
    if (customerIdElement) {
        customerIdElement.value = customerData?.id || '';
        // ID do cliente preenchido
    } else {
        console.error('❌ Elemento edit-os-customer-id-input não encontrado');
    }
    
    // Preencher o campo de busca do cliente
    const customerSearchInput = document.getElementById('edit-os-customer-search');
    if (customerSearchInput && customerData?.full_name) {
        customerSearchInput.value = customerData.full_name;
    }
    
    // Mostrar informações do cliente selecionado
    const customerDisplay = document.getElementById('edit-os-customer-display');
    if (customerDisplay && customerData) {
        customerDisplay.style.display = 'block';
    }

    document.getElementById('edit-os-brand').value = os.equipment_brand || '';
    document.getElementById('edit-os-model').value = os.equipment_model || '';
    document.getElementById('edit-os-color').value = os.color || '';
    document.getElementById('edit-os-password').value = os.equipment_password || '';

    // Preencher problema e solução
    const problemElement = document.getElementById('edit-os-problem');
    if (problemElement) {
        problemElement.value = os.problem_description || '';
        // Problema preenchido
    } else {
        console.error('❌ Elemento edit-os-problem não encontrado');
    }
    
    const solutionElement = document.getElementById('edit-os-solution');
    if (solutionElement) {
        solutionElement.value = os.solution || '';
        // Solução preenchida
    } else {
        console.error('❌ Elemento edit-os-solution não encontrado');
    }
    
    // Preencher valores monetários
    let editQuoteValue = (os.quote_value !== null && os.quote_value !== undefined) ? 
        parseFloat(String(os.quote_value).replace(',', '.')) || 0 : 0;
    
    // Se quote_value for null ou 0, calcular automaticamente baseado nos produtos
    // Verificando valor do orçamento
    
    if (editQuoteValue === 0) {
        // Primeiro verificar produtos da coluna products (jsonb)
        if (os.products && Array.isArray(os.products) && os.products.length > 0) {
            // Calculando a partir da coluna products
            editQuoteValue = os.products.reduce((total, product) => {
                const quantity = parseInt(product.quantity) || 0;
                const price = parseFloat(product.price) || 0;
                // Processando produto
                return total + (quantity * price);
            }, 0);
            // Valor calculado a partir dos produtos
        }
        // Se não há produtos na coluna jsonb, calcular a partir de service_order_products
        else if (os.service_order_products && os.service_order_products.length > 0) {
            // Calculando a partir de service_order_products
            editQuoteValue = os.service_order_products.reduce((total, orderProduct) => {
                const quantity = parseInt(orderProduct.quantity) || 0;
                const price = parseFloat(orderProduct.unit_price) || 0;
                // Processando produto da tabela
                return total + (quantity * price);
            }, 0);
            // Valor calculado a partir de service_order_products
        }
        else {
            // Nenhum produto encontrado para calcular o valor
        }
    }
    
    const quoteValueElement = document.getElementById('edit-os-quote-value');
    // Formatando valor do orçamento
    
    if (quoteValueElement) {
        // Formatar o valor para o padrão brasileiro (160 -> "160,00")
        const formattedValue = editQuoteValue.toFixed(2).replace('.', ',');
        // Valor formatado para o campo
        
        quoteValueElement.value = formattedValue;
        // Valor do orçamento preenchido
    } else {
        console.error('❌ Elemento edit-os-quote-value não encontrado');
    }
    
    const editAmountPaid = (os.amount_paid !== null && os.amount_paid !== undefined) ? 
        parseFloat(String(os.amount_paid).replace(',', '.')) || 0 : 0;
    const amountPaidElement = document.getElementById('edit-os-amount-paid');
    if (amountPaidElement) {
        amountPaidElement.value = formatPriceForDisplay(editAmountPaid);
        // Valor pago preenchido
    } else {
        console.error('❌ Elemento edit-os-amount-paid não encontrado');
    }
    
    // Preencher método de pagamento
    const paymentMethodElement = document.getElementById('edit-os-payment-method');
    if (paymentMethodElement) {
        paymentMethodElement.value = os.payment_method || '';
        // Método de pagamento preenchido
    } else {
        console.error('❌ Elemento edit-os-payment-method não encontrado');
    }
    
    // Preencher data de entrega
    const deliveryDateElement = document.getElementById('edit-os-delivery-date');
    if (deliveryDateElement) {
        if (os.estimated_delivery_date) {
            // Extrair data e hora diretamente do timestamp UTC sem conversão de timezone
            const isoString = os.estimated_delivery_date;
            if (isoString && isoString.includes('T')) {
                // Extrair apenas a parte YYYY-MM-DDTHH:MM do timestamp UTC
                const datetimeLocal = isoString.substring(0, 16);
                
                // Data de entrega formatada
                deliveryDateElement.value = datetimeLocal;
                // Data de entrega preenchida
            } else {
                deliveryDateElement.value = '';
                // Data de entrega inválida
            }
        } else {
            deliveryDateElement.value = '';
            // Data de entrega vazia
        }
    } else {
        console.error('❌ Elemento edit-os-delivery-date não encontrado');
    }
    
    // Preencher status
    const statusElement = document.getElementById('edit-os-status-select');
    if (statusElement) {
        const statusValue = os.status || '';
        statusElement.value = statusValue;
        // Status preenchido
    } else {
        console.error('❌ Elemento edit-os-status-select não encontrado');
    }
    
    // Preencher observações
    const notesElement = document.getElementById('edit-os-notes');
    if (notesElement) {
        const notesValue = os.notes || '';
        notesElement.value = notesValue;
        // Observações preenchidas
    } else {
        console.error('❌ Elemento edit-os-notes não encontrado');
    }

    // Atualizar Pattern Lock na edição
    const patternLockCanvas = document.getElementById('edit-pattern-lock-canvas');
    const hiddenInput = document.getElementById('edit-os-pattern-lock-value');

    if (patternLockCanvas && hiddenInput) {
        // Aguardar a inicialização do PatternLock e então definir o padrão
        setTimeout(() => {
            if (window.editOsPattern) {
                // Define o padrão existente
                if (os.pattern_lock_value) {
                    // Carregando padrão existente
                    // Aguardar um pouco mais para garantir que o canvas esteja pronto
                    setTimeout(() => {
                        window.editOsPattern.setPattern(os.pattern_lock_value);
                        hiddenInput.value = os.pattern_lock_value;
                        // Debug removido
                    }, 100);
                } else {
                    // Nenhum padrão existente
                    hiddenInput.value = '';
                }
            } else {
                // editOsPattern ainda não está disponível
            }
        }, 300); // Aguardar inicialização completa
    }

    // Limpar e preencher produtos da OS para edição
    const editProductsList = document.getElementById('edit-os-products-list');
    if (editProductsList) {
        // Iniciando carregamento de produtos para edição
        editProductsList.innerHTML = '';
        
        // Produtos da OS carregados
        
        // Primeiro, verificar se há produtos na coluna 'products' (jsonb)
        if (os.products && os.products.length > 0) {
            // Carregando produtos da coluna 'products'
            
            os.products.forEach((product, index) => {
                // Processando produto da coluna products
                
                // Criar objeto produto com dados da coluna products
                const productForEdit = {
                    id: product.id,
                    name: product.name,
                    quantity: product.quantity,
                    price: product.price,
                    cost_price: product.cost_price
                };
                
                // Produto formatado para adição
                
                addEditOSProduct(productForEdit); // Adiciona produto ao formulário de edição
            });
            
            // Todos os produtos processados
        }
        // Se não há produtos na coluna 'products', verificar na tabela 'service_order_products'
        else if (os.service_order_products && os.service_order_products.length > 0) {
    
            
            os.service_order_products.forEach((orderProduct, index) => {
                // Processando produto
                // Dados do produto carregados
                
                // Verificar se os dados do produto estão corretos
                if (!orderProduct.products) {
                    console.error('❌ Dados do produto não encontrados para:', orderProduct);
                    return;
                }
                
                // Criar objeto produto com dados do service_order_products e products
                const product = {
                    id: orderProduct.products.id,
                    name: orderProduct.products.name,
                    quantity: orderProduct.quantity,
                    price: orderProduct.unit_price,
                    cost_price: orderProduct.products.cost_price
                };
                
                // Produto formatado para adição
                
                addEditOSProduct(product); // Adiciona produto ao formulário de edição
            });
            
            // Todos os produtos da tabela processados
        } else {
            // Nenhum produto encontrado na OS
        }
    } else {
        // Lista de produtos para edição não encontrada
    }

    // Preencher campos do checklist de edição usando a estrutura JSON
    const checklist = os.accessories_checklist || {};
    
    const checkBateriaEdit = document.querySelector('input[name="edit-check-bateria"][value="' + (checklist.bateria || 'nao') + '"]');
    if (checkBateriaEdit) checkBateriaEdit.checked = true;
    
    const checkChipEdit = document.querySelector('input[name="edit-check-chip"][value="' + (checklist.chip || 'nao') + '"]');
    if (checkChipEdit) checkChipEdit.checked = true;
    
    const checkCarregadorEdit = document.querySelector('input[name="edit-check-carregador"][value="' + (checklist.carregador || 'nao') + '"]');
    if (checkCarregadorEdit) checkCarregadorEdit.checked = true;
    
    const checkFoneEdit = document.querySelector('input[name="edit-check-fone"][value="' + (checklist.fone || 'nao') + '"]');
    if (checkFoneEdit) checkFoneEdit.checked = true;
    
    const checkArranhadoEdit = document.querySelector('input[name="edit-check-arranhado"][value="' + (checklist.aranhado || 'nao') + '"]');
    if (checkArranhadoEdit) checkArranhadoEdit.checked = true;

    // Atualizar total da OS na edição
    updateEditOSTotal();
}

// Função para configurar Pattern Lock para edição
export async function setupEditPatternLock() {
    const canvas = document.getElementById('edit-pattern-lock-canvas');
    const container = document.getElementById('edit-pattern-lock-container');
    
    // Inicializando PatternLock para edição
    
    if (!canvas || !container) {
        console.error('❌ Canvas ou container não encontrado');
        // Adicionar indicação visual de erro
        if (container) {
            container.innerHTML = '<div style="color: red; text-align: center; padding: 20px;">❌ Canvas não encontrado</div>';
        }
        return false;
    }
    
    if (!window.PatternLock) {
        console.error('❌ Biblioteca PatternLock não carregada');
        container.innerHTML = '<div style="color: red; text-align: center; padding: 20px;">❌ PatternLock não carregado</div>';
        return false;
    }
    
    try {
        // Garantir que o canvas tenha as dimensões corretas
        canvas.width = 180;
        canvas.height = 180;
        canvas.style.width = '180px';
        canvas.style.height = '180px';
        canvas.style.display = 'block';
        canvas.style.backgroundColor = '#fff';
        canvas.style.border = '2px solid #28a745'; // Verde para indicar sucesso
        
        // Forçar múltiplos reflows para garantir renderização
        canvas.offsetHeight;
        canvas.offsetWidth;
        container.offsetHeight;
        container.offsetWidth;
        
        // Aguardar um pouco mais antes de inicializar
        await new Promise(resolve => setTimeout(resolve, 100));
        
        // Adicionar indicação visual temporária
        const ctx = canvas.getContext('2d');
        ctx.fillStyle = '#f0f0f0';
        ctx.fillRect(0, 0, 180, 180);
        ctx.fillStyle = '#333';
        ctx.font = '14px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('Inicializando...', 90, 90);
        
        // Criar nova instância
        window.editOsPattern = new PatternLock('#edit-pattern-lock-canvas');
        
        // Forçar redimensionamento após inicialização
        setTimeout(() => {
            if (window.editOsPattern && window.editOsPattern.resize) {
                window.editOsPattern.resize();
            }
            // Remover indicação visual de inicialização
            ctx.clearRect(0, 0, 180, 180);
        }, 50);
        
        // Conectar ao campo hidden
        const hiddenInput = document.getElementById('edit-os-pattern-lock-value');
        if (hiddenInput) {
            window.editOsPattern.on('change', value => {
                if (hiddenInput) hiddenInput.value = value;
            });
        }
        
        // Conectar botão de reset
        const btnReset = document.getElementById('edit-btn-reset-pattern');
        if (btnReset) {
            btnReset.onclick = () => {
                if (window.editOsPattern) {
                    window.editOsPattern.reset();
                    // Debug removido
                }
            };
        }
        
        // Debug removido
        
        // Limpar indicação visual após inicialização
        setTimeout(() => {
            canvas.style.border = '1px solid #ddd';
        }, 1000);
        
        return true;
    } catch (error) {
        console.error('❌ Erro ao inicializar PatternLock para edição:', error);
        container.innerHTML = '<div style="color: red; text-align: center; padding: 20px;">❌ Erro: ' + error.message + '</div>';
        return false;
    }
}

// Função para configurar formatação de valores para campos de edição
export function setupEditValueFormatting() {
    const valueFields = [
        'edit-os-quote-value',
        'edit-os-amount-paid',
        'edit-os-quote-value', 
        'edit-os-amount-paid'
    ];
    
    valueFields.forEach(fieldId => {
        const field = document.getElementById(fieldId);
        if (field) {
            // Formatação durante a digitação
            field.addEventListener('input', function(e) {
                let value = e.target.value.replace(/[^\d,]/g, ''); // Remove tudo exceto números e vírgula
                
                // Se tem vírgula, separa inteiros e decimais
                let parts = value.split(',');
                let integerPart = parts[0];
                let decimalPart = parts[1] || '';
                
                // Limita decimais a 2 dígitos
                if (decimalPart.length > 2) {
                    decimalPart = decimalPart.substring(0, 2);
                }
                
                // Adiciona pontos para milhares na parte inteira
                if (integerPart.length > 3) {
                    integerPart = integerPart.replace(/\B(?=(?:\d{3})+(?!\d))/g, '.');
                }
                
                // Reconstrói o valor
                let formattedValue = integerPart;
                if (parts.length > 1 || decimalPart) {
                    formattedValue += ',' + decimalPart;
                }
                
                e.target.value = formattedValue;
            });
            
            // Remove formatação ao focar para edição mais fácil
            field.addEventListener('focus', function(e) {
                let value = e.target.value.replace(/\./g, ''); // Remove pontos
                e.target.value = value;
            });
            
            // Reaplica formatação ao sair do campo
            field.addEventListener('blur', function(e) {
                let value = e.target.value.replace(/[^\d,]/g, '');
                if (value) {
                    let parts = value.split(',');
                    let integerPart = parts[0];
                    let decimalPart = parts[1] || '';
                    
                    if (decimalPart.length > 2) {
                        decimalPart = decimalPart.substring(0, 2);
                    }
                    
                    if (integerPart.length > 3) {
                        integerPart = integerPart.replace(/\B(?=(?:\d{3})+(?!\d))/g, '.');
                    }
                    
                    let formattedValue = integerPart;
                    if (decimalPart) {
                        formattedValue += ',' + decimalPart;
                    }
                    
                    e.target.value = formattedValue;
                }
            });
        }
    });
}


// Função para configurar autocompletes de cliente e produto para edição
export function setupEditCustomerAutocomplete() {
    const searchInput = document.getElementById('edit-os-customer-search');
    const resultsContainer = document.getElementById('edit-os-customer-results');
    const selectedCustomerIdInput = document.getElementById('edit-os-selected-customer-id');
    const toggleNewCustomerBtn = document.getElementById('btn-toggle-new-customer-form');
    const newCustomerFormContainer = document.getElementById('new-customer-os-form');
    const osForm = document.getElementById('new-os-form');

    // Configurar busca inicialmente
    setupCustomerSearch('edit-os-customer-search', 'edit-os-customer-results', 'edit-os-selected-customer-id');
    
    // Configurar formatação de valores
    setupValueFormatting(['edit-os-quote-value', 'edit-os-amount-paid']);
    
    // Configurar autocomplete de produtos
    setupEditProductAutocomplete();

    // Toggle para mostrar/ocultar formulário de novo cliente
    if (toggleNewCustomerBtn && newCustomerFormContainer) {
        toggleNewCustomerBtn.onclick = () => {
            newCustomerFormContainer.style.display = newCustomerFormContainer.style.display === 'none' ? 'block' : 'none';
        };
    }

    // Salvamento da OS
    if (osForm) {
        // Remove event listeners existentes para evitar duplicação
        const newForm = osForm.cloneNode(true);
        osForm.parentNode.replaceChild(newForm, osForm);
        
        // Atualizar referências após clonagem
        const newSelectedCustomerIdInput = document.getElementById('edit-os-selected-customer-id');
        const newCustomerFormContainer = document.getElementById('new-customer-os-form');
        
        // Reconfigurar busca de clientes após clonagem
        setupCustomerSearch('edit-os-customer-search', 'edit-os-customer-results', 'edit-os-selected-customer-id');
        
        // Reconfigurar formatação de valores após clonagem
        setupValueFormatting(['edit-os-quote-value', 'edit-os-amount-paid']);
        
        // Reconfigurar autocomplete de produtos após clonagem
        setupEditProductAutocomplete();
        
        newForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const submitBtn = newForm.querySelector('button[type="submit"]');
            submitBtn.disabled = true;
            submitBtn.textContent = 'Salvando...';
            
            // Validação de campos obrigatórios
            const requiredFields = [
                { id: 'edit-os-brand', name: 'Marca' },
                { id: 'edit-os-model', name: 'Modelo' },
                { id: 'edit-os-color', name: 'Cor' },
                { id: 'edit-os-quote-value', name: 'Valor' },
                { id: 'edit-os-problem', name: 'Defeito' },
                { id: 'edit-os-delivery-date', name: 'Data de Entrega' }
            ];
            
            for (const field of requiredFields) {
                const element = document.getElementById(field.id);
                if (!element) {
                    showToast(`Campo "${field.name}" não encontrado!`, 'error');
                    submitBtn.disabled = false;
                    submitBtn.textContent = '💾 Salvar OS';
                    return;
                }
                
                // Validação especial para select
                if (element.tagName === 'SELECT') {
                    if (!element.value || element.value === '') {
                        showToast(`Campo "${field.name}" é obrigatório!`, 'error');
                        element.focus();
                        submitBtn.disabled = false;
                        submitBtn.textContent = '💾 Salvar OS';
                        return;
                    }
                } else {
                    if (!element.value || !element.value.trim()) {
                        showToast(`Campo "${field.name}" é obrigatório!`, 'error');
                        element.focus();
                        submitBtn.disabled = false;
                        submitBtn.textContent = '💾 Salvar OS';
                        return;
                    }
                }
            }
            
            try {
                let customerId = newSelectedCustomerIdInput.value ? Number(newSelectedCustomerIdInput.value) : null;
                if (!customerId && newCustomerFormContainer && newCustomerFormContainer.style.display !== 'none') {
                    const customerData = {
                        full_name: document.getElementById('edit-os-new-customer-name')?.value || '',
                        phone: document.getElementById('edit-os-new-customer-phone')?.value || '',
                        birth_date: document.getElementById('edit-os-new-customer-birth-date')?.value || null,
                        address: {
                            street: document.getElementById('edit-os-new-customer-street')?.value || '',
                            number: document.getElementById('edit-os-new-customer-number')?.value || '',
                            neighborhood: document.getElementById('edit-os-new-customer-neighborhood')?.value || '',
                            city: document.getElementById('edit-os-new-customer-city')?.value || '',
                            state: document.getElementById('edit-os-new-customer-state')?.value || '',
                            zip: document.getElementById('edit-os-new-customer-zip')?.value || ''
                        },
                        user_id: getCurrentUser()?.id || null
                    };

                    const { data: newCustomer, error: customerError } = await supabase
                        .from('customers')
                        .insert([customerData])
                        .select();

                    if (customerError) {
                        console.error('Erro ao cadastrar novo cliente para OS:', customerError);
                        showToast(`Erro ao cadastrar cliente: ${customerError.message}`, 'error');
                        submitBtn.disabled = false;
                        submitBtn.textContent = '💾 Salvar OS';
                        return;
                    }
                    customerId = newCustomer[0].id;
                }

                // Coletar produtos adicionados à OS
                const productsList = document.getElementById('edit-os-products-list');
                const osProducts = [];
                if (productsList) {
                    const productItems = productsList.querySelectorAll('.product-item-edit');
                    productItems.forEach(item => {
                        // Extrair dados dos data-attributes primeiro, depois do HTML como fallback
                        const productId = item.dataset.productId;
                        const costPrice = parseFloat(item.dataset.costPrice) || 0;
                        const productName = item.querySelector('.product-name').textContent;
                        
                        // Extrair quantidade e preço unitário do HTML
                        const quantityMatch = item.innerHTML.match(/Qtd: (\d+)/);
                        const priceMatch = item.innerHTML.match(/x R\$ ([\d.,]+)/);
                        
                        const quantity = quantityMatch ? parseInt(quantityMatch[1]) : 0;
                        const price = priceMatch ? parseFloat(priceMatch[1].replace(/\./g, '').replace(',', '.')) : 0;
                        
                        // Criar objeto do produto com todos os dados necessários
                        osProducts.push({
                            id: productId,
                            name: productName,
                            quantity: quantity,
                            price: price,
                            cost_price: costPrice
                        });
                    });
                }

                // Captura os dados do checklist na edição
                const editCheckBateria = document.querySelector('input[name="edit-check-bateria"]:checked')?.value || 'nao';
                const editCheckChip = document.querySelector('input[name="edit-check-chip"]:checked')?.value || 'nao';
                const editCheckCarregador = document.querySelector('input[name="edit-check-carregador"]:checked')?.value || 'nao';
                const editCheckFone = document.querySelector('input[name="edit-check-fone"]:checked')?.value || 'nao';
                const editCheckAranhado = document.querySelector('input[name="edit-check-aranhado"]:checked')?.value || 'nao';

                const osData = {
                    customer_id: customerId,
                    client_name: document.getElementById('edit-os-new-customer-name')?.value || '',
                    equipment_brand: document.getElementById('edit-os-brand')?.value || '',
                    equipment_model: document.getElementById('edit-os-model')?.value || '',
                    color: document.getElementById('edit-os-color')?.value || '',
                    problem_description: document.getElementById('edit-os-problem')?.value || '',
                    solution: document.getElementById('edit-os-solution')?.value || '',
                    quote_value: parseFloat((document.getElementById('edit-os-quote-value')?.value || '0').replace(/\./g, '').replace(',', '.')),
                    amount_paid: parseFloat((document.getElementById('edit-os-amount-paid')?.value || '0').replace(/\./g, '').replace(',', '.')),
                    payment_method: document.getElementById('edit-os-payment-method')?.value || '',
                    estimated_delivery_date: (() => {
                const deliveryDateElement = document.getElementById('edit-os-delivery-date');
                const deliveryDateValue = deliveryDateElement?.value || '';
                
                // Se há valor, converter para timestamp UTC sem alterar o horário
                let finalValue = '';
                if (deliveryDateValue) {
                    // Adicionar segundos e timezone UTC para manter o horário exato
                    finalValue = deliveryDateValue + ':00+00:00';
                }
                
                console.log('🕐 Data de entrega na edição:', {
                    elemento: deliveryDateElement,
                    valorOriginal: deliveryDateValue,
                    valorFinal: finalValue
                });
                
                return finalValue;
            })(),
                    equipment_password: document.getElementById('edit-os-password')?.value || '',
                    pattern_lock_value: document.getElementById('edit-os-pattern-lock-value')?.value || '',
                    status: document.getElementById('edit-os-status-select')?.value || 'pending',
                    notes: document.getElementById('edit-os-notes')?.value || '',
                    user_id: getCurrentUser()?.id,
                    store_id: getSelectedStoreId(),
                    // Dados do checklist como JSON na edição
                    accessories_checklist: {
                        bateria: editCheckBateria,
                        chip: editCheckChip,
                        carregador: editCheckCarregador,
                        fone: editCheckFone,
                        aranhado: editCheckAranhado
                    },
                    products: osProducts // Adiciona os produtos
                };

                const { data, error } = await supabase
                    .from('service_orders')
                    .update(osData)
                    .eq('id', osId);

                if (error) throw error;
                
                showToast('Ordem de Serviço atualizada com sucesso!', 'success');
                closeEditOSModal();
                refreshOSList(selectedStoreId);
                document.getElementById('edit-os-form').reset();
                document.getElementById('edit-os-products-list').innerHTML = ''; // Limpar lista de produtos
            } catch (error) {
                console.error('Erro ao salvar OS:', error);
                showToast(`Erro ao salvar OS: ${error.message}`, 'error');
            } finally {
                submitBtn.disabled = false;
                submitBtn.textContent = '💾 Salvar OS';
            }
        });
    }
}

// Função para configurar autocomplete de produtos para edição
export function setupEditProductAutocomplete() {
    const searchInput = document.getElementById('edit-os-product-search');
    const resultsDiv = document.getElementById('edit-os-product-results');
    
    if (!searchInput || !resultsDiv) {
        console.warn('Elementos de busca de produto para edição não encontrados.');
        return;
    }

    // Define a função de click em uma variável para poder removê-la depois
    const handleResultClick = (e) => {
        const resultDiv = e.target.closest('.autocomplete-result');
        if (resultDiv && resultDiv.dataset.productId) {
            const product = {
                id: resultDiv.dataset.productId,
                name: resultDiv.dataset.productName,
                price: parseFloat(resultDiv.dataset.productPrice || 0),
                cost_price: parseFloat(resultDiv.dataset.productCostPrice || 0),
                stock: parseInt(resultDiv.dataset.productStock || 0),
                track_stock: resultDiv.dataset.trackStock === 'true'
            };
            
            addEditOSProduct(product);
            searchInput.value = '';
            resultsDiv.style.display = 'none';
        }
    };

    // Remove existing event listener before adding a new one
    resultsDiv.removeEventListener('click', handleResultClick);
    resultsDiv.addEventListener('click', handleResultClick);

    let searchTimeout;
    
    searchInput.addEventListener('input', (e) => {
        clearTimeout(searchTimeout);
        searchTimeout = setTimeout(async () => {
            const query = e.target.value.trim();

            if (query.length < 2) {
                resultsDiv.innerHTML = '';
                resultsDiv.style.display = 'none';
                return;
            }

            try {
                const { data: products, error } = await supabase
                    .from('products')
                    .select('id, name, price, cost_price, stock, track_stock')
                    .ilike('name', `%${query}%`)
                    .limit(5);

                if (error) {
                    console.error('Erro na busca de produtos:', error);
                    return;
                }

                if (products.length === 0) {
                    resultsDiv.innerHTML = '<div class="autocomplete-result">Nenhum produto encontrado</div>';
                } else {
                    resultsDiv.innerHTML = products.map(p => `
                        <div class="autocomplete-result" 
                            data-product-id="${p.id}" 
                            data-product-name="${p.name}"
                            data-product-price="${p.price}"
                            data-product-cost-price="${p.cost_price || 0}"
                            data-product-stock="${p.stock || 0}"
                            data-track-stock="${p.track_stock}">
                            ${p.name} <small>(R$ ${p.price.toFixed(2)}${p.track_stock ? `, Estoque: ${p.stock || 0}` : ''})</small>
                        </div>
                    `).join('');
                }
                resultsDiv.style.display = 'block';

            } catch (error) {
                console.error('Erro geral na busca:', error);
            }
        }, 300); // Debounce de 300ms
    });
}

// Função para atualizar total da OS na edição
export function updateEditOSTotal() {
    const productItems = document.querySelectorAll('.product-item-edit');
    let productsTotal = 0;
    
    productItems.forEach(item => {
        // Buscar quantidade e preço unitário na estrutura HTML correta
        const quantityMatch = item.innerHTML.match(/Qtd: (\d+)/);
        const unitPriceMatch = item.innerHTML.match(/x R\$ ([\d.,]+)/);
        
        const quantity = quantityMatch ? parseInt(quantityMatch[1]) : 0;
        const unitPrice = unitPriceMatch ? parseFloat(unitPriceMatch[1].replace(/\./g, '').replace(',', '.')) : 0;
        
        // Calcular o total do item (quantidade * preço unitário)
        const itemTotal = quantity * unitPrice;
        productsTotal += itemTotal;
    });
    
    // Obter valor base da OS (serviço)
    const quoteValueInput = document.getElementById('edit-os-quote-value');
    if (quoteValueInput) {
        // Se não há valor base, usar apenas o total dos produtos
        let baseValue = 0;
        if (!quoteValueInput.dataset.baseValue) {
            const currentValue = parseFloat(quoteValueInput.value.replace(/\./g, '').replace(',', '.')) || 0;
            // Se o valor atual é diferente do total de produtos, assumir que é o valor base
            if (currentValue !== productsTotal) {
                baseValue = currentValue - (parseFloat(quoteValueInput.dataset.lastProductsTotal) || 0);
                quoteValueInput.dataset.baseValue = baseValue;
            }
        } else {
            baseValue = parseFloat(quoteValueInput.dataset.baseValue) || 0;
        }
        
        const newTotal = baseValue + productsTotal;
        const formattedTotal = formatPriceForDisplay(newTotal);
        quoteValueInput.value = formattedTotal;
        quoteValueInput.dataset.lastProductsTotal = productsTotal;
    }
}

// Função para fechar o modal de edição
export function closeEditOSModal() {
    const modal = document.getElementById('edit-os-modal');
    if (modal) {
        modal.classList.remove('active');
        modal.style.display = 'none';
    }
}

// Função para adicionar eventos específicos para o modal de edição
export function setupEditOSEvents(osId) {
    const editOSModal = document.getElementById('edit-os-modal');
    if (editOSModal) {
        // Adicionar listeners de eventos específicos para o modal de edição
        editOSModal.addEventListener('close', () => {
            closeEditOSModal();
        });
    }
}

// Função para inicializar o sistema de consulta de OS na página pública
export function initializeOSConsultation() {
    const consultationForm = document.getElementById('consultation-form');
    const consultationResultsDiv = document.getElementById('consultation-results');
    const consultationPhoneInput = document.getElementById('phone-input'); // ID correto do campo de telefone
    
    // Garante que o input de telefone tenha a máscara de telefone aplicada
    if (consultationPhoneInput) {
        consultationPhoneInput.addEventListener('input', (e) => {
            e.target.value = formatPhone(e.target.value);
        });
    }

    if (consultationForm && consultationResultsDiv) {
        consultationForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            // Verificação de segurança para o campo de telefone
            if (!consultationPhoneInput) {
                showConsultationMessage('error', 'Campo de telefone não encontrado.');
                return;
            }
            
            const phone = consultationPhoneInput.value.replace(/\D/g, ''); // Remove caracteres não numéricos
            const customerName = document.getElementById('consultation-name')?.value?.trim() || '';

            if (!phone && !customerName) {
                showConsultationMessage('error', 'Por favor, preencha o telefone ou o nome do cliente.');
                return;
            }
            
            consultationResultsDiv.innerHTML = '<p class="loading-message">Buscando ordens de serviço...</p>';
            consultationResultsDiv.style.display = 'block';

            try {
                // Busca por nome do cliente usando dbSelect
                const options = {
                    select: '*, customers(id, full_name, phone, address)'
                };

                if (phone) {
                    // Busca por telefone do cliente associado (remove formatação para comparação)
                    const { data: allOrders, error: searchError } = await dbSelect('service_orders', {
                        select: '*, customers(id, full_name, phone, address)'
                    });
                    
                    if (searchError) throw searchError;
                    
                    // Filtra manualmente por telefone removendo formatação
                    const filteredOrders = allOrders.filter(order => {
                        if (!order.customers?.phone) return false;
                        const cleanDbPhone = order.customers.phone.replace(/\D/g, '');
                        return cleanDbPhone.includes(phone);
                    });
                    
                    // Se também há busca por nome, filtra adicionalmente
                    if (customerName) {
                        const finalOrders = filteredOrders.filter(order => 
                            order.customers?.full_name?.toLowerCase().includes(customerName.toLowerCase())
                        );
                        
                        if (finalOrders.length === 0) {
                            showConsultationMessage('info', 'Nenhuma ordem de serviço encontrada com os dados fornecidos.');
                        } else {
                            displayOSResults(finalOrders);
                        }
                        return;
                    }
                    
                    if (filteredOrders.length === 0) {
                        showConsultationMessage('info', 'Nenhuma ordem de serviço encontrada com os dados fornecidos.');
                    } else {
                        displayOSResults(filteredOrders);
                    }
                    return;
                }
                
                if (customerName) {
                    // Busca apenas por nome do cliente
                    query = query.filter('customers.full_name', 'ilike', `%${customerName}%`);
                }

                // Não filtra mais por status - mostra todas as OS para consulta pública

                const { data: serviceOrders, error } = await query;

                if (error) throw error;

                if (serviceOrders.length === 0) {
                    showConsultationMessage('info', 'Nenhuma ordem de serviço encontrada com os dados fornecidos.');
                } else {
                    displayOSResults(serviceOrders);
                }
            } catch (error) {
                console.error('Erro na consulta de OS:', error);
                showConsultationMessage('error', `Erro na consulta: ${error.message}`);
            }
        });
    }
}

// Função para exibir mensagens de consulta
export function showConsultationMessage(type, message) {
    const consultationResultsDiv = document.getElementById('consultation-results');
    if (consultationResultsDiv) {
        consultationResultsDiv.innerHTML = `<p class="${type}-message">${message}</p>`;
        consultationResultsDiv.style.display = 'block';
    }
}

// Função para exibir resultados da consulta de OS
export function displayOSResults(serviceOrders) {
    const consultationResultsDiv = document.getElementById('consultation-results');
    if (!consultationResultsDiv) return;

    let html = '<h3>📋 Resultados da Consulta</h3>';
    
    serviceOrders.forEach(os => {
        const statusClass = os.status ? os.status.toLowerCase() : 'pending';
        html += `
            <div class="os-result-card">
                <div class="os-result-header">
                    <div class="os-number">OS #${os.id}</div>
                    <div class="os-status ${statusClass}">${getStatusText(os.status)}</div>
                </div>
                <div class="os-details">
                    <div class="os-detail-item">
                        <span class="os-detail-label">Cliente</span>
                        <span class="os-detail-value">${os.customers?.full_name || 'N/A'}</span>
                    </div>
                    <div class="os-detail-item">
                        <span class="os-detail-label">Telefone</span>
                        <span class="os-detail-value">${os.customers?.phone ? formatPhone(os.customers.phone) : 'N/A'}</span>
                    </div>
                    <div class="os-detail-item">
                        <span class="os-detail-label">Equipamento</span>
                        <span class="os-detail-value">${os.equipment_brand || ''} ${os.equipment_model || 'N/A'}</span>
                    </div>
                    <div class="os-detail-item">
                        <span class="os-detail-label">Cor</span>
                        <span class="os-detail-value">${os.color || 'N/A'}</span>
                    </div>
                    <div class="os-detail-item">
                        <span class="os-detail-label">Defeito Relatado</span>
                        <span class="os-detail-value">${os.problem_description || 'N/A'}</span>
                    </div>
                    <div class="os-detail-item">
                        <span class="os-detail-label">Previsão de Entrega</span>
                        <span class="os-detail-value">${os.estimated_delivery_date ? formatDateForDisplay(os.estimated_delivery_date, true) : 'N/A'}</span>
                    </div>
                </div>
            </div>
        `;
    });
    
    consultationResultsDiv.innerHTML = html;
    consultationResultsDiv.style.display = 'block';
}

// Funções addEditOSBrand e removeEditOSBrand removidas - não são mais necessárias após alteração dos campos de marca para input de texto

export async function saveEditedOS(osId, currentUser, selectedStoreId) {
    const editOSForm = document.getElementById('edit-os-form');
    if (!editOSForm) return;

    const submitBtn = editOSForm.querySelector('button[type="submit"]');
    submitBtn.disabled = true;
    submitBtn.textContent = 'Salvando Edição...';

    // Validação de campos obrigatórios (a mesma lógica do setupOrderForm pode ser reusada ou adaptada)
    const requiredFields = [
        { id: 'edit-os-brand', name: 'Marca' },
        { id: 'edit-os-model', name: 'Modelo' },
        { id: 'edit-os-color', name: 'Cor' },
        { id: 'edit-os-quote-value', name: 'Valor' },
        { id: 'edit-os-problem', name: 'Defeito' },
        { id: 'edit-os-delivery-date', name: 'Data de Entrega' }
    ];

    for (const field of requiredFields) {
        const element = document.getElementById(field.id);
        if (!element) {
            showToast(`Campo "${field.name}" não encontrado!`, 'error');
            submitBtn.disabled = false;
            submitBtn.textContent = '💾 Salvar OS';
            return;
        }

        if (element.tagName === 'SELECT') {
            if (!element.value || element.value === '') {
                showToast(`Campo "${field.name}" é obrigatório!`, 'error');
                element.focus();
                submitBtn.disabled = false;
                submitBtn.textContent = '💾 Salvar OS';
                return;
            }
        } else {
            if (!element.value || !element.value.trim()) {
                showToast(`Campo "${field.name}" é obrigatório!`, 'error');
                element.focus();
                submitBtn.disabled = false;
                submitBtn.textContent = '💾 Salvar OS';
                return;
            }
        }
    }

    try {
        // Coletar produtos editados da OS
        const productsList = document.getElementById('edit-os-products-list');
        const osProducts = [];
        if (productsList) {
            const productItems = productsList.querySelectorAll('.product-item-edit');
            productItems.forEach(item => {
                const productNameElement = item.querySelector('.product-name');
                const productName = productNameElement ? productNameElement.textContent : '';
                
                const quantityMatch = item.textContent.match(/Qtd: (\d+)/);
                const priceMatch = item.textContent.match(/R\$ ([\d.,]+)/);
                
                const quantity = quantityMatch ? parseInt(quantityMatch[1]) : 0;
                const price = priceMatch ? parseFloat(priceMatch[1].replace(/\./g, '').replace(',', '.')) : 0;
                
                osProducts.push({
                    id: item.dataset.productId || null,
                    name: productName,
                    quantity: quantity,
                    price: price,
                    cost_price: parseFloat(item.dataset.costPrice || 0)
                });
            });
        }
        
        const osData = {
            customer_id: document.getElementById('edit-os-selected-customer-id')?.value || null,
            client_name: document.getElementById('edit-os-new-customer-name')?.value || '',
            equipment_brand: document.getElementById('edit-os-brand')?.value || '',
            equipment_model: document.getElementById('edit-os-model')?.value || '',
            color: document.getElementById('edit-os-color')?.value || '',
            problem_description: document.getElementById('edit-os-problem')?.value || '',
            solution: document.getElementById('edit-os-solution')?.value || '',
            quote_value: parseFloat((document.getElementById('edit-os-quote-value')?.value || '0').replace(/\./g, '').replace(',', '.')),
            amount_paid: parseFloat((document.getElementById('edit-os-amount-paid')?.value || '0').replace(/\./g, '').replace(',', '.')),
            payment_method: document.getElementById('edit-os-payment-method')?.value || '',
            estimated_delivery_date: document.getElementById('edit-os-delivery-date')?.value || '',
            pattern_lock_value: document.getElementById('edit-os-pattern-lock-value')?.value || '',
            status: document.getElementById('edit-os-status-select')?.value || 'pending',
            notes: document.getElementById('edit-os-notes')?.value || '',
            user_id: getCurrentUser()?.id,
            store_id: getSelectedStoreId()
        };

        // Atualizar dados da OS
        const { error: osError } = await dbUpdate('service_orders', osData, { eq: { id: osId } });
        if (osError) throw osError;

        // Gerenciar produtos da OS
        // 1. Deletar todos os produtos existentes da OS
        const { error: deleteError } = await dbDelete('service_order_products', { eq: { service_order_id: osId } });
        if (deleteError) throw deleteError;

        // 2. Inserir os novos produtos
        if (osProducts.length > 0) {
            const productsToInsert = osProducts.map(product => ({
                service_order_id: osId,
                product_id: product.id,
                quantity: product.quantity,
                unit_price: product.price
            })).filter(product => product.product_id); // Filtrar apenas produtos com ID válido

            if (productsToInsert.length > 0) {
                const { error: insertError } = await dbInsert('service_order_products', productsToInsert);
                if (insertError) throw insertError;
            }
        }
        
        showToast('Ordem de Serviço atualizada com sucesso!', 'success');
        closeEditOSModal();
        refreshOSList(selectedStoreId); // Passa selectedStoreId para a atualização da lista
    } catch (error) {
        console.error('Erro ao salvar OS editada:', error);
        showToast(`Erro ao salvar OS editada: ${error.message}`, 'error');
    } finally {
        submitBtn.disabled = false;
        submitBtn.textContent = '💾 Salvar OS';
    }
}