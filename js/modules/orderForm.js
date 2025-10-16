import { supabase } from '../api/supabase.js'; // Se necessário
import { showToast } from '../utils/utils.js'; // Se necessário
import { setupCustomerSearch, setupValueFormatting } from './customerManagement.js';
import { setupOSProductAutocomplete } from './serviceOrders.js';

// ========================================
// FORMULÁRIO DE ORDEM DE SERVIÇO
// ========================================

export function initializeOrderForm() {
    // Verificar se já foi inicializado para evitar duplicação
    if (window.orderFormEventListenerAdded) {
        return;
    }
    
    const osForm = document.getElementById('new-os-form');
    
    if (!osForm) return; // Só executa se estiver na página os.html

    // Marcar como inicializado
    window.orderFormEventListenerAdded = true;

    osForm.addEventListener('submit', function(event) {
        event.preventDefault(); // Previne o envio padrão do formulário
        
        // Captura todos os dados do formulário
        const formData = {
            // Dados do Cliente
            nomeCompleto: document.getElementById('nome-completo')?.value || '',
            cpf: document.getElementById('cpf')?.value || '',
            email: document.getElementById('email')?.value || '',
            telefone: document.getElementById('telefone')?.value || '',
            
            // Dados do Equipamento
            tipoEquipamento: document.getElementById('tipo-equipamento')?.value || '',
            marca: document.getElementById('marca')?.value || '',
            modelo: document.getElementById('modelo')?.value || '',
            numeroSerial: document.getElementById('numero-serial')?.value || '',
            senha: document.getElementById('senha')?.value || '',
            
            // Descrição do Problema
            descricaoProblema: document.getElementById('descricao-problema')?.value || ''
        };

        // Validação básica
        if (!validateForm(formData)) {
            return;
        }

        // Formatar dados para envio
        const emailContent = formatEmailContent(formData);
        
        console.log('Dados da Ordem de Serviço:', formData);
        console.log('Conteúdo formatado para e-mail:', emailContent);

        // ========================================
        // 🔥 IMPORTANTE: CONFIGURAR ENVIO DE E-MAIL AQUI
        // ========================================
        /*
         * INSTRUÇÕES PARA IMPLEMENTAR O ENVIO DE E-MAIL:
         * 
         * 1. EmailJS (Recomendado - Gratuito):
         *    - Acesse: https://www.emailjs.com/
         *    - Crie uma conta e configure um serviço
         *    - Substitua o comentário abaixo por:
         *    
         *    emailjs.send('YOUR_SERVICE_ID', 'YOUR_TEMPLATE_ID', {
         *        to_email: 'seuemail@empresa.com',
         *        subject: `Nova Ordem de Serviço - ${formData.nomeCompleto}`,
         *        message: emailContent
         *    }).then(() => {
         *        showSuccessMessage();
         *        osForm.reset();
         *    }).catch((error) => {
         *        console.error('Erro ao enviar:', error);
         *        alert('Erro ao enviar. Tente novamente.');
         *    });
         * 
         * 2. Formspree (Alternativa):
         *    - Acesse: https://formspree.io/
         *    - Configure um endpoint
         *    - Use fetch() para enviar os dados
         * 
         * 3. Backend próprio:
         *    - Implemente uma API para receber os dados
         *    - Use fetch() para enviar para sua API
         */

        // SIMULAÇÃO - Remover quando implementar o envio real
        simulateEmailSending(formData);
    });
}

// Validação do formulário
export function validateForm(data) {
    // Campos obrigatórios
    const requiredFields = [
        'nomeCompleto', 'cpf', 'email', 'telefone',
        'tipoEquipamento', 'marca', 'modelo', 'descricaoProblema'
    ];

    for (let field of requiredFields) {
        if (!data[field] || data[field].trim() === '') {
            alert(`Por favor, preencha o campo: ${getFieldLabel(field)}`);
            return false;
        }
    }

    // Validação específica de e-mail
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(data.email)) {
        alert('Por favor, insira um e-mail válido.');
        return false;
    }

    return true;
}

