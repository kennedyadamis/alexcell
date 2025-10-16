import { supabase } from '../api/supabase.js';
import { debounce } from '../utils/debounce.js';
import { formatPriceForDisplay } from '../utils/formatPriceForDisplay.js';

// Função para configurar busca de clientes
export function setupCustomerSearch(searchInputId, resultsContainerId, selectedCustomerIdInputId) {
    const searchInput = document.getElementById(searchInputId);
    const resultsContainer = document.getElementById(resultsContainerId);
    const selectedCustomerIdInput = document.getElementById(selectedCustomerIdInputId);
    
    if (!searchInput || !resultsContainer || !selectedCustomerIdInput) {
        console.error('Elementos não encontrados para busca de cliente');
        return;
    }
    
    const debouncedSearch = debounce(async (e) => {
        const term = e.target.value.trim();
        
        selectedCustomerIdInput.value = '';
        if (term.length < 2) {
            resultsContainer.innerHTML = '';
            resultsContainer.style.display = 'none';
            return;
        }
        
        try {
            const { data, error } = await supabase
                .from('customers')
                .select('id, full_name')
                .ilike('full_name', `%${term}%`)
                .limit(5);
                
            if (error) {
                console.error('Erro na busca de clientes:', error);
                return;
            }
            
            if (data.length === 0) {
                resultsContainer.innerHTML = '<div class="autocomplete-item">Nenhum cliente encontrado</div>';
            } else {
                resultsContainer.innerHTML = data.map(c => 
                    `<div class="autocomplete-item" data-id="${c.id}">${c.full_name}</div>`
                ).join('');
            }
            
            resultsContainer.style.display = 'block';
            
            resultsContainer.querySelectorAll('.autocomplete-item[data-id]').forEach(item => {
                item.addEventListener('click', async () => {
                    const customerId = item.dataset.id;
                    
                    // Buscar dados completos do cliente no banco
                    try {
                        const { data: customer, error } = await supabase
                            .from('customers')
                            .select('id, full_name, phone')
                            .eq('id', customerId)
                            .single();

                        if (error) {
                            console.error('Erro ao buscar dados do cliente:', error);
                            return;
                        }

                        const customerName = customer.full_name || '';
                        const customerPhone = customer.phone || '';

                        searchInput.value = customerName;
                        selectedCustomerIdInput.value = customerId;
                        
                        // Atualizar também o campo edit-os-new-customer-name se existir
                        const newCustomerNameField = document.getElementById('edit-os-new-customer-name');
                        if (newCustomerNameField) {
                            newCustomerNameField.value = customerName;
                            console.log('✅ Campo edit-os-new-customer-name atualizado:', customerName);
                        }
                        
                        // Atualizar também o campo edit-os-new-customer-phone se existir
                        const newCustomerPhoneField = document.getElementById('edit-os-new-customer-phone');
                        if (newCustomerPhoneField) {
                            newCustomerPhoneField.value = customerPhone;
                            console.log('✅ Campo edit-os-new-customer-phone atualizado:', customerPhone);
                        }
                        
                        // Atualizar também o campo edit-os-selected-customer-id se existir
                        const selectedCustomerField = document.getElementById('edit-os-selected-customer-id');
                        if (selectedCustomerField) {
                            selectedCustomerField.value = customerId;
                            console.log('✅ Campo edit-os-selected-customer-id atualizado:', customerId);
                        }
                        
                        resultsContainer.innerHTML = '';
                        resultsContainer.style.display = 'none';
                    } catch (error) {
                        console.error('Erro ao buscar cliente:', error);
                    }
                });
            });
        } catch (error) {
            console.error('Erro na busca:', error);
        }
    }, 300);
    
    // Remove listener anterior se existir
    searchInput.removeEventListener('input', searchInput._customerSearchListener);
    searchInput._customerSearchListener = debouncedSearch;
    searchInput.addEventListener('input', debouncedSearch);
    
    // Fechar resultados ao clicar fora
    document.addEventListener('click', (e) => {
        if (!searchInput.contains(e.target) && !resultsContainer.contains(e.target)) {
            resultsContainer.style.display = 'none';
        }
    });
}

// Função para configurar formatação de valores
export function setupValueFormatting(fieldIds) {
    fieldIds.forEach(fieldId => {
        const field = document.getElementById(fieldId);
        if (field && !field.dataset.formattingSetup) {
            // Marcar que a formatação já foi configurada
            field.dataset.formattingSetup = 'true';
            
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