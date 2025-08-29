import { supabase } from '../api/supabase.js';
import { dbSelect, dbInsert, dbUpdate, dbDelete } from '../utils/authInterceptor.js';
import { showToast, updatePaginationUI } from '../utils/utils.js';
import { RECORDS_PER_PAGE } from '../utils/constants.js';
import { formatPhoneMask } from '../utils/formatters.js'; // Assumindo que formatPhoneMask será movida para formatters.js
import { fetchAddressByCEP } from './serviceOrders.js';

export function initializeCustomerFormEvents() {
    const newCustomerForm = document.getElementById('new-customer-form');
    const customerSearchInput = document.getElementById('customer-search');
    const customerResultsDiv = document.getElementById('customer-search-results');
    const btnNewCustomer = document.getElementById('btn-new-customer');

    if (newCustomerForm) {
        // Adiciona listener para máscaras de telefone e CEP
        const phoneInput = newCustomerForm.querySelector('#new-customer-phone');
        if (phoneInput) {
            phoneInput.addEventListener('input', (e) => {
                e.target.value = formatPhoneMask(e.target.value);
            });
        }

        const zipInput = newCustomerForm.querySelector('#new-customer-zip');
        if (zipInput) {
            zipInput.addEventListener('input', (e) => {
                e.target.value = e.target.value.replace(/\D/g, '').replace(/^(\d{5})(\d)/, '$1-$2').slice(0, 9);
            });
            zipInput.addEventListener('blur', async (e) => {
                const cep = e.target.value.replace(/\D/g, '');
                if (cep.length === 8) {
                    await fetchAddressByCEP(cep, 'new-customer');
                }
            });
        }

        newCustomerForm.addEventListener('submit', saveCustomer);
    }

    if (customerSearchInput && customerResultsDiv) {
        let searchTimeout;
        customerSearchInput.addEventListener('input', () => {
            clearTimeout(searchTimeout);
            searchTimeout = setTimeout(() => {
                performCustomerSearch(); // Busca sem paginacao inicial
            }, 500);
        });

        customerResultsDiv.addEventListener('click', (e) => {
            const item = e.target.closest('.autocomplete-item');
            if (item) {
                // Lógica de seleção de cliente para preenchimento de formulário de OS
                const customerId = item.dataset.id;
                // Supondo que você terá uma função para preencher os dados do cliente selecionado no formulário
                // fillCustomerFormWithData(customerId);
                customerSearchInput.value = item.textContent.trim();
                customerResultsDiv.innerHTML = '';
                showToast('Cliente selecionado.', 'info');
            }
        });
    }

    if (btnNewCustomer) {
        btnNewCustomer.addEventListener('click', () => {
            // Lógica para abrir modal ou exibir formulário de novo cliente
            showToast('Funcionalidade de adicionar novo cliente ainda não implementada.', 'info');
        });
    }
}

export async function saveCustomer(event) {
    event.preventDefault();

    // Verifica se é edição ou novo cliente baseado no contexto
    const customerId = document.getElementById('edit-customer-id')?.value || '';
    
    // Se tem customerId, é edição, senão é novo cliente
    const prefix = customerId ? 'edit-customer-' : 'new-customer-';
    
    const full_name = document.getElementById(prefix + 'name')?.value || '';
    const phone = document.getElementById(prefix + 'phone')?.value || '';
    const birth_date = document.getElementById(prefix + 'birth-date')?.value || '';
    const zip = document.getElementById(prefix + 'zip')?.value || '';
    const street = document.getElementById(prefix + 'street')?.value || '';
    const number = document.getElementById(prefix + 'number')?.value || '';
    const neighborhood = document.getElementById(prefix + 'neighborhood')?.value || '';
    const city = document.getElementById(prefix + 'city')?.value || '';
    const state = document.getElementById(prefix + 'state')?.value || '';

    const customerData = {
        full_name,
        phone,
        birth_date: birth_date || null,
        address: {
            zip,
            street,
            number,
            neighborhood,
            city,
            state
        }
    };

    let error;
    if (customerId) {
        // Atualizar cliente existente
        ({ error } = await dbUpdate('customers', customerData, { eq: { id: customerId } }));
    } else {
        // Inserir novo cliente
        ({ error } = await dbInsert('customers', customerData));
    }

    if (error) {
        console.error('Erro ao salvar cliente:', error);
        showToast('Erro ao salvar cliente: ' + error.message, 'error');
    } else {
        showToast('Cliente salvo com sucesso!', 'success');
        document.getElementById('new-customer-form')?.reset();
        document.getElementById('edit-customer-modal').style.display = 'none';
        loadCustomersTable(); // Recarrega a tabela de clientes
    }
}