// Obter rótulo do campo para mensagens de erro
export function getFieldLabel(fieldName) {
    const labels = {
        'nomeCompleto': 'Nome Completo',
        'cpf': 'CPF',
        'email': 'E-mail',
        'telefone': 'Telefone/WhatsApp',
        'tipoEquipamento': 'Tipo de Equipamento',
        'marca': 'Marca',
        'modelo': 'Modelo',
        'descricaoProblema': 'Descrição do Problema'
    };
    return labels[fieldName] || fieldName;
}

// Formatar conteúdo para e-mail
export function formatEmailContent(data) {
    return `
NOVA ORDEM DE SERVIÇO RECEBIDA
================================

DADOS DO CLIENTE:
• Nome: ${data.nomeCompleto}
• CPF: ${data.cpf}
• E-mail: ${data.email}
• Telefone/WhatsApp: ${data.telefone}

DADOS DO EQUIPAMENTO:
• Tipo: ${data.tipoEquipamento}
• Marca: ${data.marca}
• Modelo: ${data.modelo}
• Número Serial: ${data.numeroSerial || 'Não informado'}
• Senha: ${data.senha ? '[INFORMADA - MANTER SIGILO]' : 'Não informada'}

DESCRIÇÃO DO PROBLEMA:
${data.descricaoProblema}

================================
Data/Hora: ${new Date().toLocaleString('pt-BR')}
    `.trim();
}

// Simulação do envio (REMOVER quando implementar o envio real)
export function simulateEmailSending(formData) {
    // Simula delay do envio
    const submitButton = document.querySelector('.btn-submit');
    const originalText = submitButton.textContent;
    
    submitButton.textContent = 'Enviando...';
    submitButton.disabled = true;

    setTimeout(() => {
        showSuccessMessage();
        document.getElementById('os-form').reset();
        
        submitButton.textContent = originalText;
        submitButton.disabled = false;
    }, 2000);
}

// Exibir mensagem de sucesso
export function showSuccessMessage() {
    const successMessage = document.getElementById('success-message');
    if (successMessage) {
        successMessage.classList.add('show');
        
        // Rolar para a mensagem
        successMessage.scrollIntoView({ 
            behavior: 'smooth',
            block: 'center'
        });

        // Ocultar mensagem após 10 segundos
        setTimeout(() => {
            successMessage.classList.remove('show');
        }, 10000);
    }
}

// Função para configurar o formulário de ordem de serviço no dashboard
export function setupOrderForm(currentUser, selectedStoreId) {
    const searchInput = document.getElementById('os-customer-search');
    const resultsContainer = document.getElementById('os-customer-results');
    const selectedCustomerIdInput = document.getElementById('os-selected-customer-id');
    const toggleNewCustomerBtn = document.getElementById('btn-toggle-new-customer-form');
    const newCustomerFormContainer = document.getElementById('new-customer-os-form');
    const osForm = document.getElementById('new-os-form');

    // Verificar se os elementos existem antes de configurar
    if (!osForm) {
        console.log('Formulário de OS não encontrado na página atual');
        return;
    }

    // Configurar busca de clientes diretamente
    setupCustomerSearch('os-customer-search', 'os-customer-results', 'os-selected-customer-id');
    
    // Configurar formatação de valores diretamente
    setupValueFormatting(['os-quote-value', 'os-amount-paid']);
    
    // Configurar autocomplete de produtos
    setupOSProductAutocomplete();

    // Inicializar o formulário de ordem de serviço
    initializeOrderForm();

    // Toggle para mostrar/ocultar formulário de novo cliente
    if (toggleNewCustomerBtn && newCustomerFormContainer) {
        toggleNewCustomerBtn.onclick = () => {
            const isHidden = newCustomerFormContainer.style.display === 'none';
            newCustomerFormContainer.style.display = isHidden ? 'block' : 'none';
        };
    }

    console.log('Formulário de OS configurado com sucesso');
}