export async function loadCustomersTable(page = 1) {
    const tbody = document.getElementById('customers-table-body');
    const searchInput = document.getElementById('customer-search-input')?.value || '';

    if (!tbody) return;
    tbody.innerHTML = '<tr><td colspan="4">Carregando...</td></tr>';

    const from = (page - 1) * RECORDS_PER_PAGE;
    const to = from + RECORDS_PER_PAGE - 1;

    try {
        const options = {
            select: '*',
            count: 'exact',
            order: { column: 'created_at', ascending: false },
            range: { from, to }
        };

        if (searchInput) {
            options.or = `full_name.ilike.%${searchInput}%,phone.ilike.%${searchInput}%`;
        }
        
        const { data, error, count } = await dbSelect('customers', options);

        if (error) throw error;

        updatePaginationUI('customers', page, count);
        
        if (data.length === 0) {
            tbody.innerHTML = '<tr><td colspan="4">Nenhum cliente cadastrado.</td></tr>';
            return;
        }

        tbody.innerHTML = '';
        data.forEach(customer => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${customer.full_name}</td>
                <td>${formatPhoneMask(customer.phone || 'N/A')}</td>
                <td>${customer.email || 'N/A'}</td>
                <td class="customer-actions">
                    <button class="btn btn-sm btn-outline-primary btn-view-customer" data-id="${customer.id}">Visualizar</button>
                    <button class="btn btn-sm btn-outline-secondary btn-edit-customer" data-id="${customer.id}">Editar</button>
                    <button class="btn btn-sm btn-outline-danger btn-delete-customer" data-id="${customer.id}">Excluir</button>
                </td>
            `;
            tbody.appendChild(row);
        });

        // Adiciona event listeners para os botões de ação
        tbody.querySelectorAll('.btn-view-customer').forEach(button => {
            button.addEventListener('click', (e) => {
                viewCustomer(e.target.dataset.id);
            });
        });
        tbody.querySelectorAll('.btn-edit-customer').forEach(button => {
            button.addEventListener('click', (e) => {
                editCustomer(e.target.dataset.id);
            });
        });
        tbody.querySelectorAll('.btn-delete-customer').forEach(button => {
            button.addEventListener('click', (e) => {
                deleteCustomer(e.target.dataset.id);
            });
        });

    } catch (error) {
        console.error('Erro ao carregar clientes:', error);
        tbody.innerHTML = `<tr><td colspan="4">Erro ao carregar dados. Tente novamente. (${error.message})</td></tr>`;
    }
}

export async function performCustomerSearch(page = 1) {
    // Esta função será o wrapper para loadCustomersTable com o input de busca
    // O input de busca já é lido dentro de loadCustomersTable, então apenas chamamos ela.
    await loadCustomersTable(page);
}

export function clearCustomerSearch() {
    const searchInput = document.getElementById('customer-search-input');
    if (searchInput) {
        searchInput.value = '';
        loadCustomersTable(); // Recarrega a tabela sem filtro
    }
}

// Função para visualizar cliente
export async function viewCustomer(customerId) {
    try {
        const { data, error } = await dbSelect('customers', {
            select: '*',
            eq: { id: customerId },
            single: true
        });

        if (error) throw error;

        // Usar o modal estático do HTML
        const modal = document.getElementById('view-customer-modal');
        if (!modal) {
            // Fallback para alert se o modal não existir
            alert(`Cliente: ${data.full_name}\nTelefone: ${data.phone || 'N/A'}\nEmail: ${data.email || 'N/A'}`);
            return;
        }

        // Preencher os dados no modal
        const nameElement = modal.querySelector('#view-customer-name');
        const phoneElement = modal.querySelector('#view-customer-phone');
        const birthDateElement = modal.querySelector('#view-customer-birth-date');
        const zipElement = modal.querySelector('#view-customer-zip');
        const streetElement = modal.querySelector('#view-customer-street');
        const numberElement = modal.querySelector('#view-customer-number');
        const neighborhoodElement = modal.querySelector('#view-customer-neighborhood');
        const cityElement = modal.querySelector('#view-customer-city');
        const stateElement = modal.querySelector('#view-customer-state');

        if (nameElement) nameElement.textContent = data.full_name || 'N/A';
        if (phoneElement) phoneElement.textContent = formatPhoneMask(data.phone || 'N/A');
        if (birthDateElement) birthDateElement.textContent = data.birth_date ? new Date(data.birth_date).toLocaleDateString('pt-BR') : 'N/A';
        if (zipElement) zipElement.textContent = data.address?.zip || 'N/A';
        if (streetElement) streetElement.textContent = data.address?.street || 'N/A';
        if (numberElement) numberElement.textContent = data.address?.number || 'N/A';
        if (neighborhoodElement) neighborhoodElement.textContent = data.address?.neighborhood || 'N/A';
        if (cityElement) cityElement.textContent = data.address?.city || 'N/A';
        if (stateElement) stateElement.textContent = data.address?.state || 'N/A';

        // Exibir o modal
        modal.style.display = 'block';
        
        // Configurar event listeners para fechar o modal
        const closeBtn = modal.querySelector('#btn-close-view-customer-modal');
        const closeFooterBtn = modal.querySelector('#btn-close-view-modal');
        const editBtn = modal.querySelector('#btn-edit-from-view');
        
        const closeModal = () => {
            modal.style.display = 'none';
        };
        
        if (closeBtn) {
            closeBtn.removeEventListener('click', closeModal); // Remove listener anterior
            closeBtn.addEventListener('click', closeModal);
        }
        
        if (closeFooterBtn) {
            closeFooterBtn.removeEventListener('click', closeModal); // Remove listener anterior
            closeFooterBtn.addEventListener('click', closeModal);
        }
        
        // Configurar botão de editar
        if (editBtn) {
            const handleEdit = () => {
                closeModal();
                editCustomer(data.id);
            };
            editBtn.removeEventListener('click', handleEdit); // Remove listener anterior
            editBtn.addEventListener('click', handleEdit);
        }
        
        // Fechar modal ao clicar fora
        const handleOutsideClick = (e) => {
            if (e.target === modal) {
                closeModal();
                modal.removeEventListener('click', handleOutsideClick);
            }
        };
        
        modal.removeEventListener('click', handleOutsideClick); // Remove listener anterior
        modal.addEventListener('click', handleOutsideClick);

    } catch (error) {
        console.error('Erro ao visualizar cliente:', error);
        showToast('Erro ao carregar dados do cliente: ' + error.message, 'error');
    }
}

// Função para editar cliente
export async function editCustomer(customerId) {
    try {
        const { data, error } = await dbSelect('customers', {
            select: '*',
            eq: { id: customerId },
            single: true
        });

        if (error) throw error;

        // Preencher o formulário de edição com os dados do cliente
        const customerIdField = document.getElementById('edit-customer-id');
        const customerNameField = document.getElementById('edit-customer-name');
        const customerPhoneField = document.getElementById('edit-customer-phone');
        const customerBirthDateField = document.getElementById('edit-customer-birth-date');
        const customerZipField = document.getElementById('edit-customer-zip');
        const customerStreetField = document.getElementById('edit-customer-street');
        const customerNumberField = document.getElementById('edit-customer-number');
        const customerNeighborhoodField = document.getElementById('edit-customer-neighborhood');
        const customerCityField = document.getElementById('edit-customer-city');
        const customerStateField = document.getElementById('edit-customer-state');
        
        if (customerIdField) customerIdField.value = data.id;
        if (customerNameField) customerNameField.value = data.full_name || '';
        if (customerPhoneField) customerPhoneField.value = data.phone || '';
        if (customerBirthDateField) customerBirthDateField.value = data.birth_date || '';
        if (customerZipField) customerZipField.value = data.address?.zip || '';
        if (customerStreetField) customerStreetField.value = data.address?.street || '';
        if (customerNumberField) customerNumberField.value = data.address?.number || '';
        if (customerNeighborhoodField) customerNeighborhoodField.value = data.address?.neighborhood || '';
        if (customerCityField) customerCityField.value = data.address?.city || '';
        if (customerStateField) customerStateField.value = data.address?.state || '';

        // Exibir o modal de edição usando modal personalizado
        const editModal = document.getElementById('edit-customer-modal');
        if (editModal) {
            editModal.style.display = 'block';
        } else {
            showToast('Modal de edição não encontrado', 'error');
        }

    } catch (error) {
        console.error('Erro ao carregar dados para edição:', error);
        showToast('Erro ao carregar dados do cliente: ' + error.message, 'error');
    }
}

// Função para excluir cliente
export async function deleteCustomer(customerId) {
    // Mostrar modal de confirmação
    const deleteModal = document.getElementById('delete-customer-modal');
    if (!deleteModal) {
        // Fallback para confirm nativo se o modal não existir
        if (!confirm('Tem certeza que deseja excluir este cliente? Esta ação não pode ser desfeita.')) {
            return;
        }
        await performCustomerDeletion(customerId);
        return;
    }

    // Exibir modal de confirmação
    deleteModal.style.display = 'block';
    
    // Configurar event listeners para os botões do modal
    const confirmBtn = deleteModal.querySelector('#btn-confirm-delete-customer');
    const cancelBtn = deleteModal.querySelector('#btn-cancel-delete-customer');
    const closeBtn = deleteModal.querySelector('#btn-close-delete-customer-modal');
    
    // Função para fechar o modal
    const closeModal = () => {
        deleteModal.style.display = 'none';
        // Remover event listeners para evitar duplicação
        if (confirmBtn) confirmBtn.removeEventListener('click', handleConfirm);
        if (cancelBtn) cancelBtn.removeEventListener('click', closeModal);
        if (closeBtn) closeBtn.removeEventListener('click', closeModal);
    };
    
    // Função para confirmar exclusão
    const handleConfirm = async () => {
        closeModal();
        await performCustomerDeletion(customerId);
    };
    
    // Adicionar event listeners
    if (confirmBtn) confirmBtn.addEventListener('click', handleConfirm);
    if (cancelBtn) cancelBtn.addEventListener('click', closeModal);
    if (closeBtn) closeBtn.addEventListener('click', closeModal);
    
    // Fechar modal ao clicar fora
    deleteModal.addEventListener('click', (e) => {
        if (e.target === deleteModal) {
            closeModal();
        }
    });
}

// Função auxiliar para realizar a exclusão
async function performCustomerDeletion(customerId) {
    try {
        const { error } = await dbDelete('customers', {
            eq: { id: customerId }
        });

        if (error) throw error;

        showToast('Cliente excluído com sucesso!', 'success');
        loadCustomersTable(); // Recarrega a tabela

    } catch (error) {
        console.error('Erro ao excluir cliente:', error);
        showToast('Erro ao excluir cliente: ' + error.message, 'error');
    }
}

// Event listeners para o modal de edição
function initEditCustomerModal() {
    const modal = document.getElementById('edit-customer-modal');
    
    // Verificar se o modal existe antes de adicionar event listeners
    if (!modal) {
        // Modal de edição de cliente não encontrado no DOM
        return;
    }
    
    const closeBtn = document.getElementById('btn-close-edit-customer-modal');
    const cancelBtn = document.getElementById('btn-cancel-edit-customer');
    const form = document.getElementById('edit-customer-form');

    // Fechar modal
    if (closeBtn) {
        closeBtn.addEventListener('click', () => {
            modal.style.display = 'none';
        });
    }

    if (cancelBtn) {
        cancelBtn.addEventListener('click', () => {
            modal.style.display = 'none';
        });
    }

    // Fechar modal ao clicar fora
    if (modal) {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.style.display = 'none';
            }
        });
    }

    // Submissão do formulário
    if (form) {
        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            // Aqui você pode adicionar a lógica para salvar as alterações
            console.log('Salvando alterações do cliente...');
            modal.style.display = 'none';
        });
    }
}

// Inicializar o modal quando o DOM estiver carregado
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initEditCustomerModal);
} else {
    initEditCustomerModal();
}

// Funções auxiliares específicas do módulo de clientes podem ser adicionadas aqui se necessário