import { supabase } from './js/api/supabase.js';
import { dbSelect, dbDelete, dbInsert } from './js/utils/authInterceptor.js';
import { initializeAuthForms } from './js/auth/auth.js';
import { initializeLazyLoading, preloadCriticalResources, setupModalCloseEvents, updatePaginationUI } from './js/utils/utils.js';
import { initializeNavigation, updateNavigationVisibility } from './js/modules/navigation.js';
import { openEditUserModal } from './js/modules/userPermissions.js';
import { initializePermissionsModule } from './js/modules/permissions.js';
import { initializeCustomerFormEvents, loadCustomersTable, performCustomerSearch, clearCustomerSearch, saveCustomer, viewCustomer, editCustomer, deleteCustomer } from './js/modules/customers.js';
import { formatPhoneMask, formatCurrencyBR, formatValueForDisplay, formatDateForDisplay } from './js/utils/formatters.js';
import { canViewCostPrices, formatCostPrice } from './js/utils/costPermissions.js';
import { loadOSTable, refreshOSList, openNewOSModal, closeNewOSModal, fetchAddressByCEP, initializePatternLock, confirmAddProduct, updateOSTotal, setupOrderForm, updateOSStatus, markAsAwaitingPickup, markAsDelivered, openOSPaymentModal, setupOSPaymentEvents, updateOSSplitSummary, deleteOS, viewOS, editOS, populateEditOSForm, setupEditPatternLock, setupEditValueFormatting, addEditOSProduct, setupEditCustomerAutocomplete, setupEditProductAutocomplete, updateEditOSTotal as updateEditOSTotalServiceOrders, closeEditOSModal, setupEditOSEvents, initializeOSConsultation, showConsultationMessage, displayOSResults, adjustQuantity, updateProductTotal, formatCurrencyInput, openAddProductModal, closeAddProductModal, closeViewOSModal, saveEditedOSProduct, searchOSByCustomer, clearOSSearch } from './js/modules/serviceOrders.js';
import { resetAddProductModal } from './js/utils/resetAddProductModal.js';
import { loadDynamicBanner, createDefaultBanners } from './js/modules/banners.js';
import { initializeOrderForm, validateForm, getFieldLabel, formatEmailContent, simulateEmailSending, showSuccessMessage } from './js/modules/orderForm.js';
import { getCurrentUser, getSelectedStoreId, setCurrentUser, setSelectedStoreId } from './js/utils/globals.js';
let osCurrentPage = 1;
let customersCurrentPage = 1;
let warrantyCurrentPage = 1;
const RECORDS_PER_PAGE = 10;

// Variável global para o carrinho do PDV
let cart = [];
const cartBody = document.getElementById('pdv-cart-body');

// NOVO: Debounce para busca de cliente
let customerSearchTimeout;

// Performance: IntersectionObserver para lazy loading
let imageObserver;

// Performance: Throttle para scroll events
let ticking = false;

// Accessibility: Gerenciamento de foco
let focusableElements = 'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])';

// =================================================================
// DECLARAÇÃO E EXPOSIÇÃO GLOBAL DAS FUNÇÕES DE AÇÃO
// =================================================================
// Movidas para o topo para garantir que existam antes de qualquer chamada.

// Disponibilizar funções importadas globalmente
window.markAsDelivered = markAsDelivered;
window.markAsAwaitingPickup = markAsAwaitingPickup;
window.viewOS = viewOS;
window.editOS = editOS;
window.deleteOS = deleteOS;
window.openOSPaymentModal = openOSPaymentModal;

// Funções do modal de novo cliente
window.openNewCustomerModal = openNewCustomerModal;
window.closeNewCustomerModal = closeNewCustomerModal;
window.saveNewCustomerFromModal = saveNewCustomerFromModal;

// ... (variáveis globais)
let currentUserPermissions = {};

// Ponto de entrada principal após o carregamento da página
// Debug removido
document.addEventListener('DOMContentLoaded', function() {
    // Debug removido
    
    // Performance: Initialize lazy loading
    initializeLazyLoading();
    
    // Funções que podem ser inicializadas antes da verificação de login
    initializeNavigation();
    
    // Performance: Preload critical resources
    preloadCriticalResources();
    
    // Carrega o banner dinâmico apenas uma vez
    // Debug removido
    if (document.querySelector('.hero-carousel-section')) {
        // Debug removido
        
        // Carrega imediatamente se o Supabase já estiver disponível
        if (typeof supabase !== 'undefined') {
            // Debug removido
            loadDynamicBanner();
        } else {
            console.log('⏳ Aguardando Supabase...');
            // Aguarda o Supabase ficar disponível
            const checkSupabase = setInterval(() => {
                if (typeof supabase !== 'undefined') {
                    // Debug removido
                    clearInterval(checkSupabase);
                    loadDynamicBanner();
                }
            }, 100);
            
            // Timeout de segurança após 5 segundos
            setTimeout(() => {
                clearInterval(checkSupabase);
                console.log('⚠️ Timeout: usando banners padrão');
                createDefaultBanners();
            }, 5000);
        }
    } else {
        // Debug removido
    }
    
    if (window.location.pathname.includes('auth.html')) {
        initializeAuthForms();
    }

    // Listener central de autenticação do Supabase.
    // Ele gerencia o acesso às páginas e o estado do usuário.
    supabase.auth.onAuthStateChange((event, session) => {
        // Debug removido
        
        const onDashboard = window.location.pathname.includes('dashboard.html');
        const onAuthPage = window.location.pathname.includes('auth.html');
        const onStoreSelector = window.location.pathname.includes('store-selector.html');

        if (event === 'SIGNED_IN' || (event === 'INITIAL_SESSION' && session)) {
            // USUÁRIO ESTÁ LOGADO
            // Debug removido
            
            if (onAuthPage) {
                // Verifica se já tem loja selecionada
                const hasStorePermissions = sessionStorage.getItem('user_store_permissions');
                console.log('🏪 Permissões de loja:', hasStorePermissions ? 'Encontradas' : 'Não encontradas');
                
                if (hasStorePermissions) {
                    // Se já tem permissões salvas, vai direto para o dashboard
                    console.log('➡️ Redirecionando para dashboard');
                    window.location.href = 'dashboard.html';
                } else {
                    // Se não tem permissões salvas, vai para seleção de loja
                    console.log('➡️ Redirecionando para seleção de loja');
                    window.location.href = 'store-selector.html';
                }
            } else if (onDashboard) {
                // Se estiver no dashboard, inicializa os componentes da página
                // Debug removido
                initializeDashboard(session);
            }
        } else if (event === 'SIGNED_OUT' || (event === 'INITIAL_SESSION' && !session)) {
            // USUÁRIO NÃO ESTÁ LOGADO
            // Debug removido
            
            if (onDashboard || onStoreSelector) {
                // Se um usuário não logado tentar acessar o dashboard ou seletor de loja, redireciona para o login
                console.log('➡️ Redirecionando para login');
                window.location.href = 'auth.html';
            }
        }
        
        // Atualiza a barra de navegação em qualquer mudança de estado de autenticação
        updateNavigationVisibility(session);
    });

    // Inicializa funcionalidades de páginas não autenticadas
    if (!window.location.pathname.includes('dashboard.html')) {
        initializeNavigation(); // Nav do site principal
        initializeOSConsultation(); // Sistema de consulta de OS
    }

    // Performance: Remove loading states after page load
    window.addEventListener('load', () => {
        document.body.classList.add('loaded');
        
        // Remove skeleton loaders if any
        document.querySelectorAll('.skeleton').forEach(el => {
            el.classList.remove('skeleton');
        });
    });

    setupModalCloseEvents();

    // Inicializar consulta de OS na página pública
    initializeOSConsultation();
    
    // Inicializar troca de senha se o formulário estiver presente
    initializePasswordChange();
    
    // Inicializar funcionalidades de configuração se estiverem presentes
    if (document.getElementById('logo-uploader')) {
        initializeLogoUploader();
    }
    
    if (document.getElementById('save-banner-btn')) {
        initializeBannerManagement();
    }

    if (document.getElementById('module-usuarios-permissoes')) {
        initializePermissionsModule();
    }

    // Debug removido
});

// ========================================
// SISTEMA DE AUTENTICAÇÃO
// ========================================

function initializeAuth() {
    // Só executa se estiver na página de autenticação
    if (!document.querySelector('.auth-page')) return;

    initializeAuthTabs();
    initializeAuthForms();
}

// ========================================
// INICIALIZAÇÃO DE AUTENTICAÇÃO (APENAS LOGIN)
// ========================================

function initializeAuthTabs() {
    // Não há mais tabs de alternância, apenas login
    // Remove mensagens de erro/sucesso ao carregar
    hideAuthMessages();
}

// ========================================
// SISTEMA DO DASHBOARD
// ========================================

// STUB para evitar erro quando loadAllStores não estiver definido
async function loadAllStores() {
    return;
}

// Inicializa o Dashboard completo
async function initializeDashboard(session) {
    let currentStoreId = sessionStorage.getItem('selected_store_id');
    if (!currentStoreId) {
        currentStoreId = '1'; // Loja padrão
        sessionStorage.setItem('selected_store_id', currentStoreId);
    }
    setSelectedStoreId(currentStoreId);
    const permissionsString = sessionStorage.getItem('user_store_permissions');
    if (!permissionsString) {
        window.location.href = 'store-selector.html';
        return;
    }
    currentUserPermissions = JSON.parse(permissionsString || '{}');
    if (!document.querySelector('.dashboard-container') || !session) return;
    
    // Configura o perfil do usuário
    try {
        const { data: profile, error } = await dbSelect('profiles', { select: 'full_name, role', eq: { id: session.user.id }, single: true });
        if (error) throw error;
        setCurrentUser({ ...session.user, ...profile });
    } catch (error) {
        console.error('Falha ao carregar perfil, deslogando.', error);
        await supabase.auth.signOut();
        return;
    }

    // Carrega os dados do usuário, permissões e TODOS os eventos
    loadUserData();
    applyPermissions();
    initializeDashboardEventListeners();
    setupSwitchStoreButton(); // NOVO
    loadAllStores(); // Carrega as lojas para o módulo de usuários
    
    // Inicializar funcionalidades consolidadas (evita listeners duplicados)
    setupPDVSplitPayment();
    setupCashMoneyOperations();
    setupCloseCashRegister();
    setupOSModalEvents();
    setupPatternLock();
    loadOSTable(1, getSelectedStoreId(), printWithToast);
    loadCustomersTable();
    // Chamar setupOpenCashRegister aqui!
    setupOpenCashRegister();
    setupOrderForm(getCurrentUser(), getSelectedStoreId());
}

async function setupSwitchStoreButton() {
    const switchBtn = document.getElementById('btn-switch-store');
    if (!switchBtn) return;

    try {
        const { count, error } = await supabase
            .from('user_store_permissions')
            .select('*', { count: 'exact', head: true })
            .eq('user_id', getCurrentUser().id);
        
        if (error) throw error;

        if (count > 1) {
            switchBtn.style.display = 'block';
            switchBtn.addEventListener('click', () => {
                sessionStorage.removeItem('selected_store_id');
                window.location.href = 'store-selector.html';
            });
        }
    } catch(err) {
        console.error("Erro ao verificar permissões para troca de loja:", err);
    }
}

// Reestruturada: ÚNICA função para configurar TODOS os eventos do dashboard
function initializeDashboardEventListeners() {
    // Navegação entre módulos
    document.querySelectorAll('.nav-item[data-module]').forEach(item => {
        item.addEventListener('click', function() {
            const module = this.getAttribute('data-module');
            
            // Atualizar estado visual da navegação
            document.querySelectorAll('.nav-item').forEach(nav => nav.classList.remove('active'));
            this.classList.add('active');
            
            // Esconder todos os módulos
            document.querySelectorAll('.module-page').forEach(page => page.style.display = 'none');
            
            // Mostrar módulo selecionado
            const targetModule = document.getElementById(`module-${module}`);
            if (targetModule) {
                targetModule.style.display = 'block';
            }

            // Inicializar funcionalidades específicas do módulo
            switch(module) {
                case 'os':
                    loadOSTable(1, getSelectedStoreId(), printWithToast); // Passa a loja selecionada e a página inicial
                    diagnosticModals();
                    break;
                case 'pdv':
                    initializePDV();
                    break;
                case 'caixa':
                    initializeCashRegisterModule();
                    break;
                case 'estoque':
                    initializeStockModule();
                    break;
                case 'relatorios':
                    initializeReportsModule();
                    break;
                case 'configuracoes':
                    // Inicializar funcionalidades de configuração
                    initializeLogoUploader();
                    initializeBannerManagement();
                    break;
                case 'trocar-senha':
                    // Inicializar troca de senha
                    initializePasswordChange();
                    break;
                case 'garantia':
                    initializeWarrantyModule();
                    break;
                case 'usuarios-permissoes':
                    initializePermissionsModule();
                    break;
            }
        });
    });

    // --- Eventos Gerais ---
    const logoutBtn = document.getElementById('logout-btn');
    if (logoutBtn) logoutBtn.addEventListener('click', logout);

    // --- Eventos do Módulo de OS ---
    const btnNewOs = document.getElementById('btn-new-os');
    if (btnNewOs) btnNewOs.addEventListener('click', () => openNewOSModal(getCurrentUser(), getSelectedStoreId(), printWithToast));
    
    const btnCloseOsModal = document.getElementById('btn-close-os-modal');
    if (btnCloseOsModal) btnCloseOsModal.addEventListener('click', closeNewOSModal);

    const osCustomerSearch = document.getElementById('os-customer-search');
    if(osCustomerSearch) osCustomerSearch.addEventListener('keyup', (e) => { /* ... debounce ... */ });

    const osPaymentStatus = document.getElementById('os-payment-status');
    if(osPaymentStatus) osPaymentStatus.addEventListener('change', (e) => { /* ... */ });
    
    // --- Eventos da Barra de Pesquisa de OS ---
    const btnSearchOS = document.getElementById('btn-search-os');
    if (btnSearchOS) btnSearchOS.addEventListener('click', searchOSByCustomer);
    
    const btnClearOSSearch = document.getElementById('btn-clear-os-search');
    if (btnClearOSSearch) btnClearOSSearch.addEventListener('click', clearOSSearch);
    
    const osSearchInput = document.getElementById('os-search-input');
    if (osSearchInput) {
        osSearchInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                searchOSByCustomer();
            }
        });
    }
    
    // --- Eventos do Módulo de Clientes ---
    const btnNewCustomer = document.getElementById('btn-new-customer');
    if (btnNewCustomer) btnNewCustomer.addEventListener('click', () => { 
        document.getElementById('new-customer-form-container').style.display = 'block'; 
        // Adiciona os listeners quando o formulário se torna visível
        initializeCustomerFormEvents();
    });

    const btnCancelNewCustomer = document.getElementById('btn-cancel-new-customer');
    if(btnCancelNewCustomer) btnCancelNewCustomer.addEventListener('click', () => { document.getElementById('new-customer-form-container').style.display = 'none'; });
    
    const btnSearchCustomer = document.getElementById('btn-search-customer');
    if(btnSearchCustomer) btnSearchCustomer.addEventListener('click', () => { 
        const searchContainer = document.getElementById('search-customer-form-container');
        searchContainer.style.display = searchContainer.style.display === 'none' ? 'block' : 'none';
    });

    // --- Eventos do Modal de Novo Cliente (para OS) ---
    const newCustomerModalForm = document.getElementById('new-customer-modal-form');
    if (newCustomerModalForm) {
        newCustomerModalForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            await saveNewCustomerFromModal();
        });
    }

    // --- Eventos do Módulo de Configurações ---
    initializeLogoUploader();
    initializeBannerManagement();

    // ... (Restante dos eventos de clientes com a mesma verificação 'if')

    // --- Eventos do Módulo de Ponto de Venda (PDV) ---
    initializePDV();

    // --- Eventos do Módulo de Estoque ---
    initializeStockModule();

    // --- Eventos do Módulo de Caixa ---
    initializeCashRegisterModule();

    // --- Eventos do Módulo de Relatórios ---
    initializeReportsModule();

    // --- Eventos do Módulo de Garantia ---
    initializeWarrantyModule();

    // --- Eventos dos botões de marca na edição de OS ---
    // Eventos removidos - funções addEditOSBrand e removeEditOSBrand não existem mais
    // Os campos de marca agora são input de texto

    // ... (Restante dos eventos de configurações)
}


function loadUserData() {
    const currentUser = getCurrentUser();
    if (!currentUser) return;
    const userNameEl = document.getElementById('user-name');
    const userRoleEl = document.getElementById('user-role');
    if (userNameEl) userNameEl.textContent = currentUser.full_name || currentUser.email; 
    if (userRoleEl) {
        const roleMap = {
            owner: 'Dono',
            admin: 'Administrador',
            technician: 'Técnico',
            employee: 'Funcionário'
        };
        const displayRole = roleMap[currentUser.role] || 'Usuário';
        userRoleEl.textContent = displayRole;
        userRoleEl.className = `user-role-badge ${currentUser.role}`;
    }
    loadProfileData();
}

function loadProfileData() {
    const currentUser = getCurrentUser();
    if (!currentUser) return;
    const roleMap = {
        owner: 'Dono',
        admin: 'Administrador',
        technician: 'Técnico',
        employee: 'Funcionário'
    };
    const displayRole = roleMap[currentUser.role] || 'Usuário';
    const profileElements = {
        'profile-name': currentUser.full_name || currentUser.email,
        'profile-email': currentUser.email,
        'profile-role': displayRole,
        'profile-permissions': `Acesso de ${displayRole}`,
        'profile-last-access': new Date(currentUser.last_sign_in_at).toLocaleString('pt-BR')
    };
    Object.entries(profileElements).forEach(([id, value]) => {
        const element = document.getElementById(id);
        if (element) element.textContent = value;
    });
}

// REESCRITA: para usar permissões granulares
function applyPermissions() {
    const currentUser = getCurrentUser();
    if (!currentUser) return;
    
    // Esconde/mostra módulos inteiros com base nas permissões da loja atual
    document.querySelector('.nav-item[data-module="os"]').style.display = currentUserPermissions.can_manage_os ? 'list-item' : 'none';
    document.querySelector('.nav-item[data-module="pdv"]').style.display = currentUserPermissions.can_manage_pdv ? 'list-item' : 'none';
    document.querySelector('.nav-item[data-module="caixa"]').style.display = currentUserPermissions.can_manage_cash ? 'list-item' : 'none';
    document.querySelector('.nav-item[data-module="estoque"]').style.display = currentUserPermissions.can_manage_stock ? 'list-item' : 'none';
    document.querySelector('.nav-item[data-module="relatorios"]').style.display = currentUserPermissions.can_view_reports ? 'list-item' : 'none';
    document.querySelector('.nav-item[data-module="garantia"]').style.display = currentUserPermissions.can_manage_os ? 'list-item' : 'none';

    // A visibilidade da aba de Configurações depende da role principal do sistema
    const canAccessSettings = currentUser.role === 'owner' || currentUser.role === 'admin' || currentUser.role === 'technician';
    document.querySelector('.nav-item[data-module="configuracoes"]').style.display = canAccessSettings ? 'list-item' : 'none';
    
    // A visibilidade da aba de Usuários e Permissões também depende da role principal
    const canAccessUsers = currentUser.role === 'owner' || currentUser.role === 'admin';
    const usersNavItem = document.querySelector('.nav-item[data-module="usuarios-permissoes"]');
    if (usersNavItem) {
        usersNavItem.style.display = canAccessUsers ? 'list-item' : 'none';
    }
    
    // Controla a visibilidade da seção de gerenciamento de banner
    const bannerSection = document.getElementById('banner-management-section');
    if (bannerSection) {
        bannerSection.style.display = canAccessSettings ? 'block' : 'none';
    }
    
    // A aba "Trocar Senha" está sempre visível para todos os usuários logados
    document.querySelector('.nav-item[data-module="trocar-senha"]').style.display = 'list-item';
}

// ========================================
// CAROUSEL DE BANNERS - FUNÇÃO REMOVIDA (DUPLICADA)
// ========================================
// A função initializeHeroCarousel() já existe na linha 344
// Esta versão duplicada foi removida para evitar conflitos

// ========================================
// FUNÇÕES DE UTILIDADE DO DASHBOARD
// ========================================

function toggleUserInfo() {
    const profileSection = document.getElementById('user-profile-section');
    if (profileSection) {
        if (profileSection.style.display === 'none') {
            profileSection.style.display = 'block';
            profileSection.scrollIntoView({ behavior: 'smooth' });
        } else {
            profileSection.style.display = 'none';
        }
    }
}

async function logout() {
    if (confirm('Tem certeza que deseja sair do sistema?')) {
        // Limpa as informações de sessão
        sessionStorage.removeItem('selected_store_id');
        sessionStorage.removeItem('user_store_permissions');
        
        await supabase.auth.signOut();
        window.location.href = 'index.html'; // Redireciona para a página inicial
    }
}

// Função para verificar se usuário tem permissão específica
function hasPermission(permission) {
    const currentUser = getCurrentUser();
    if (!currentUser) return false;
    return currentUser.permissions.includes(permission);
}

// Função para exibir mensagem baseada na permissão
function checkPermissionAndShow(permission, message) {
    if (hasPermission(permission)) {
        alert(`✅ ${message}`);
    } else {
        alert('❌ Você não tem permissão para acessar esta funcionalidade.');
    }
}

// ========================================
// SISTEMA DE UPLOAD DE LOGO
// ========================================

function initializeLogoUploader() {
    const logoUploader = document.getElementById('logo-uploader');
    const saveLogoBtn = document.getElementById('save-logo-btn');
    const deleteLogoBtn = document.getElementById('delete-logo-btn');
    const logoPreview = document.getElementById('print-logo-preview');
    const logoFeedback = document.getElementById('logo-feedback');
    
    if (!logoUploader) return;
    
    let selectedFile = null;
    
    // Carregar logo atual do Supabase
    loadCurrentLogo();
    
    // Upload de arquivo
    logoUploader.addEventListener('change', function(event) {
        const file = event.target.files[0];
        if (!file) return;
        
        // Validar arquivo
        if (!file.type.includes('image/')) {
            showLogoFeedback('error', 'Por favor, selecione apenas arquivos de imagem.');
            return;
        }
        
        if (file.size > 5 * 1024 * 1024) { // 5MB
            showLogoFeedback('error', 'O arquivo deve ter no máximo 5MB.');
            return;
        }
        
        selectedFile = file;
        
        // Preview da imagem
        const reader = new FileReader();
        reader.onload = function(e) {
            logoPreview.src = e.target.result;
            showLogoFeedback('success', 'Imagem carregada. Clique em "Salvar Logo" para aplicar.');
        };
        reader.readAsDataURL(file);
    });
    
    // Salvar logo
    saveLogoBtn.addEventListener('click', async function() {
        if (!selectedFile) {
            showLogoFeedback('error', 'Selecione uma imagem primeiro.');
            return;
        }
        
        const originalText = this.textContent;
        this.textContent = '🔄 Salvando...';
        this.disabled = true;
        
        try {
            const fileExt = selectedFile.name.split('.').pop();
            const fileName = `store_${getSelectedStoreId() || 1}/print-logo.${fileExt}`;
            
            // Upload para Supabase Storage
            const { error: uploadError } = await supabase.storage
                .from('assets')
                .upload(`public/${fileName}`, selectedFile, {
                    upsert: true
                });
            
            if (uploadError) throw uploadError;
            
            showLogoFeedback('success', 'Logo salvo com sucesso!');
            selectedFile = null;
            logoUploader.value = '';
            
    } catch (error) {
            console.error('Erro ao salvar logo:', error);
            showLogoFeedback('error', `Erro ao salvar: ${error.message}`);
        } finally {
            this.textContent = originalText;
            this.disabled = false;
        }
    });
    
    // Deletar logo
    deleteLogoBtn.addEventListener('click', async function() {
        if (!confirm('Tem certeza que deseja excluir o logo atual?')) return;
        
        const originalText = this.textContent;
        this.textContent = '🔄 Excluindo...';
        this.disabled = true;
        
        try {
            const logoFormats = ['png', 'jpg', 'jpeg'];
            
            for (const format of logoFormats) {
                const fileName = `public/store_${getSelectedStoreId() || 1}/print-logo.${format}`;
                await supabase.storage.from('assets').remove([fileName]);
            }
            
            logoPreview.src = 'logos/1.png'; // Logo padrão
            showLogoFeedback('success', 'Logo excluído com sucesso!');
            
        } catch (error) {
            console.error('Erro ao excluir logo:', error);
            showLogoFeedback('error', `Erro ao excluir: ${error.message}`);
        } finally {
            this.textContent = originalText;
            this.disabled = false;
        }
    });
    
    function showLogoFeedback(type, message) {
        logoFeedback.className = `feedback-message ${type}`;
        logoFeedback.textContent = message;
        logoFeedback.style.display = 'block';
        
        setTimeout(() => {
            logoFeedback.style.display = 'none';
        }, 5000);
    }
    
    async function loadCurrentLogo() {
        try {
            const logoFormats = ['png', 'jpg', 'jpeg'];
            let logoFound = false;
            
            // Primeiro, verificar se existem arquivos antes de tentar baixar
            for (const format of logoFormats) {
                const fileName = `public/store_${getSelectedStoreId() || 1}/print-logo.${format}`;
                
                try {
                    // Verificar se o arquivo existe primeiro
                    const { data: fileList, error: listError } = await supabase.storage
                        .from('assets')
                        .list(`public/store_${getSelectedStoreId() || 1}`, {
                            search: `print-logo.${format}`
                        });
                    
                    if (listError || !fileList || fileList.length === 0) {
                        continue; // Arquivo não existe, tentar próximo formato
                    }
                    
                    // Se o arquivo existe, tentar baixar
                    const { data, error } = await supabase.storage
                        .from('assets')
                        .download(fileName);
                    
                    if (!error && data) {
                        const url = URL.createObjectURL(data);
                        logoPreview.src = url;
                        logoFound = true;
                        console.log(`Logo carregado: ${fileName}`);
                        break;
                    }
                } catch (formatError) {
                    // Silenciosamente continuar para o próximo formato
                    continue;
                }
            }
            
            if (!logoFound) {
                // Logo padrão será usado
                logoPreview.src = 'logos/1.png';
            }
        } catch (error) {
            console.error('Erro ao carregar logo:', error);
            logoPreview.src = 'logos/1.png';
        }
    }
}

// ========================================
// SISTEMA DE GERENCIAMENTO DE BANNERS
// ========================================

function initializeBannerManagement() {
    const saveBannerBtn = document.getElementById('save-banner-btn');
    const previewBannerBtn = document.getElementById('preview-banner-btn');
    const resetBannerBtn = document.getElementById('reset-banner-btn');
    const bannerFeedback = document.getElementById('banner-feedback');
    
    if (!saveBannerBtn) return;
    
    // Configurar troca de abas
    setupBannerTabs();
    
    // Configurar upload de imagens dos slides
    setupBannerImageUploads();
    
    // Carregar banners existentes
    loadExistingBanners();
    
    // Salvar banners
    saveBannerBtn.addEventListener('click', async function() {
        const originalText = this.textContent;
        this.textContent = '🔄 Salvando...';
        this.disabled = true;
        
        try {
            const bannerData = collectBannerData();
            
            // Salvar no Supabase
            const { error } = await supabase
                .from('site_settings')
                .upsert({
                    key: 'banner_slides',
                    value: { slides: bannerData }
                });

        if (error) throw error;
        
            showBannerFeedback('success', 'Banners salvos com sucesso!');
            
        } catch (error) {
            console.error('Erro ao salvar banners:', error);
            showBannerFeedback('error', `Erro ao salvar: ${error.message}`);
        } finally {
            this.textContent = originalText;
            this.disabled = false;
        }
    });
    
    // Preview no site
    previewBannerBtn.addEventListener('click', function() {
        window.open('index.html', '_blank');
    });
    
    // Reset para padrão
    resetBannerBtn.addEventListener('click', async function() {
        if (!confirm('Tem certeza que deseja restaurar os banners padrão?')) return;
        
        const originalText = this.textContent;
        this.textContent = '🔄 Restaurando...';
        this.disabled = true;
        
        try {
            const defaultBanners = [
                {
                    title: "Tela Quebrada? Resolvemos na Hora.",
                    description: "Reparo de telas de todas as marcas com peças de alta qualidade e garantia.",
                    buttonText: "Ver Serviços de Tela",
                    buttonLink: "servicos.html",
                    image: "logos/1.png"
                },
                {
                    title: "Especialistas em Reparo de Placa",
                    description: "Análise e reparo de placas com tecnologia de ponta.",
                    buttonText: "Saiba Mais sobre Reparos",
                    buttonLink: "servicos.html",
                    image: "logos/1.png"
                },
                {
                    title: "Bateria Nova, Vida Nova",
                    description: "Troca de baterias com agilidade para seu celular durar o dia todo.",
                    buttonText: "Orçamento para Bateria",
                    buttonLink: "servicos.html",
                    image: "logos/1.png"
                }
            ];
            
            const { error } = await supabase
                .from('site_settings')
                .upsert({
                    key: 'banner_slides',
                    value: { slides: defaultBanners }
                });
            
            if (error) throw error;
            
            // Atualizar campos do formulário
            loadBannerData(defaultBanners);
            showBannerFeedback('success', 'Banners restaurados para o padrão!');
            
        } catch (error) {
            console.error('Erro ao restaurar banners:', error);
            showBannerFeedback('error', `Erro ao restaurar: ${error.message}`);
        } finally {
            this.textContent = originalText;
            this.disabled = false;
        }
    });
    
    function setupBannerImageUploads() {
        for (let i = 0; i <= 2; i++) {
            const uploader = document.getElementById(`slide-${i}-uploader`);
            const preview = document.getElementById(`slide-${i}-preview`);
            
            if (uploader && preview) {
                uploader.addEventListener('change', function(event) {
                    const file = event.target.files[0];
                    if (!file) return;
                    
                    if (!file.type.includes('image/')) {
                        showBannerFeedback('error', 'Selecione apenas arquivos de imagem.');
                        return;
                    }
                    
                    const reader = new FileReader();
                    reader.onload = function(e) {
                        preview.src = e.target.result;
                        preview.dataset.newImage = 'true';
                    };
                    reader.readAsDataURL(file);
                });
            }
        }
    }
    
    function collectBannerData() {
        const banners = [];
        
        for (let i = 0; i <= 2; i++) {
            const title = document.getElementById(`slide-${i}-title`)?.value || '';
            const description = document.getElementById(`slide-${i}-description`)?.value || '';
            const buttonText = document.getElementById(`slide-${i}-button-text`)?.value || '';
            const buttonLink = document.getElementById(`slide-${i}-button-link`)?.value || '';
            const preview = document.getElementById(`slide-${i}-preview`);
            
            banners.push({
                title,
                description,
                buttonText,
                buttonLink,
                image: preview?.src || 'logos/1.png'
            });
        }
        
        return banners;
    }
    
    function loadBannerData(banners) {
        banners.forEach((banner, i) => {
            const titleInput = document.getElementById(`slide-${i}-title`);
            const descInput = document.getElementById(`slide-${i}-description`);
            const btnTextInput = document.getElementById(`slide-${i}-button-text`);
            const btnLinkInput = document.getElementById(`slide-${i}-button-link`);
            const preview = document.getElementById(`slide-${i}-preview`);
            
            if (titleInput) titleInput.value = banner.title || '';
            if (descInput) descInput.value = banner.description || '';
            if (btnTextInput) btnTextInput.value = banner.buttonText || '';
            if (btnLinkInput) btnLinkInput.value = banner.buttonLink || '';
            if (preview) preview.src = banner.image || 'logos/1.png';
        });
    }
    
    function setupBannerTabs() {
        const tabs = document.querySelectorAll('.banner-tab');
        const slides = document.querySelectorAll('.banner-slide-editor');
        
        tabs.forEach(tab => {
            tab.addEventListener('click', function() {
                const slideIndex = this.dataset.slide;
                
                // Remover active de todas as abas e slides
                tabs.forEach(t => t.classList.remove('active'));
                slides.forEach(s => s.classList.remove('active'));
                
                // Adicionar active na aba e slide selecionados
                this.classList.add('active');
                const targetSlide = document.querySelector(`[data-slide="${slideIndex}"].banner-slide-editor`);
                if (targetSlide) {
                    targetSlide.classList.add('active');
                }
            });
        });
    }
    
    async function loadExistingBanners() {
        try {
            const { data: settings, error } = await supabase
                .from('site_settings')
                .select('value')
                .eq('key', 'banner_slides')
                .single();
            
            if (error || !settings?.value?.slides) {
                console.log('Nenhum banner encontrado, usando valores padrão');
                return;
            }
            
            const banners = settings.value.slides;
            loadBannerData(banners);
            
        } catch (error) {
            console.error('Erro ao carregar banners:', error);
        }
    }
    
    function showBannerFeedback(type, message) {
        bannerFeedback.className = `feedback-message ${type}`;
        bannerFeedback.textContent = message;
        bannerFeedback.style.display = 'block';
        
        setTimeout(() => {
            bannerFeedback.style.display = 'none';
        }, 5000);
    }
}

// Função global para inicializar o módulo PDV (placeholder)
function initializePDV() {
    setupPDVSplitPayment(); // Configura o modal de pagamento dividido
}

// Função para limpar o carrinho do PDV (simples)
function clearPDVCart() {
    const cartBody = document.getElementById('pdv-cart-body');
    if (cartBody) cartBody.innerHTML = '';
    document.getElementById('pdv-summary-total').textContent = 'R$ 0,00';
    document.getElementById('pdv-summary-subtotal').textContent = 'R$ 0,00';
    document.getElementById('pdv-summary-discount').value = '0.00';
}

// ATUALIZADO: Painel de resumo do caixa
async function updateCashSummaryPanel() {
    const panel = document.querySelector('.cash-summary-panel');
    const entriesTable = document.getElementById('cash-entries-table');
    if (!panel) return;

    const { data: openCash, error: cashError } = await supabase
        .from('cash_registers')
        .select('id')
        .eq('status', 'open')
        .eq('store_id', getSelectedStoreId())
        .order('opened_at', { ascending: false })
        .limit(1);

    if (cashError || !openCash || openCash.length === 0) {
        panel.innerHTML = '<div class="stat-card"><h4><i class="payment-icon saldo-total-icon"></i> Saldo Total</h4><p>R$ 0,00</p></div>';
        if (entriesTable) entriesTable.innerHTML = '<p class="no-movements">Nenhuma movimentação registrada.</p>';
        return;
    }
    const cashId = openCash[0].id;

    const { data: entries, error: entriesError } = await supabase
        .from('cash_register_entries')
        .select('id, created_at, type, amount, payment_method, description, sale_id')
        .eq('cash_register_id', cashId)
        .order('created_at', { ascending: false });

    if (entriesError) {
        panel.innerHTML = '<div class="stat-card"><h4><i class="payment-icon saldo-total-icon"></i> Saldo Total</h4><p>R$ 0,00</p></div>';
        if (entriesTable) entriesTable.innerHTML = '<p class="no-movements">Nenhuma movimentação registrada.</p>';
        return;
    }

    let dinheiro = 0, credito = 0, debito = 0, pix = 0, total = 0;
    entries.forEach(e => {
        if (e.payment_method === 'dinheiro') dinheiro += e.amount;
        else if (e.payment_method === 'credito') credito += e.amount;
        else if (e.payment_method === 'debito') debito += e.amount;
        else if (e.payment_method === 'pix') pix += e.amount;
        total += e.amount;
    });

    panel.innerHTML = `
        <div class="stat-card"><h4><i class="payment-icon money-icon"></i> Dinheiro</h4><p>R$ ${formatCurrencyBR(dinheiro)}</p></div>
        <div class="stat-card"><h4><i class="payment-icon credit-icon"></i> Cartão Crédito</h4><p>R$ ${formatCurrencyBR(credito)}</p></div>
        <div class="stat-card"><h4><i class="payment-icon debit-icon"></i> Cartão Débito</h4><p>R$ ${formatCurrencyBR(debito)}</p></div>
        <div class="stat-card"><h4><i class="payment-icon pix-icon"></i> PIX</h4><p>R$ ${formatCurrencyBR(pix)}</p></div>
        <div class="stat-card total"><h4><i class="payment-icon saldo-total-icon"></i> Saldo Total</h4><p>R$ ${formatCurrencyBR(total)}</p></div>
    `;
    
    const groupedEntries = groupCashEntries(entries);
    renderCashMovements(groupedEntries, 'Todas as Movimentações');
}

function groupCashEntries(entries) {
    const grouped = {};

    const getBaseDescription = (desc) => {
        if (!desc) return '';
        // Remove parênteses com a forma de pagamento no final da descrição.
        // Ex: "Entrega OS #24 (Cartão de Crédito)" vira "Entrega OS #24"
        return desc.replace(/\s\((Cartão de Crédito|Cartão de Débito|Dinheiro|PIX|Crédito|Débito)\)$/i, '').trim();
    };

    entries.forEach(entry => {
        let key;
        const baseDesc = getBaseDescription(entry.description);
        const descriptionIsNotEmpty = baseDesc && baseDesc.trim() !== '';

        if (entry.sale_id) {
            key = `sale_${entry.sale_id}`;
        } else if (descriptionIsNotEmpty) {
            // Se não houver sale_id, agrupa pela descrição base e por um intervalo de tempo de 2 segundos.
            // Isso junta pagamentos da mesma OS que foram registrados em sequência.
            const time = new Date(entry.created_at).getTime();
            const timeWindow = Math.floor(time / 2000);
            key = `manual_${baseDesc}_${timeWindow}`;
        } else {
            // Se tudo falhar, trata como entrada única para não agrupar indevidamente.
            key = `unique_${entry.id}`;
        }

        if (!grouped[key]) {
            grouped[key] = {
                isSale: !!entry.sale_id || descriptionIsNotEmpty,
                sale_id: entry.sale_id,
                entry_ids: [],
                created_at: entry.created_at,
                type: entry.type,
                amount: 0,
                payment_methods: new Set(),
                description: baseDesc || entry.description, // Usa a descrição base para o grupo
            };
        }

        grouped[key].entry_ids.push(entry.id);
        grouped[key].amount += entry.amount;
        if (entry.payment_method) {
            // Capitaliza a primeira letra para ficar mais bonito
            const formattedMethod = entry.payment_method.charAt(0).toUpperCase() + entry.payment_method.slice(1);
            grouped[key].payment_methods.add(formattedMethod);
        }
    });

    return Object.values(grouped).map(group => {
        // Junta os métodos de pagamento em uma string única
        group.payment_method = [...group.payment_methods].join(', ') || 'N/A';
        return group;
    }).sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
}

function renderCashMovements(groupedEntries, title = 'Todas as Movimentações') {
    const container = document.getElementById('cash-entries-table');
    if (!container) return;
    const html = renderCashMovementsHtml(groupedEntries, title);
    container.innerHTML = html;
    document.querySelectorAll('.btn-delete-cash-entry').forEach(button => {
        button.addEventListener('click', handleDeleteCashEntryClick);
    });
}

async function handleDeleteCashEntryClick(event) {
    const button = event.currentTarget;
    const entryIdsJson = button.getAttribute('data-entry-ids');
    const isSale = button.getAttribute('data-is-sale') === 'true';
    if (!entryIdsJson) return;
    const entryIds = JSON.parse(entryIdsJson);
    const confirmationText = isSale 
        ? 'Você tem certeza que deseja excluir esta venda do caixa? A venda em si não será apagada, apenas os lançamentos financeiros.'
        : 'Você tem certeza que deseja excluir esta movimentação do caixa?';
    if (confirm(confirmationText)) {
        try {
            const { error } = await dbDelete('cash_register_entries', { in: { id: entryIds } });
            if (error) throw error;
            showToast('Movimentação excluída com sucesso!', 'success');
            await updateCashSummaryPanel();
        } catch (error) {
            console.error('Erro ao excluir movimentação do caixa:', error);
            showToast(`Erro ao excluir: ${error.message}`, 'error');
        }
    }
}

function renderCashMovementsHtml(groupedEntries, title = 'Todas as Movimentações') {
    if (!groupedEntries || groupedEntries.length === 0) {
        return `<h3>${title}</h3><p class="no-movements">Nenhuma movimentação registrada.</p>`;
    }
    let tableHtml = `
        <h3>${title}</h3>
        <table class="cash-table-movements">
            <thead>
                <tr>
                    <th>Data/Hora</th>
                    <th>Descrição</th>
                    <th>Tipo</th>
                    <th>Formas de Pagamento</th>
                    <th>Valor Total</th>
                    <th>Ações</th>
                </tr>
            </thead>
            <tbody>`;
    groupedEntries.forEach(entry => {
        const entryDate = new Date(entry.created_at);
        const formattedDate = `${entryDate.toLocaleDateString('pt-BR')} ${entryDate.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}`;
        const amountClass = entry.type === 'entrada' ? 'cash-entry-entrada' : 'cash-entry-saida';
        const typeText = entry.type.charAt(0).toUpperCase() + entry.type.slice(1);
        const entryIdsJson = JSON.stringify(entry.entry_ids);
        tableHtml += `
            <tr>
                <td data-label="Data">${formattedDate}</td>
                <td data-label="Descrição">${entry.description || 'N/A'}</td>
                <td data-label="Tipo">${typeText}</td>
                <td data-label="Forma Pag.">${entry.payment_method}</td>
                <td data-label="Valor" class="${amountClass}">R$ ${formatCurrencyBR(entry.amount)}</td>
                <td data-label="Ações">
                    <button class="btn-icon btn-delete-cash-entry" 
                            title="Excluir lançamento do caixa"
                            data-entry-ids='${entryIdsJson}'
                            data-is-sale="${entry.isSale}">
                        <span class="icon">🗑️</span>
                    </button>
                </td>
            </tr>`;
    });
    tableHtml += `
            </tbody>
        </table>`;
    return tableHtml;
}

// Definição única e correta:
async function initializeCashRegisterModule() {
    // Exibe a tela correta conforme o status do caixa
    const closedView = document.getElementById('cash-closed-view');
    const openView = document.getElementById('cash-open-view');
    const historyPanel = document.getElementById('cash-history-list');
    // Indicador inicial de carregamento do histórico de caixas
    if (historyPanel) historyPanel.innerHTML = '<p>Carregando histórico de caixas...</p>';

    // Configurar filtros da tabela de movimentações
    setupCashMovementsFilter();

    // Configurar eventos de fechamento de caixa
    setupCloseCashRegister();

    // Verifica no Supabase se há caixa aberto
    const { data: openCash, error } = await supabase
        .from('cash_registers')
        .select('id')
        .eq('status', 'open')
        .eq('store_id', getSelectedStoreId())
        .order('opened_at', { ascending: false })
        .limit(1);
    if (error) {
    if (closedView) closedView.style.display = 'block';
    if (openView) openView.style.display = 'none';
        return;
    }
    if (openCash && openCash.length > 0) {
        // Caixa já está aberto
            if (closedView) closedView.style.display = 'none';
            if (openView) openView.style.display = 'block';
            updateCashSummaryPanel();
    } else {
        // Caixa fechado
        if (closedView) closedView.style.display = 'block';
        if (openView) openView.style.display = 'none';
    }
    // Carrega o histórico de caixas fechados sempre que o módulo for inicializado
    if (historyPanel) {
        await loadClosedCashHistory();
    }
}

// Função global para inicializar o módulo de estoque
function initializeStockModule() {
    // Flag para garantir que o módulo seja inicializado apenas uma vez
    if (initializeStockModule.hasBeenInitialized) {
        return;
    }
    initializeStockModule.hasBeenInitialized = true;

    loadCategories();
    loadProducts();
    setupStockEvents();
    
    // Eventos de filtro
    const searchInput = document.getElementById('stock-search-name');
    const categorySelect = document.getElementById('stock-filter-category');
    if (searchInput) searchInput.addEventListener('input', loadProducts);
    if (categorySelect) categorySelect.addEventListener('change', loadProducts);
}

// Configurar eventos do módulo de estoque
function setupStockEvents() {
    const btnNewProduct = document.getElementById('btn-new-product');
    const btnCancelNewProduct = document.getElementById('btn-cancel-new-product');
    const btnNewCategory = document.getElementById('btn-new-category');
    const newProductForm = document.getElementById('new-product-form');
    const newProductContainer = document.getElementById('new-product-form-container');

    // Configurar formatação de valores nos campos de preço
    setupProductValueFormatting();

    // Botão para mostrar formulário de novo produto
    if (btnNewProduct) {
        btnNewProduct.addEventListener('click', async () => {
            if (newProductContainer) {
                newProductContainer.style.display = 'block';
                document.getElementById('product-form-title').textContent = 'Adicionar Novo Produto';
                document.getElementById('product-edit-id').value = '';
                newProductForm.reset();
                
                // Configurar campo de preço de custo baseado nas permissões
                await setupCostPriceField();
            }
        });
    }

    // Botão para cancelar novo produto
    if (btnCancelNewProduct) {
        btnCancelNewProduct.addEventListener('click', () => {
            if (newProductContainer) {
                newProductContainer.style.display = 'none';
                newProductForm.reset();
            }
        });
    }

    // Botão para nova categoria
    if (btnNewCategory) {
        btnNewCategory.addEventListener('click', async () => {
            const categoryName = prompt('Digite o nome da nova categoria:');
            if (!categoryName || categoryName.trim() === '') return;

            try {
                const { data, error } = await supabase
                    .from('categories')
                    .insert([{ 
                        name: categoryName.trim(),
                        store_id: getSelectedStoreId() 
                    }])
                    .select();

                if (error) throw error;

                await loadCategories();
                document.getElementById('product-category').value = data[0].id;
                showToast(`Categoria "${categoryName}" adicionada com sucesso!`, 'success');
            } catch (error) {
                console.error('Erro ao adicionar categoria:', error);
                showToast('Erro ao adicionar categoria', 'error');
            }
        });
    }

    // Formulário de novo/editar produto
    if (newProductForm) {
        let isSubmitting = false; // Prevenir duplo submit
        
        newProductForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            if (isSubmitting) return; // Evitar duplo submit
            isSubmitting = true;
            
            const submitBtn = e.target.querySelector('button[type="submit"]');
            const originalText = submitBtn.textContent;
            submitBtn.disabled = true;
            submitBtn.textContent = 'Salvando...';

            try {
                const productId = document.getElementById('product-edit-id')?.value || '';
                // Função para converter valor formatado para número
                const parseFormattedValue = (value) => {
                    if (!value) return 0;
                    return parseFloat(value.replace(/\./g, '').replace(',', '.')) || 0;
                };

                // Verificar permissões de custo antes de salvar
                const canManageCost = await canViewCostPrices();
                
                const productData = {
                    name: document.getElementById('product-name')?.value?.trim() || '',
                    category_id: document.getElementById('product-category')?.value || null,
                    price: parseFormattedValue(document.getElementById('product-sell-price')?.value || ''),
                    stock: parseInt(document.getElementById('product-stock')?.value || '0') || 0,
                    track_stock: document.getElementById('product-track-stock').checked,
                    store_id: getSelectedStoreId() || 1
                };
                
                // Incluir cost_price apenas se o usuário tiver permissão
                if (canManageCost) {
                    productData.cost_price = parseFormattedValue(document.getElementById('product-cost-price')?.value || '');
                }

                // Verificar se store_id está definido
                if (!getSelectedStoreId()) {
                    showToast('Erro: Loja não selecionada', 'error');
                    return;
                }

                // Validações
                if (!productData.name) {
                    showToast('Nome do produto é obrigatório', 'error');
                    return;
                }

                if (!productData.price || productData.price <= 0) {
                    showToast('Valor de venda deve ser maior que zero', 'error');
                    return;
                }

                // Verificar se já existe produto com mesmo nome (apenas para novos produtos)
                if (!productId) {
                    const { data: existingProduct, error: checkError } = await supabase
                        .from('products')
                        .select('id')
                        .eq('name', productData.name)
                        .eq('store_id', getSelectedStoreId())
                        .single();

                    if (checkError && checkError.code !== 'PGRST116') {
                        throw checkError;
                    }

                    if (existingProduct) {
                        showToast('Já existe um produto com este nome', 'error');
                        return;
                    }
                }

                let result;
                if (productId) {
                    // Editar produto existente
                    result = await supabase
                        .from('products')
                        .update(productData)
                        .eq('id', productId);
                } else {
                    // Criar novo produto
                    result = await supabase
                        .from('products')
                        .insert([productData]);
                }

                if (result.error) throw result.error;

                showToast(productId ? 'Produto atualizado com sucesso!' : 'Produto adicionado com sucesso!', 'success');
                
                // Limpar e esconder formulário
                newProductForm.reset();
                if (newProductContainer) {
                    newProductContainer.style.display = 'none';
                }
                
                // Recarregar lista de produtos
                await loadProducts();

            } catch (error) {
                console.error('Erro ao salvar produto:', error);
                showToast('Erro ao salvar produto: ' + (error.message || error), 'error');
            } finally {
                submitBtn.disabled = false;
                submitBtn.textContent = originalText;
                isSubmitting = false; // Liberar para próximo submit
            }
        });
    }
}

async function loadCategories() {
    const categorySelect = document.getElementById('stock-filter-category');
    const productCategorySelect = document.getElementById('product-category');
    if (!categorySelect && !productCategorySelect) return;
    try {
        const { data: categories, error } = await dbSelect('categories', {
            select: '*',
            order: { column: 'name', ascending: true },
            or: getSelectedStoreId() ? `store_id.eq.${getSelectedStoreId()},store_id.is.null` : undefined
        });
        if (error) throw error;
        
        if (categorySelect) {
            categorySelect.innerHTML = '<option value="">Todas</option>';
            categories.forEach(cat => {
                categorySelect.innerHTML += `<option value="${cat.id}">${cat.name}</option>`;
            });
        }
        if (productCategorySelect) {
            productCategorySelect.innerHTML = '<option value="">Selecione</option>';
            categories.forEach(cat => {
                productCategorySelect.innerHTML += `<option value="${cat.id}">${cat.name}</option>`;
            });
        }
    } catch (err) {
        console.error('Erro ao carregar categorias:', err);
    }
}

async function loadProducts() {
    const tbody = document.getElementById('products-table-body');
    const searchInput = document.getElementById('stock-search-name');
    const categorySelect = document.getElementById('stock-filter-category');
    if (!tbody) return;
    tbody.innerHTML = '<tr><td colspan="6">Carregando...</td></tr>';
    try {
        // Verificar permissões de custo
        const canViewCost = await canViewCostPrices();
        
        const options = {
            select: '*, categories(name)',
            eq: { store_id: getSelectedStoreId() },
            order: { column: 'created_at', ascending: false }
        };
        
        if (searchInput && searchInput.value) {
            options.ilike = { name: `%${searchInput.value}%` };
        }
        if (categorySelect && categorySelect.value) {
            options.eq.category_id = categorySelect.value;
        }
        
        const { data: products, error } = await dbSelect('products', options);
        if (error) throw error;
        if (!products || products.length === 0) {
            tbody.innerHTML = '<tr><td colspan="6">Nenhum produto encontrado.</td></tr>';
            return;
        }
        tbody.innerHTML = '';
        
        for (const prod of products) {
            const row = document.createElement('tr');
            
            // Função para formatar valores monetários
            const formatCurrency = (value) => {
                if (!value && value !== 0) return '-';
                return new Intl.NumberFormat('pt-BR', {
                    style: 'currency',
                    currency: 'BRL'
                }).format(value);
            };
            
            // Formatar preço de custo baseado nas permissões
            const costPriceDisplay = canViewCost ? formatCurrency(prod.cost_price) : '***';
            
            row.innerHTML = `
                <td>${prod.name}</td>
                <td>${prod.categories ? prod.categories.name : '-'}</td>
                <td>${costPriceDisplay}</td>
                <td>${formatCurrency(prod.price)}</td>
                <td>${prod.stock ?? '-'}</td>
                <td>
                    <button class="action-btn edit" onclick="window.editProduct(${prod.id})" title="Editar">✏️</button>
                    <button class="action-btn delete" onclick="window.deleteProduct(${prod.id})" title="Excluir">🗑️</button>
                </td>
            `;
            tbody.appendChild(row);
        }
    } catch (err) {
        console.error('Erro ao carregar produtos:', err);
        tbody.innerHTML = `<tr><td colspan="6">Erro ao carregar produtos.</td></tr>`;
    }
}

// Função para configurar formatação de valores nos campos de produto
function setupProductValueFormatting() {
    const costPriceField = document.getElementById('product-cost-price');
    const sellPriceField = document.getElementById('product-sell-price');
    
    [costPriceField, sellPriceField].forEach(field => {
        if (!field) return;
        
        field.addEventListener('input', (e) => {
            let value = e.target.value.replace(/\D/g, '');
            if (value) {
                value = (parseInt(value) / 100).toFixed(2);
                value = value.replace('.', ',');
                value = value.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
                e.target.value = value;
            }
        });
        
        field.addEventListener('focus', (e) => {
            if (e.target.value === '0,00') {
                e.target.value = '';
            }
        });
        
        field.addEventListener('blur', (e) => {
            if (!e.target.value) {
                e.target.value = '0,00';
            }
        });
    });
}

// Função para configurar campo de preço de custo baseado nas permissões
async function setupCostPriceField() {
    const costPriceField = document.getElementById('product-cost-price');
    if (!costPriceField) return;
    
    try {
        const canManageCost = await canViewCostPrices();
        
        if (canManageCost) {
            costPriceField.disabled = false;
            costPriceField.placeholder = 'Digite o preço de custo';
            costPriceField.value = '0,00';
        } else {
            costPriceField.disabled = true;
            costPriceField.placeholder = 'Sem permissão para gerenciar preços de custo';
            costPriceField.value = '***';
        }
    } catch (error) {
        console.error('Erro ao verificar permissões de custo:', error);
        // Em caso de erro, desabilitar o campo por segurança
        costPriceField.disabled = true;
        costPriceField.placeholder = 'Erro ao verificar permissões';
        costPriceField.value = '***';
    }
}

// Função global para editar produto
window.editProduct = async function(productId) {
    try {
        // Verificar permissões de custo
        const canViewCost = await canViewCostPrices();
        
        const { data: product, error } = await supabase
            .from('products')
            .select('*')
            .eq('id', productId)
            .single();

        if (error || !product) {
            showToast('Erro ao carregar dados do produto', 'error');
            return;
        }

        // Mostrar formulário de edição
        const newProductContainer = document.getElementById('new-product-form-container');
        const newProductForm = document.getElementById('new-product-form');
        
        if (newProductContainer && newProductForm) {
            newProductContainer.style.display = 'block';
            document.getElementById('product-form-title').textContent = 'Editar Produto';
            
            // Preencher campos com dados do produto
            if (document.getElementById('product-edit-id')) {
                document.getElementById('product-edit-id').value = product.id;
            }
            if (document.getElementById('product-name')) {
                document.getElementById('product-name').value = product.name;
            }
            if (document.getElementById('product-category')) {
                document.getElementById('product-category').value = product.category_id || '';
            }
            
            // Formatar valores monetários para exibição
            const formatValueForDisplay = (value) => {
                if (!value && value !== 0) return '';
                return value.toFixed(2).replace('.', ',').replace(/\B(?=(\d{3})+(?!\d))/g, '.');
            };
            
            // Configurar campo de preço de custo baseado nas permissões
            await setupCostPriceField();
            
            // Se o usuário tiver permissão, preencher com o valor atual
            const costPriceField = document.getElementById('product-cost-price');
            if (costPriceField && canViewCost) {
                costPriceField.value = formatValueForDisplay(product.cost_price);
            }
            
            if (document.getElementById('product-sell-price')) {
                document.getElementById('product-sell-price').value = formatValueForDisplay(product.price);
            }
            if (document.getElementById('product-stock')) {
                document.getElementById('product-stock').value = product.stock || '';
            }
            document.getElementById('product-track-stock').checked = product.track_stock !== false;
        }

    } catch (error) {
        console.error('Erro ao editar produto:', error);
        showToast('Erro ao carregar produto para edição', 'error');
    }
};

// Função global para excluir produto
window.deleteProduct = async function(productId) {
    try {
        const { data: product, error: fetchError } = await supabase
            .from('products')
            .select('name')
            .eq('id', productId)
            .single();

        if (fetchError || !product) {
            showToast('Erro ao carregar dados do produto', 'error');
            return;
        }

        const confirmDelete = confirm(`Tem certeza que deseja excluir o produto "${product.name}"?\n\nEsta ação não pode ser desfeita.`);
        
        if (!confirmDelete) return;

        const { error } = await supabase
            .from('products')
            .delete()
            .eq('id', productId);

        if (error) throw error;

        showToast('Produto excluído com sucesso!', 'success');
        await loadProducts();

    } catch (error) {
        console.error('Erro ao excluir produto:', error);
        showToast('Erro ao excluir produto: ' + (error.message || error), 'error');
    }
};

// Função global para inicializar o módulo de relatórios (placeholder)
function initializeReportsModule() {
    // Implemente a lógica real se desejar
}

function showToast(message, type = 'success') {
    let toast = document.getElementById('toast-notification');
    let toastMsg = document.getElementById('toast-message');
    if (!toast || !toastMsg) {
        toast = document.createElement('div');
        toast.id = 'toast-notification';
        toast.className = 'toast';
        toastMsg = document.createElement('span');
        toastMsg.id = 'toast-message';
        toast.appendChild(toastMsg);
        document.body.appendChild(toast);
    }
    toastMsg.textContent = message;
    toast.className = 'toast show ' + (type === 'error' ? 'error' : 'success');
    setTimeout(() => {
        toast.classList.remove('show');
    }, 3500);
}

function checkCashRegisterStatus() {
    // Placeholder: implemente a lógica real se desejar
    console.log('checkCashRegisterStatus chamada!');
}

// ========================= AUTOCOMPLETE PRODUTOS PDV =========================
function initializePDVProductAutocomplete() {
    const searchInput = document.getElementById('pdv-product-search');
    const resultsDiv = document.getElementById('pdv-product-results');
    if (!searchInput || !resultsDiv || !cartBody) return;

    let productsCache = [];
    // REMOVIDO: let cart = [];

    // Função para buscar produtos no Supabase
    async function searchProducts(query) {
        if (!query || query.length < 2) {
            resultsDiv.innerHTML = '';
            return;
        }
        resultsDiv.innerHTML = '<div class="autocomplete-loading">Buscando...</div>';
        const { data: products, error } = await supabase
            .from('products')
            .select('id, name, price, stock, track_stock')
            .eq('store_id', getSelectedStoreId())
            .ilike('name', `%${query}%`)
            .order('name', { ascending: true });
        if (error || !products || products.length === 0) {
            resultsDiv.innerHTML = '<div class="autocomplete-empty">Nenhum produto encontrado.</div>';
            return;
        }
        productsCache = products;
        resultsDiv.innerHTML = products.map(prod =>
            `<div class="autocomplete-item" data-id="${prod.id}">
                <strong>${prod.name}</strong> <span style="float:right">R$ ${prod.price?.toFixed(2) || '-'}</span><br>
                <small>Estoque: ${prod.track_stock ? (prod.stock ?? 0) : '∞ (Sem controle)'}</small>
            </div>`
        ).join('');
    }

    // Adiciona produto ao carrinho
    function addToCart(productId) {
        const prod = productsCache.find(p => String(p.id) === String(productId));
        if (!prod) return;
        
        // Verificar estoque apenas se o produto controla estoque
        if (prod.track_stock && prod.stock <= 0) {
            showToast(`Produto "${prod.name}" não possui estoque disponível!`, 'error');
            return;
        }
        
        const existing = cart.find(item => String(item.id) === String(prod.id));
        if (existing) {
            // Verificar estoque na adição de mais unidades
            if (prod.track_stock && (existing.qty + 1) > prod.stock) {
                showToast(`Estoque insuficiente para "${prod.name}". Disponível: ${prod.stock}`, 'error');
                return;
            }
            existing.qty += 1;
        } else {
            cart.push({ ...prod, qty: 1 });
        }
        renderCart();
        resultsDiv.innerHTML = '';
        searchInput.value = '';
    }

    // REMOVIDO: função updatePDVSummary local

    // Eventos
    searchInput.addEventListener('input', (e) => {
        searchProducts(e.target.value);
    });
    resultsDiv.addEventListener('click', (e) => {
        const item = e.target.closest('.autocomplete-item');
        if (item) {
            addToCart(item.dataset.id);
        }
    });
    cartBody.addEventListener('click', (e) => {
        if (e.target.classList.contains('btn-qty')) {
            const id = e.target.dataset.id;
            const action = e.target.dataset.action;
            const item = cart.find(i => i.id == id);
            if (item) {
                if (action === 'inc') {
                    // Verificar estoque antes de incrementar
                    if (item.track_stock && (item.qty + 1) > item.stock) {
                        showToast(`Estoque insuficiente para "${item.name}". Disponível: ${item.stock}`, 'error');
                        return;
                    }
                    item.qty++;
                }
                if (action === 'dec' && item.qty > 1) item.qty--;
                renderCart();
            }
        } else if (e.target.classList.contains('btn-remove')) {
            const id = e.target.dataset.id;
            cart = cart.filter(i => i.id != id);
            renderCart();
        }
    });
    cartBody.addEventListener('change', (e) => {
        if (e.target.classList.contains('cart-qty-input')) {
            const id = e.target.dataset.id;
            const item = cart.find(i => i.id == id);
            let val = parseInt(e.target.value);
            if (item && val > 0) {
                // Verificar estoque antes de alterar quantidade
                if (item.track_stock && val > item.stock) {
                    showToast(`Estoque insuficiente para "${item.name}". Disponível: ${item.stock}`, 'error');
                    e.target.value = item.qty; // Restaurar valor anterior
                    return;
                }
                item.qty = val;
                renderCart();
            }
        } else if (e.target.classList.contains('cart-price-input')) {
            const id = e.target.dataset.id;
            const item = cart.find(i => i.id == id);
            let val = parseFloat(e.target.value);
            if (item && val > 0) {
                item.price = val;
                renderCart();
            }
        }
    });
    document.getElementById('pdv-summary-discount').addEventListener('input', updatePDVSummary);
    // Limpa carrinho ao finalizar venda
    const btnFinalize = document.getElementById('pdv-finalize-sale');
    if (btnFinalize) {
        btnFinalize.addEventListener('click', () => {
            cart = [];
            renderCart();
        });
    }
}

// Inicializar autocomplete do PDV ao carregar o módulo
initializePDVProductAutocomplete();

// ========== ABERTURA DE CAIXA ==========
function setupOpenCashRegister() {
    const btnOpen = document.getElementById('btn-open-cash-register');
    const openCashModal = document.getElementById('open-cash-modal');
    const openCashForm = document.getElementById('open-cash-form');
    if (!btnOpen || !openCashModal || !openCashForm) return;

    btnOpen.onclick = () => {
        openCashModal.style.display = 'block';
        openCashForm.reset();
        openCashForm.querySelector('input').focus();
    };

    openCashForm.onsubmit = async (e) => {
        e.preventDefault();
        const openingBalance = parseFloat(document.getElementById('opening-balance')?.value || '0') || 0;
        btnOpen.disabled = true;
        try {
            const user = getCurrentUser();
            const { error } = await dbInsert('cash_registers', {
                status: 'open',
                opened_at: new Date().toISOString(),
                opening_balance: openingBalance,
                opened_by_user_id: getCurrentUser()?.id || null,
                store_id: getSelectedStoreId()
            });
            if (error) throw error;
            openCashModal.style.display = 'none';
            showToast('Caixa aberto com sucesso!');
            await initializeCashRegisterModule();
        } catch (err) {
            showToast('Erro ao abrir caixa: ' + (err.message || err), 'error');
        } finally {
            btnOpen.disabled = false;
        }
    };
}

// Função já chamada no initializeDashboard, não precisa ser chamada novamente aqui

// ========== PAGAMENTO DIVIDIDO NO PDV ==========
function setupPDVSplitPayment() {
    let btnFinish = document.getElementById('pdv-finish-btn');
    const splitModal = document.getElementById('pdv-split-modal');
    const splitForm = document.getElementById('pdv-split-form');
    const totalSpan = document.getElementById('pdv-split-total');
    if (!btnFinish || !splitModal || !splitForm || !totalSpan) return;

    // Substitui o botão por um clone para remover todos os eventos antigos
    const btnClone = btnFinish.cloneNode(true);
    btnFinish.parentNode.replaceChild(btnClone, btnFinish);
    btnFinish = btnClone; // ATUALIZA A REFERÊNCIA

    // Definir os campos de pagamento
    const dinheiro = document.getElementById('split-dinheiro');
    const credito = document.getElementById('split-credito');
    const debito = document.getElementById('split-debito');
    const pix = document.getElementById('split-pix');
    
    // Função para preencher apenas um campo com o valor total
    function preencherCampo(campo) {
        if (!campo) return;
        
        const subtotal = cart.reduce((sum, item) => sum + item.price * item.qty, 0);
        campo.value = subtotal.toFixed(2);
        console.log('Campo preenchido:', campo.id);
        
        // Remover todos os event listeners para evitar preenchimento adicional
        removerListeners();
    }
    
    // Função para remover todos os listeners
    function removerListeners() {
        if (dinheiro) {
            dinheiro.removeEventListener('click', handleDinheiro);
            dinheiro.removeEventListener('focus', handleDinheiro);
        }
        if (credito) {
            credito.removeEventListener('click', handleCredito);
            credito.removeEventListener('focus', handleCredito);
        }
        if (debito) {
            debito.removeEventListener('click', handleDebito);
            debito.removeEventListener('focus', handleDebito);
        }
        if (pix) {
            pix.removeEventListener('click', handlePix);
            pix.removeEventListener('focus', handlePix);
        }
    }
    
    // Handlers específicos para cada campo
    function handleDinheiro() { preencherCampo(dinheiro); }
    function handleCredito() { preencherCampo(credito); }
    function handleDebito() { preencherCampo(debito); }
    function handlePix() { preencherCampo(pix); }
    
    // Função para configurar os listeners
    function configurarListeners() {
        removerListeners(); // Primeiro remover todos os listeners existentes
        
        // Adicionar novos listeners
        if (dinheiro) {
            dinheiro.addEventListener('click', handleDinheiro);
            dinheiro.addEventListener('focus', handleDinheiro);
        }
        if (credito) {
            credito.addEventListener('click', handleCredito);
            credito.addEventListener('focus', handleCredito);
        }
        if (debito) {
            debito.addEventListener('click', handleDebito);
            debito.addEventListener('focus', handleDebito);
        }
        if (pix) {
            pix.addEventListener('click', handlePix);
            pix.addEventListener('focus', handlePix);
        }
    }

    // Função que será chamada quando o botão de finalizar venda for clicado
    btnFinish.onclick = () => {
        console.log('Clique no botão Finalizar Venda!'); // LOG DE DEPURAÇÃO
        const subtotal = cart.reduce((sum, item) => sum + item.price * item.qty, 0);
        totalSpan.textContent = `R$ ${subtotal.toFixed(2)}`;
        splitForm.reset();
        splitModal.style.display = 'block';
        
        // Configurar os listeners novamente
        configurarListeners();
    };

    // Configurar o formulário para validação e envio
    splitForm.onsubmit = async (e) => {
        e.preventDefault();
        console.log('Submit do modal de pagamento dividido!'); // LOG DE DEPURAÇÃO
        const dinheiroValue = parseFloat(dinheiro?.value || '0') || 0;
        const creditoValue = parseFloat(credito?.value || '0') || 0;
        const debitoValue = parseFloat(debito?.value || '0') || 0;
        const pixValue = parseFloat(pix?.value || '0') || 0;
        const subtotal = cart.reduce((sum, item) => sum + item.price * item.qty, 0);
        const soma = dinheiroValue + creditoValue + debitoValue + pixValue;
        if (Math.abs(soma - subtotal) > 0.01) {
            alert('A soma dos pagamentos deve ser igual ao total da venda!');
            return;
        }
        // Processar a venda para cada método de pagamento
        const pagamentos = [];
        if (dinheiroValue > 0) pagamentos.push({ metodo: 'dinheiro', valor: dinheiroValue });
        if (creditoValue > 0) pagamentos.push({ metodo: 'credito', valor: creditoValue });
        if (debitoValue > 0) pagamentos.push({ metodo: 'debito', valor: debitoValue });
        if (pixValue > 0) pagamentos.push({ metodo: 'pix', valor: pixValue });
        await finalizarVendaComPagamentos(pagamentos);
        splitModal.style.display = 'none';
    };
    
    // Configurar listeners na inicialização
    configurarListeners();
}

// Reforçar a chamada de setupPDVSplitPayment após renderCart
const originalRenderCart = renderCart;
renderCart = function() {
    originalRenderCart();
    setupPDVSplitPayment(); // Garante que o evento do botão sempre será reatribuído
}

// Função para registrar a venda e as movimentações do caixa com múltiplos pagamentos
async function finalizarVendaComPagamentos(pagamentos) {
    // Obter o caixa aberto
    const { data: openCash, error: cashError } = await supabase
        .from('cash_registers')
        .select('id')
        .eq('status', 'open')
        .eq('store_id', getSelectedStoreId())
        .order('opened_at', { ascending: false })
        .limit(1);
    if (cashError || !openCash || openCash.length === 0) {
        alert('Nenhum caixa aberto!');
        return;
    }
    const cashRegisterId = openCash[0].id;
    // Salvar a venda
    const subtotal = cart.reduce((sum, item) => sum + item.price * item.qty, 0);
    const items = cart.map(item => ({ id: item.id, name: item.name, price: item.price, qty: item.qty }));
    const paymentMethods = pagamentos.map(p => p.metodo).join(', ');
    const { data: sale, error: saleError } = await supabase
        .from('sales')
        .insert([{ items, total: subtotal, payment_method: paymentMethods,             user_id: getCurrentUser()?.id || null, store_id: getSelectedStoreId() || null }])
        .select('id')
        .single();
    if (saleError) {
        alert('Erro ao registrar venda!');
        return;
    }
    // Registrar uma linha por método de pagamento (para o caixa e os totais ficarem certos)
    for (const p of pagamentos) {
        await dbInsert('cash_register_entries', {
            cash_register_id: cashRegisterId,
            sale_id: sale.id,
            type: 'entrada',
            amount: p.valor,
            payment_method: p.metodo,
            description: 'Venda PDV',
            user_id: getCurrentUser()?.id || null
        });
    }
    // Limpar carrinho e atualizar painel
    cart = [];
    renderCart();
    updatePDVSummary();
    updateCashSummaryPanel();
    alert('Venda finalizada com sucesso!');
}

// Removido listener duplicado - setupPDVSplitPayment será chamado no listener principal

// Função global para renderizar o carrinho do PDV
function renderCart() {
    console.log('Carrinho atual:', cart); // DEPURAÇÃO
    if (!cartBody) return;
    if (cart.length === 0) {
        cartBody.innerHTML = '<div class="pdv-cart-item empty">Carrinho vazio</div>';
        updatePDVSummary();
        return;
    }
    cartBody.innerHTML = cart.map(item =>
        `<div class="pdv-cart-item">
            <span>${item.name}</span>
            <span>
                <input type="number" min="1" value="${Number(item.qty) > 0 ? item.qty : 1}" data-id="${item.id}" class="cart-qty-input" style="width:50px;text-align:center;">
            </span>
            <span>
                <input type="number" min="0.01" step="0.01" value="${item.price?.toFixed(2) || ''}" data-id="${item.id}" class="cart-price-input" style="width:70px;text-align:center;">
            </span>
            <span>R$ ${(item.price * item.qty).toFixed(2)}</span>
            <span><button class="btn-remove" data-id="${item.id}">🗑️</button></span>
        </div>`
    ).join('');
    updatePDVSummary();
}

// Função global para atualizar o resumo do PDV
function updatePDVSummary() {
    let subtotal = 0;
    cart.forEach(item => subtotal += item.price * item.qty);
    document.getElementById('pdv-summary-subtotal').textContent = `R$ ${subtotal.toFixed(2)}`;
    const desconto = parseFloat(document.getElementById('pdv-summary-discount')?.value || '0') || 0;
    document.getElementById('pdv-summary-total').textContent = `R$ ${(subtotal - desconto).toFixed(2)}`;
}

// Configurar filtro de movimentações por data
function setupCashMovementsFilter() {
    const btnFilter = document.getElementById('btn-filter-cash');
    const btnReset = document.getElementById('btn-reset-filter');
    const dateInput = document.getElementById('cash-filter-date');
    
    if (!btnFilter || !btnReset || !dateInput) return;
    
    // Define a data de hoje como padrão
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    dateInput.value = `${year}-${month}-${day}`;
    
    // Evento de filtro por data
    btnFilter.addEventListener('click', async () => {
        const filterDate = dateInput.value;
        if (!filterDate) return;
        
        // Busca caixa aberto
        const { data: openCash, error: cashError } = await supabase
            .from('cash_registers')
            .select('id')
            .eq('status', 'open')
            .eq('store_id', getSelectedStoreId())
            .order('opened_at', { ascending: false })
            .limit(1);
        if (cashError || !openCash || openCash.length === 0) return;
        
        const cashId = openCash[0].id;
        const startDate = new Date(filterDate);
        startDate.setHours(0, 0, 0, 0);
        
        const endDate = new Date(filterDate);
        endDate.setHours(23, 59, 59, 999);
        
        // Busca entradas do caixa da data selecionada
        const { data: entries, error: entriesError } = await supabase
            .from('cash_register_entries')
            .select('id, created_at, type, amount, payment_method, description, sale_id')
            .eq('cash_register_id', cashId)
            .gte('created_at', startDate.toISOString())
            .lte('created_at', endDate.toISOString())
            .order('created_at', { ascending: false });
            
        if (entriesError) {
            showToast('Erro ao buscar movimentações', 'error');
            return;
        }
        
        renderCashMovements(entries, `Movimentações: ${startDate.toLocaleDateString('pt-BR')}`);
    });
    
    // Evento para resetar filtro
    btnReset.addEventListener('click', () => {
        dateInput.value = ''; // Limpa o campo de data
        updateCashSummaryPanel(); // Recarrega todas as movimentações
    });
}

// === ADICIONAR/RETIRAR DINHEIRO NO CAIXA ===
function setupCashMoneyOperations() {
    const btnAddMoney = document.getElementById('btn-add-money');
    const btnWithdrawMoney = document.getElementById('btn-withdraw-money');
    const moneyEntryModal = document.getElementById('money-entry-modal');
    const moneyEntryForm = document.getElementById('money-entry-form');
    const moneyEntryTitle = document.getElementById('money-entry-title');
    const moneyEntryType = document.getElementById('money-entry-type');
    const moneyEntryAmount = document.getElementById('money-entry-amount');
    const moneyEntryDescription = document.getElementById('money-entry-description');

    if (btnAddMoney) {
        btnAddMoney.onclick = () => {
            moneyEntryTitle.textContent = 'Adicionar Dinheiro';
            moneyEntryType.value = 'entrada';
            moneyEntryAmount.value = '';
            moneyEntryDescription.value = '';
            moneyEntryModal.style.display = 'flex';
        };
    }
    if (btnWithdrawMoney) {
        btnWithdrawMoney.onclick = () => {
            moneyEntryTitle.textContent = 'Retirar Dinheiro';
            moneyEntryType.value = 'saida';
            moneyEntryAmount.value = '';
            moneyEntryDescription.value = '';
            moneyEntryModal.style.display = 'flex';
        };
    }
    if (moneyEntryForm) {
        moneyEntryForm.onsubmit = async (e) => {
            e.preventDefault();
            const tipo = moneyEntryType.value;
            const valor = parseFloat(moneyEntryAmount.value);
            const descricao = moneyEntryDescription.value;
            if (!valor || valor <= 0) {
                showToast('Informe um valor válido!', 'error');
                return;
            }
            if (!descricao) {
                showToast('Informe uma descrição!', 'error');
                return;
            }
            // Buscar caixa aberto
            const { data: openCash, error: cashError } = await supabase
                .from('cash_registers')
                .select('id')
                .eq('status', 'open')
                .eq('store_id', getSelectedStoreId())
                .order('opened_at', { ascending: false })
                .limit(1);
            if (cashError || !openCash || openCash.length === 0) {
                showToast('Nenhum caixa aberto encontrado!', 'error');
                return;
            }
            const cashId = openCash[0].id;
            // Inserir movimentação
            const { error: entryError } = await supabase.from('cash_register_entries').insert({
                cash_register_id: cashId,
                type: tipo,
                amount: tipo === 'saida' ? -Math.abs(valor) : Math.abs(valor),
                payment_method: 'dinheiro', // padrão para entrada/saída manual
                description: descricao,
                created_at: new Date().toISOString()
            });
            if (entryError) {
                showToast('Erro ao registrar movimentação: ' + entryError.message, 'error');
                return;
            }
            showToast('Movimentação registrada com sucesso!', 'success');
            moneyEntryModal.style.display = 'none';
            updateCashSummaryPanel();
        };
    }
}

// Função será chamada no listener principal

// === FECHAR CAIXA ===
function setupCloseCashRegister() {
    const btnCloseCash = document.getElementById('btn-close-cash-register');
    const closeCashModal = document.getElementById('close-cash-modal');
    const closeCashForm = document.getElementById('close-cash-form');
    const countedBalanceInput = document.getElementById('counted-balance');
    const closingNotesInput = document.getElementById('closing-notes');
    const closeCashSummary = document.getElementById('close-cash-summary');

    if (btnCloseCash && closeCashModal && closeCashForm) {
        btnCloseCash.onclick = async () => {
            // Buscar caixa aberto e mostrar resumo
            const { data: openCash, error } = await supabase
                .from('cash_registers')
                .select('id, opening_balance, opened_at')
                .eq('status', 'open')
                .eq('store_id', getSelectedStoreId())
                .order('opened_at', { ascending: false })
                .limit(1);
            if (error || !openCash || openCash.length === 0) {
                showToast('Nenhum caixa aberto encontrado!', 'error');
                return;
            }
            // Buscar total de entradas e saídas
            const cashId = openCash[0].id;
            const { data: entries, error: entriesError } = await supabase
                .from('cash_register_entries')
                .select('amount')
                .eq('cash_register_id', cashId);
            let total = 0;
            if (!entriesError && entries) {
                total = entries.reduce((sum, e) => sum + (e.amount || 0), 0);
            }
            closeCashSummary.innerHTML = `
                <p><strong>Saldo Inicial:</strong> R$ ${openCash[0].opening_balance?.toFixed(2) || '0,00'}</p>
                <p><strong>Movimentações:</strong> R$ ${(total).toFixed(2)}</p>
                <p><strong>Saldo Esperado:</strong> R$ ${(openCash[0].opening_balance + total).toFixed(2)}</p>
            `;
            countedBalanceInput.value = '';
            closingNotesInput.value = '';
            closeCashModal.style.display = 'flex';
        };

        closeCashForm.onsubmit = async (e) => {
            e.preventDefault();
            const counted = parseFloat(countedBalanceInput.value);
            const notes = closingNotesInput.value;
            // Buscar caixa aberto
            const { data: openCash, error } = await supabase
                .from('cash_registers')
                .select('id, opening_balance, opened_at')
                .eq('status', 'open')
                .eq('store_id', getSelectedStoreId())
                .order('opened_at', { ascending: false })
                .limit(1);
            if (error || !openCash || openCash.length === 0) {
                showToast('Nenhum caixa aberto encontrado!', 'error');
                return;
            }
            const cashId = openCash[0].id;
            // Atualizar status do caixa para fechado
            const { error: closeError } = await supabase
                .from('cash_registers')
                .update({ status: 'closed', closed_at: new Date().toISOString(), notes: notes, closing_balance: counted })
                .eq('id', cashId);
            if (closeError) {
                showToast('Erro ao fechar caixa: ' + closeError.message, 'error');
                return;
            }
            showToast('Caixa fechado com sucesso!', 'success');
            closeCashModal.style.display = 'none';
            await initializeCashRegisterModule();
        };
    }
});

// ... existing code ...
async function loadClosedCashHistory() {
    const historyPanel = document.getElementById('cash-history-list');
    if (!historyPanel) return;
    historyPanel.innerHTML = '<p>Carregando histórico...</p>';

    try {
        const { data: closedCashes, error } = await supabase
            .from('cash_registers')
            .select('id, opened_at, closed_at, opening_balance, closing_balance, notes')
            .eq('status', 'closed')
            .eq('store_id', getSelectedStoreId())
            .order('closed_at', { ascending: false });

        if (error) throw error;

        if (!closedCashes || closedCashes.length === 0) {
            historyPanel.innerHTML = '<p>Nenhum caixa anterior encontrado.</p>';
            return;
        }

        let html = '<ul class="cash-history-items">';
        closedCashes.forEach(cash => {
            const opened = new Date(cash.opened_at).toLocaleString('pt-BR');
            const closed = new Date(cash.closed_at).toLocaleString('pt-BR');
            html += `
                <li class="cash-history-item">
                    <div>
                    <p><strong>Aberto:</strong> ${opened}</p>
                    <p><strong>Fechado:</strong> ${closed}</p>
                    <p><strong>Saldo Final:</strong> R$ ${cash.closing_balance?.toFixed(2) || '0,00'}</p>
                    </div>
                    <div class="cash-history-actions">
                        <button class="btn btn-sm" onclick="viewCashDetails('${cash.id}')">Detalhes</button>
                        <button class="btn btn-sm btn-primary" onclick="printCashRegister('${cash.id}')">Gerar PDF</button>
                    </div>
                </li>
            `;
        });
        html += '</ul>';
        historyPanel.innerHTML = html;

    } catch (err) {
        historyPanel.innerHTML = '<p>Erro ao carregar histórico de caixas.</p>';
        console.error('Erro ao buscar histórico de caixas:', err);
    }
}

window.viewCashDetails = async function(cashId) {
    const modal = document.getElementById('view-cash-details-modal');
    const body = document.getElementById('view-cash-details-body');
    const title = document.getElementById('view-cash-details-title');
    const reopenBtn = document.getElementById('reopen-cash-btn');
    if (!modal || !body || !title) return;

    const { data: cash, error } = await supabase
        .from('cash_registers')
        .select('*')
        .eq('id', cashId)
        .single();

    if (error || !cash) {
        body.innerHTML = '<p>Erro ao buscar detalhes do caixa.</p>';
        modal.style.display = 'flex';
        return;
    }

    title.textContent = `Detalhes do Caixa (${new Date(cash.opened_at).toLocaleDateString('pt-BR')})`;

    // Definir o cashId no botão de reabrir
    if (reopenBtn) {
        reopenBtn.setAttribute('data-cash-id', cashId);
    }

    const { data: entries, error: entriesError } = await supabase
        .from('cash_register_entries')
        .select('id, created_at, type, amount, payment_method, description, sale_id')
        .eq('cash_register_id', cashId)
        .order('created_at', { ascending: false });

    if (entriesError) {
        body.innerHTML = '<p>Erro ao buscar movimentações.</p>';
        modal.style.display = 'flex';
        return;
    }
    
    let html = `<p><strong>Saldo Inicial:</strong> R$ ${cash.opening_balance?.toFixed(2) || '0,00'}</p>
    <p><strong>Saldo Final:</strong> R$ ${cash.closing_balance?.toFixed(2) || '0,00'}</p>
    <div class="text-right mb-2">
        <button class="btn btn-primary" onclick="printCashRegister('${cashId}')">Gerar PDF do Relatório</button>
    </div>`;
    html += '<div style="max-height:400px;overflow:auto">';
    const groupedEntries = groupCashEntries(entries);
    html += renderCashMovementsHtml(groupedEntries, 'Movimentações do Caixa');
    html += '</div>';
    body.innerHTML = html;
    modal.style.display = 'flex';
};

// Função para gerar e fazer download do relatório do caixa com custo e lucro
window.printCashRegister = async function(cashId) {
    // Mostrar indicador de carregamento
    showToast('Gerando relatório do caixa...', 'info');
    
    try {
        // Obter dados do relatório
        const reportData = await generateCashReport(cashId);
        if (!reportData) {
            showToast('Erro ao gerar relatório do caixa', 'error');
            return;
        }
        
        // Buscar logo customizado do Supabase (mesmo processo da OS)
        let logoUrl = null;
        try {
            const logoPaths = [
                `public/store_${getSelectedStoreId() || 1}/print-logo.png`,
        `public/store_${getSelectedStoreId() || 1}/print-logo.jpg`,
        `public/store_${getSelectedStoreId() || 1}/logo.png`,
                `public/print_logo.png`,
                `public/logo.png`
            ];

            for (const path of logoPaths) {
                const { data: urlData } = await supabase.storage.from('assets').getPublicUrl(path);
                if (urlData && urlData.publicUrl) {
                    try {
                        const response = await fetch(urlData.publicUrl, { method: 'HEAD' });
                        if (response.ok) {
                            logoUrl = urlData.publicUrl;
                            break;
                        }
                    } catch (e) { /* ignore fetch errors */ }
                }
            }
        } catch (logoError) {
            console.log('Erro ao buscar logo customizado:', logoError);
        }

        // Adicionar logoUrl aos dados do relatório
        reportData.logoUrl = logoUrl;
        
        // Salvar no localStorage para o template de PDF acessar
        localStorage.setItem('cash_report_data', JSON.stringify(reportData));
        
        // Abrir página do gerador de PDF em nova janela
        const pdfWindow = window.open('print-cash-template.html', '_blank');
        
        // Garantir que o foco seja dado à nova janela
        if (pdfWindow) {
            pdfWindow.focus();
        }
        
        showToast('Relatório pronto! Clique no botão para baixar o PDF.', 'success');
    } catch (error) {
        console.error('Erro ao preparar relatório:', error);
        showToast('Erro ao preparar relatório para download', 'error');
    }
};

// Função para gerar o relatório completo do caixa
async function generateCashReport(cashId) {
    try {
        // Buscar dados do caixa
        const { data: cash, error: cashError } = await supabase
            .from('cash_registers')
            .select('*')
            .eq('id', cashId)
            .single();
            
        if (cashError || !cash) {
            console.error('Erro ao buscar caixa:', cashError);
            return null;
        }
        
        // Buscar entradas do caixa
        const { data: entries, error: entriesError } = await supabase
            .from('cash_register_entries')
            .select('id, created_at, type, amount, payment_method, description, sale_id')
            .eq('cash_register_id', cashId)
            .order('created_at', { ascending: true });
            
        if (entriesError) {
            console.error('Erro ao buscar movimentações:', entriesError);
            return null;
        }
        
        // Agrupar vendas e calcular totais
        const sales = [];
        const payment_summary = {};
        let total_sales = 0;
        let total_entries = 0;
        let total_withdrawals = 0;
        
        // Agrupar entradas por sale_id para identificar vendas completas
        const salesMap = new Map();
        
        // Processar entradas e identificar vendas
        for (const entry of entries) {
            if (entry.type === 'entrada') {
                // Verificar se é uma venda do PDV ou de OS (com sale_id)
                const isVendaPDV = entry.description === 'Venda PDV' && entry.sale_id;
                const isVendaOS = entry.description && entry.description.includes('Entrega OS #') && entry.sale_id;
                
                if (isVendaPDV || isVendaOS) {
                    // É uma venda, vamos agrupar
                    if (!salesMap.has(entry.sale_id)) {
                        salesMap.set(entry.sale_id, {
                            id: entry.sale_id,
                            created_at: entry.created_at,
                            entries: [],
                            total: 0,
                            payment_method: '',
                            description: entry.description // Guardar a descrição para exibição
                        });
                    }
                    const saleData = salesMap.get(entry.sale_id);
                    saleData.entries.push(entry);
                    saleData.total += parseFloat(entry.amount) || 0;
                    
                    // Atualizar o método de pagamento
                    if (saleData.payment_method) {
                        if (!saleData.payment_method.includes(entry.payment_method)) {
                            saleData.payment_method += ', ' + entry.payment_method;
                        }
                    } else {
                        saleData.payment_method = entry.payment_method;
                    }
                    
                    // Atualizar resumo de pagamentos
                    const method = entry.payment_method || 'Não especificado';
                    payment_summary[method] = (payment_summary[method] || 0) + parseFloat(entry.amount);
                    
                    total_sales += parseFloat(entry.amount) || 0;
                } else if (entry.sale_id) {
                    // Verificar se já existe uma venda com este sale_id
                    if (salesMap.has(entry.sale_id)) {
                        const saleData = salesMap.get(entry.sale_id);
                        saleData.entries.push(entry);
                        saleData.total += parseFloat(entry.amount) || 0;
                        
                        // Atualizar o método de pagamento
                        if (saleData.payment_method) {
                            if (!saleData.payment_method.includes(entry.payment_method)) {
                                saleData.payment_method += ', ' + entry.payment_method;
                            }
                        } else {
                            saleData.payment_method = entry.payment_method;
                        }
                        
                        // Atualizar resumo de pagamentos
                        const method = entry.payment_method || 'Não especificado';
                        payment_summary[method] = (payment_summary[method] || 0) + parseFloat(entry.amount);
                        
                        total_sales += parseFloat(entry.amount) || 0;
                    } else {
                        // É uma entrada com sale_id, mas não identificada como venda ainda
                        salesMap.set(entry.sale_id, {
                            id: entry.sale_id,
                            created_at: entry.created_at,
                            entries: [entry],
                            total: parseFloat(entry.amount) || 0,
                            payment_method: entry.payment_method,
                            description: entry.description
                        });
                        
                        // Atualizar resumo de pagamentos
                        const method = entry.payment_method || 'Não especificado';
                        payment_summary[method] = (payment_summary[method] || 0) + parseFloat(entry.amount);
                        
                        total_sales += parseFloat(entry.amount) || 0;
                    }
                } else {
                    // É outra entrada (não venda)
                    total_entries += parseFloat(entry.amount) || 0;
                }
            } else if (entry.type === 'saida') {
                total_withdrawals += parseFloat(entry.amount) || 0;
            }
        }
        
        // Verificar permissão para visualizar custos
        const canViewCosts = await canViewCostPrices();
        
        // Buscar dados de custo e lucro para cada venda
        const salesWithProfit = await calculateSalesProfit(Array.from(salesMap.values()));
        
        // Calcular totais de custo e lucro (apenas se tiver permissão)
        let total_costs = 0;
        let total_profit = 0;
        
        if (canViewCosts) {
            salesWithProfit.forEach(sale => {
                total_costs += sale.cost_total || 0;
                total_profit += sale.profit || 0;
            });
        }
        
               // Buscar informações da loja e logo (LÓGICA UNIFICADA)
               let storeInfo = null;
               let logoUrl = null;
               
               try {
                   if (cash.store_id) {
                       const { data: store, error: storeError } = await supabase
                           .from('stores')
                       .select('name, phone')
                           .eq('id', cash.store_id)
                           .single();
                           
                       if (storeError) throw storeError;
                       
                       if (store) {
                           storeInfo = {
                               name: store.name || 'Loja',
                           address: 'R. 38, N 518 - Sala 02 - Lot. Paraíso do Sul, Santa Maria, Aracaju - SE, 49044-451',
                           phones: store.phone || '(79) 9.8160-6441 / (79) 3011-2293'
                           };
                       }
                   }
                   
                   // Lógica unificada para buscar logo
                   const logoPaths = [
                       `public/store_${cash.store_id || getSelectedStoreId() || 1}/print-logo.png`,
        `public/store_${cash.store_id || getSelectedStoreId() || 1}/print-logo.jpg`,
        `public/store_${cash.store_id || getSelectedStoreId() || 1}/logo.png`,
                       `public/print_logo.png`,
                       `public/logo.png`
                   ];
       
                   for (const path of logoPaths) {
                       const { data: urlData } = await supabase.storage.from('assets').getPublicUrl(path);
                       if (urlData && urlData.publicUrl) {
                           try {
                               const response = await fetch(urlData.publicUrl, { method: 'HEAD' });
                               if (response.ok) {
                                   logoUrl = urlData.publicUrl;
                                   break;
                               }
                           } catch (e) { /* ignorar erros de fetch */ }
                       }
                   }
               } catch (infoError) {
                   console.warn('Erro ao buscar informações da loja ou logo:', infoError);
               }
        
        // Preparar relatório completo
        const report = {
            id: cash.id,
            opened_at: cash.opened_at,
            closed_at: cash.closed_at,
            opening_balance: cash.opening_balance || 0,
            closing_balance: cash.closing_balance || 0,
            total_sales,
            total_entries,
            total_withdrawals,
            total_costs,
            total_profit,
            sales: salesWithProfit,
            payment_summary,
            storeInfo,
            logoUrl,
            canViewCosts
        };
        
        return report;
    } catch (error) {
        console.error('Erro ao gerar relatório:', error);
        return null;
    }
}

async function calculateSalesProfit(sales) {
    if (!sales || !sales.length) return [];
    
    const salesWithProfit = [];
    
    for (const sale of sales) {
        try {
            let costTotal = 0;
            let isOSSale = false;
            let osDetails = null;
            
            // Sempre buscar dados da venda na tabela sales primeiro (método mais confiável)
            {
                const { data: saleData, error: saleError } = await supabase
                    .from('sales')
                    .select('items, os_id')
                    .eq('id', sale.id)
                    .single();
                    
                // Verificar se é uma venda de OS pelo campo os_id
                if (!saleError && saleData && saleData.os_id) {
                    isOSSale = true;
                    
                    // Buscar detalhes da OS
                    const { data: osData } = await supabase
                        .from('service_orders')
                        .select('client_name, equipment_brand, equipment_model')
                        .eq('id', saleData.os_id)
                        .single();
                        
                    if (osData) {
                        osDetails = {
                            id: saleData.os_id,
                            customer_name: osData.client_name,
                            brand: osData.equipment_brand,
                            model: osData.equipment_model
                        };
                    }
                }
                    
                if (!saleError && saleData && saleData.items && Array.isArray(saleData.items)) {
                    // Calcular custo total dos itens usando o cost_price salvo no registro de venda
                    for (const item of saleData.items) {
                        if (!item || !item.id) continue;
                        
                        const quantidade = item.qty || item.quantity || 1;
                        
                        // CORREÇÃO: Usar cost_price do item salvo na venda, se disponível
                        if (item.cost_price !== undefined && item.cost_price !== null) {
                            const itemCost = parseFloat(item.cost_price) * quantidade;
                            costTotal += itemCost;
                            // Debug removido
                        } else {
                            // Fallback: buscar cost_price da tabela products se não estiver salvo na venda
                            try {
                                const { data: product } = await supabase
                                    .from('products')
                                    .select('cost_price, name')
                                    .eq('id', item.id)
                                    .single();
                                if (product && product.cost_price) {
                                    const itemCost = parseFloat(product.cost_price) * quantidade;
                                    costTotal += itemCost;
                                    console.log(`[DIAG] Produto (fallback): ${product.name} | Qtd: ${quantidade} | Custo unit: ${product.cost_price} | Custo total: ${itemCost}`);
                                } else {
                                    console.warn(`[DIAG] Produto sem custo cadastrado:`, item);
                                }
                            } catch (productError) {
                                console.warn(`[DIAG] Erro ao buscar custo do produto ${item.id}:`, productError);
                            }
                        }
                    }
                }
            }
            
            // Calcular lucro
            const profit = (sale.total || 0) - costTotal;
            
            console.log(`[DIAG] 💰 Venda ID ${sale.id}: Total R$ ${sale.total} - Custo R$ ${costTotal} = Lucro R$ ${profit}`);
            
            // Criar descrição detalhada para vendas de OS
            let detailedDescription = sale.description;
            if (isOSSale && osDetails) {
                detailedDescription = `OS #${osDetails.id} - ${osDetails.customer_name || 'Cliente'} - ${osDetails.brand || ''} ${osDetails.model || ''}`;
            }
            
            // Adicionar à lista com custos e lucros
            salesWithProfit.push({
                ...sale,
                cost_total: costTotal,
                profit: profit,
                description: detailedDescription || sale.description || (isOSSale ? 'Venda OS' : 'Venda PDV')
            });
            
        } catch (error) {
            console.error(`[DIAG] Erro ao processar venda ${sale.id}:`, error);
            
            // Se houver erro, adicionar a venda sem cálculo de lucro
            salesWithProfit.push({
                ...sale,
                cost_total: 0,
                profit: sale.total || 0
            });
        }
    }
    
    return salesWithProfit;
}

// Modificar o HTML da caixa para incluir o botão de impressão ao fechar
function setupCloseCashRegister() {
    const closeCashBtn = document.getElementById('btn-close-cash');
    const closeCashModal = document.getElementById('close-cash-modal');
    const closeCashForm = document.getElementById('close-cash-form');
    
    if (closeCashBtn) {
        closeCashBtn.onclick = () => {
            // Buscar saldo atual para exibição
            updateClosingBalance();
            closeCashModal.style.display = 'flex';
        };
    }
    
    // Adicionar formatação automática ao campo de valor
    const countedBalanceField = document.getElementById('counted-balance');
    if (countedBalanceField) {
        countedBalanceField.addEventListener('input', (e) => {
            // Remove todos os caracteres não numéricos
            let value = e.target.value.replace(/[^\d]/g, '');
            
            // Se não houver valor, não faz nada
            if (!value) {
                e.target.value = '';
                return;
            }
            
            // Converte para número (divide por 100 para considerar os centavos)
            const numValue = parseFloat(value) / 100;
            
            // Formata o número com separador de milhares e vírgula decimal
            if (!isNaN(numValue)) {
                e.target.value = formatValueForDisplay(numValue);
            }
        });
    }
    
    if (closeCashForm) {
        closeCashForm.onsubmit = async (e) => {
            e.preventDefault();
            
            // Converte o valor formatado para número
            const valueStr = document.getElementById('counted-balance')?.value || '0';
            const closing_balance = parseFloat(valueStr.replace(/\./g, '').replace(',', '.'));
            const notes = document.getElementById('closing-notes')?.value || '';
            
            if (isNaN(closing_balance)) {
                showToast('Informe um saldo final válido!', 'error');
                return;
            }
            
            // Buscar caixa aberto
            const { data: openCash, error: cashError } = await supabase
                .from('cash_registers')
                .select('id')
                .eq('status', 'open')
                .eq('store_id', getSelectedStoreId())
                .limit(1);
                
            if (cashError || !openCash || openCash.length === 0) {
                showToast('Erro: Nenhum caixa aberto encontrado!', 'error');
                return;
            }
            
            const cashId = openCash[0].id;
            
            // Fechar o caixa
            const { error: updateError } = await supabase
                .from('cash_registers')
                .update({ 
                    status: 'closed', 
                    closed_at: new Date().toISOString(),
                    closing_balance,
                    notes
                })
                .eq('id', cashId);
                
            if (updateError) {
                showToast('Erro ao fechar o caixa!', 'error');
                console.error('Erro ao fechar caixa:', updateError);
                return;
            }
            
            closeCashModal.style.display = 'none';
            showToast('Caixa fechado com sucesso!', 'success');
            
            // Perguntar se deseja gerar o relatório para download
            if (confirm('Deseja gerar o relatório do caixa para download em PDF?')) {
                printCashRegister(cashId);
            }
            
            // Atualizar a view de caixa aberto/fechado
            initializeCashRegisterModule();
        };
    }
}

// Função para atualizar o saldo de fechamento no modal
async function updateClosingBalance() {
    const cashClosingBalance = document.getElementById('counted-balance');
    if (!cashClosingBalance) return;
    
    try {
        // Buscar caixa aberto
        const { data: openCash, error: cashError } = await supabase
            .from('cash_registers')
            .select('id')
            .eq('status', 'open')
            .eq('store_id', getSelectedStoreId())
            .limit(1);
            
        if (cashError || !openCash || openCash.length === 0) return;
        
        const cashId = openCash[0].id;
        
        // Buscar todas as entradas e saídas
        const { data: entries, error: entriesError } = await supabase
            .from('cash_register_entries')
            .select('type, amount')
            .eq('cash_register_id', cashId);
            
        if (entriesError) return;
        
        // Calcular saldo
        let balance = 0;
        entries.forEach(entry => {
            if (entry.type === 'entrada') {
                balance += parseFloat(entry.amount) || 0;
            } else if (entry.type === 'saida') {
                balance -= parseFloat(entry.amount) || 0;
            }
        });
        
        // Buscar saldo inicial
        const { data: cash } = await supabase
            .from('cash_registers')
            .select('opening_balance')
            .eq('id', cashId)
            .single();
            
        if (cash) {
            balance += parseFloat(cash.opening_balance) || 0;
        }
        
        // Exibir valor formatado
        cashClosingBalance.value = formatValueForDisplay(balance);
    } catch (err) {
        console.error('Erro ao calcular saldo de fechamento:', err);
    }
}

// ... existing code ...

// Inicializa o componente de Senha Padrão (PatternLock) na modal de OS
function setupPatternLock() {
    if (window.PatternLock) {
        const pattern = new PatternLock('#pattern-lock-canvas');
        const hiddenInput = document.getElementById('os-pattern-lock-value');
        // Atualiza o input hidden sempre que o padrão mudar
        pattern.on('change', value => {
            if (hiddenInput) hiddenInput.value = value;
        });
        // Botão de limpar padrão
        const btnReset = document.getElementById('btn-reset-pattern');
        if (btnReset) btnReset.addEventListener('click', () => {
            pattern.reset();
        });
    }
}

// Função será chamada no listener principal

// Função para fechar modal de pagamento da OS
window.closeOSPaymentModal = function() {
    const modal = document.getElementById('os-payment-modal');
    if (modal) {
        modal.remove();
    }
};

// Função para finalizar pagamento da OS
window.finalizeOSPayment = async function(osId, products, totalAmount, cashRegisterId) {
    try {
        const paymentMethod = document.querySelector('input[name="os-payment-method"]:checked')?.value;
        
        if (!paymentMethod) {
            showToast('Selecione uma forma de pagamento', 'error');
            return;
        }
        
        let salesData = [];
        
        if (paymentMethod === 'dividido') {
            // Pagamento dividido - coletar valores de cada método
            const splitInputs = [
                { id: 'os-split-dinheiro', method: 'dinheiro', name: 'Dinheiro' },
                { id: 'os-split-credito', method: 'credito', name: 'Cartão de Crédito' },
                { id: 'os-split-debito', method: 'debito', name: 'Cartão de Débito' },
                { id: 'os-split-pix', method: 'pix', name: 'PIX' }
            ];
            
            let totalPaid = 0;
            
            for (const split of splitInputs) {
                const input = document.getElementById(split.id);
                const value = parseFloat(input?.value) || 0;
                
                if (value > 0) {
                    totalPaid += value;
                    salesData.push({
                        cash_register_id: cashRegisterId,
                        amount: value,
                        payment_method: split.method,
                        type: 'entrada',
                        description: `Entrega OS #${osId} - ${products.map(p => p.name).join(', ')} (${split.name})`,
                        user_id: getCurrentUser()?.id
                    });
                }
            }
            
            // Validar se o total pago está correto
            if (Math.abs(totalPaid - totalAmount) > 0.01) {
                showToast(`Erro: Total pago (R$ ${totalPaid.toFixed(2)}) não confere com o valor da OS (R$ ${totalAmount.toFixed(2)})`, 'error');
                return;
            }
            
            if (salesData.length === 0) {
                showToast('Informe pelo menos um valor para o pagamento dividido', 'error');
                return;
            }
            
        } else {
            // Pagamento único
            salesData.push({
                cash_register_id: cashRegisterId,
                amount: totalAmount,
                payment_method: paymentMethod,
                type: 'entrada',
                description: `Entrega OS #${osId} - ${products.map(p => p.name).join(', ')}`,
                user_id: getCurrentUser()?.id
            });
        }
        
        // Criar registro de venda na tabela sales para rastrear produtos e calcular lucro
        const saleData = {
            store_id: getSelectedStoreId(),
            user_id: getCurrentUser()?.id,
            total: totalAmount,
            payment_method: paymentMethod === 'dividido' ? 'multiplo' : paymentMethod,
            items: products.map(p => ({
                id: p.id,
                name: p.name,
                price: p.price,
                qty: p.quantity,
                cost_price: p.cost_price || 0, // INCLUIR cost_price aqui
                total: p.price * p.quantity
            })),
            created_at: new Date().toISOString()
        };
        
        // Função interna para criar o registro de venda
        async function createSaleRecord() {
            try {
                // Primeiro tentar inserir com os_id
                const { data: saleRecord, error: saleRecordError } = await supabase.from('sales').insert({
                    ...saleData,
                    os_id: osId
                }).select('id').single();
                
                if (saleRecordError && saleRecordError.code === 'PGRST204') {
                    // Se der erro de coluna não encontrada, tentar sem o os_id
                    console.warn('Coluna os_id não encontrada na tabela sales, tentando sem ela');
                    const { data: fallbackRecord, error: fallbackError } = await supabase.from('sales').insert(saleData).select('id').single();
                    
                    if (fallbackError) {
                        throw fallbackError;
                    }
                    
                    return fallbackRecord;
                } else if (saleRecordError) {
                    throw saleRecordError;
                }
                
                return saleRecord;
            } catch (error) {
                console.error('Erro ao criar registro de venda:', error);
                return null;
            }
        }
        
        // Obter o registro de venda criado
        const saleRecord = await createSaleRecord();
        
        // Atualizar sale_id em salesData se o registro foi criado com sucesso
        if (saleRecord && saleRecord.id) {
            salesData = salesData.map(entry => ({
                ...entry,
                sale_id: saleRecord.id
            }));
        }
        
        // Registrar todas as vendas no caixa
        const { error: saleError } = await supabase.from('cash_register_entries').insert(salesData);
        
        if (saleError) throw saleError;
        
        // Atualizar estoque dos produtos
        for (const product of products) {
            // APENAS decrementar estoque se o produto tem controle de estoque ativado
            if (product.track_stock) {
                const { error: stockError } = await supabase.rpc('decrement_stock', {
                    product_id_in: product.id,
                    quantity_in: product.quantity
                });
                    
                if (stockError) {
                    console.warn(`Erro ao atualizar estoque do produto ${product.name}:`, stockError);
                }
            }
        }
        
        if (paymentMethod === 'dividido') {
            const methodsSummary = salesData.map(s => `${s.payment_method}: R$ ${s.amount.toFixed(2)}`).join(', ');
            showToast(`Venda de R$ ${totalAmount.toFixed(2)} registrada no caixa com pagamento dividido (${methodsSummary})`, 'success');
        } else {
            showToast(`Venda de R$ ${totalAmount.toFixed(2)} registrada no caixa via ${paymentMethod}`, 'success');
        }
        closeOSPaymentModal();
        
        // Atualizar painel do caixa se estiver visível
        if (typeof updateCashSummaryPanel === 'function') {
            updateCashSummaryPanel();
        }
        
    } catch (error) {
        console.error('Erro ao finalizar pagamento da OS:', error);
        showToast('Erro ao processar pagamento', 'error');
    }
};

// IMPLEMENTAÇÃO COMPLETA: Função para imprimir OS usando o sistema existente
async function printWithToast(osId) {
    try {
        // Buscar dados completos da OS, incluindo produtos e serviços com custo
        const { data: os, error } = await supabase
            .from('service_orders')
            .select(`
                *,
                used_products
            `)
            .eq('id', osId)
            .single();

        if (error || !os) {
            showToast('Erro ao buscar dados da OS para impressão', 'error');
            console.error("Erro ao buscar OS:", error);
            return;
        }

        // Se quote_value for null, calcular automaticamente baseado nos produtos
        if (os.quote_value === null || os.quote_value === undefined) {
            let calculatedValue = 0;
            
            // Primeiro, tentar calcular a partir da coluna products (JSONB)
            if (os.products && Array.isArray(os.products)) {
                calculatedValue = os.products.reduce((total, product) => {
                    const price = parseFloat(product.price) || 0;
                    const quantity = parseInt(product.quantity) || 0;
                    return total + (price * quantity);
                }, 0);
            }
            
            // Se não há produtos na coluna JSONB, tentar buscar da tabela service_order_products
            if (calculatedValue === 0) {
                const { data: orderProducts } = await supabase
                    .from('service_order_products')
                    .select('price, quantity')
                    .eq('service_order_id', osId);
                    
                if (orderProducts && orderProducts.length > 0) {
                    calculatedValue = orderProducts.reduce((total, product) => {
                        const price = parseFloat(product.price) || 0;
                        const quantity = parseInt(product.quantity) || 0;
                        return total + (price * quantity);
                    }, 0);
                }
            }
            
            os.quote_value = calculatedValue;
            console.log('quote_value calculado automaticamente:', calculatedValue);
        }

        // Buscar dados do cliente se houver ID
        if (os.customer_id) {
            const { data: customer } = await supabase.from('customers').select('*').eq('id', os.customer_id).single();
            if (customer) {
                os.customers = customer;
                // Atualizar nome e telefone do cliente para impressão
                os.client_name = customer.full_name || customer.name;
                os.client_phone = customer.phone;
                // Adicionar dados do endereço diretamente no objeto OS para impressão
                os.client_address = customer.address;
                os.client_street = customer.street;
                os.client_number = customer.number;
                os.client_complement = customer.complement;
                os.client_neighborhood = customer.neighborhood;
                os.client_city = customer.city;
                os.client_state = customer.state;
                os.client_cep = customer.cep;
            }
        }

        // Buscar dados do usuário que criou a OS
        if (os.user_id) {
            const { data: userProfile } = await supabase.from('profiles').select('full_name, email').eq('id', os.user_id).single();
            if (userProfile) {
                os.created_by_user = userProfile.full_name || userProfile.email || 'Usuário não identificado';
            }
        } else {
            os.created_by_user = 'Usuário não identificado';
        }

        // Buscar logo customizada do Supabase
        let logoUrl = null;
        try {
            const logoPaths = [
                `public/store_${getSelectedStoreId() || 1}/print-logo.png`,
        `public/store_${getSelectedStoreId() || 1}/print-logo.jpg`,
        `public/store_${getSelectedStoreId() || 1}/logo.png`,
                `public/print_logo.png`,
                `public/logo.png`
            ];

            for (const path of logoPaths) {
                const { data: urlData } = await supabase.storage.from('assets').getPublicUrl(path);
                if (urlData && urlData.publicUrl) {
                    try {
                        const response = await fetch(urlData.publicUrl, { method: 'HEAD' });
                        if (response.ok) {
                            logoUrl = urlData.publicUrl;
                            break;
                        }
                    } catch (e) { /* ignore fetch errors */ }
                }
            }
        } catch (logoError) {
            console.log('Erro ao buscar logo customizada:', logoError);
        }

        os.logoUrl = logoUrl;



        // Salvar no localStorage para o template de impressão
        localStorage.setItem('currentOS_for_print', JSON.stringify(os));
        
        // Abrir janela de impressão
        window.open('print-template.html', '_blank');
        
        showToast(`OS #${osId} enviada para impressão`, 'success');
        
    } catch (error) {
        console.error('Erro na impressão:', error);
        showToast('Erro ao preparar impressão', 'error');
    }
}

// As funções viewCustomer e editCustomer agora são importadas do módulo customers.js

// FUNÇÃO DE DIAGNÓSTICO: Verifica se os elementos dos modais existem
function diagnosticModals() {
    const elements = {
        'os-view-modal': document.getElementById('os-view-modal'),
        'os-view-title': document.getElementById('os-view-title'),
        'os-view-body': document.getElementById('os-view-body'),
        'btn-print-os-from-view': document.getElementById('btn-print-os-from-view'),
        'os-edit-modal': document.getElementById('os-edit-modal'),
        'os-edit-title': document.getElementById('os-edit-title'),
        'edit-os-form': document.getElementById('edit-os-form'),
        'edit-os-brand': document.getElementById('edit-os-brand')
    };
    
    // Debug removido
    for (const [name, element] of Object.entries(elements)) {
        // Debug removido
    }
    // Debug removido
    
    return elements;
}

// ADICIONADO: Evento para fechar o modal de visualização da OS
document.addEventListener('DOMContentLoaded', () => {
    // Executar diagnóstico ao carregar a página
    setTimeout(() => diagnosticModals(), 1000);
    
    const btnClose = document.getElementById('btn-close-os-view-modal');
    if(btnClose) {
        btnClose.addEventListener('click', () => {
            const modal = document.getElementById('os-view-modal');
            if(modal) modal.style.display = 'none';
        });
    }

    // ADICIONADO: Eventos para o modal de edição
    const btnCloseEdit = document.getElementById('btn-close-os-edit-modal');
    const btnCancelEdit = document.getElementById('btn-cancel-edit-os');
    const editForm = document.getElementById('edit-os-form');

    if (btnCloseEdit) {
        btnCloseEdit.addEventListener('click', () => {
            closeEditOSModal();
        });
    }

    if (btnCancelEdit) {
        btnCancelEdit.addEventListener('click', () => {
            closeEditOSModal();
        });
    }

    if (editForm) {
        editForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const osId = document.getElementById('edit-os-id').value;
            const submitBtn = e.target.querySelector('button[type="submit"]');
            submitBtn.disabled = true;
            submitBtn.textContent = 'Salvando...';

            try {
                const updatedData = {
                            equipment_model: document.getElementById('edit-os-model').value,
        problem_description: document.getElementById('edit-os-problem').value,
        status: document.getElementById('edit-os-status-select').value,
        quote_value: parseFloat(document.getElementById('edit-os-quote-value').value.replace(/\./g, '').replace(',', '.')) || 0,
                    estimated_delivery_date: document.getElementById('edit-os-delivery-date').value || null,
                    notes: document.getElementById('edit-os-notes').value
                };

                // Atualizar marca
                const brandInput = document.getElementById('edit-os-brand');
                if (brandInput.value) {
                    updatedData.equipment_brand = brandInput.value;
                }

                const { error } = await supabase.from('service_orders').update(updatedData).eq('id', osId);
                
                if (error) throw error;

                showToast(`OS #${osId} atualizada com sucesso!`, 'success');
                closeEditOSModal();
                loadOSTable(1, getSelectedStoreId(), printWithToast); // Recarrega a tabela
                
            } catch (error) {
                showToast(`Erro ao atualizar OS: ${error.message}`, 'error');
            } finally {
                submitBtn.disabled = false;
                submitBtn.textContent = 'Salvar Alterações';
            }
        });
    }
});

// ==========================================
// FUNÇÕES AUXILIARES PARA MODAL DE EDIÇÃO DE OS
// ==========================================

// Função para adicionar produto à OS (abre modal bonito)
window.addOSProduct = function(product) {
    if (!product || !product.id) {
        console.error('Produto inválido para adicionar à OS');
        return;
    }

    // Verificar se o produto já foi adicionado
    const productsList = document.getElementById('os-products-list');
    if (productsList && productsList.querySelector(`[data-product-id="${product.id}"]`)) {
        showToast('Produto já foi adicionado à OS', 'error');
        return;
    }

    // Armazenar produto selecionado temporariamente
    window.selectedProductForOS = product;
    
    // Preencher informações do produto no modal
    const productNameDisplay = document.getElementById('selected-product-name');
    const productStockDisplay = document.getElementById('selected-product-stock');
    const productPriceDisplay = document.getElementById('selected-product-price');
    const quantityInput = document.getElementById('product-quantity');
    const priceInput = document.getElementById('product-custom-price');
    
    if (productNameDisplay) productNameDisplay.textContent = product.name;
    if (productStockDisplay) productStockDisplay.textContent = product.track_stock ? (product.stock || 0) : '∞';
    if (productPriceDisplay) productPriceDisplay.textContent = `R$ ${product.price.toFixed(2)}`;
    if (quantityInput) quantityInput.value = 1;
    if (priceInput) priceInput.value = formatPriceForDisplay(product.price);
    
    // Armazenar informação de controle de estoque no modal
    const modal = document.getElementById('add-product-modal');
    if (modal) {
        modal.dataset.trackStock = product.track_stock;
        modal.dataset.actualStock = product.stock || 0;
    }
    
    // Abrir modal usando a função do serviceOrders.js
    if (typeof openAddProductModal === 'function') {
        openAddProductModal(product);
    } else {
        console.error('Função openAddProductModal não encontrada');
    }
    
    // Limpar campo de busca
    const searchInput = document.getElementById('os-product-search');
    if (searchInput) {
        searchInput.value = '';
    }
    
    // Esconder resultados
    const resultsContainer = document.getElementById('os-product-results');
    if (resultsContainer) {
        resultsContainer.style.display = 'none';
    }
};

// A função openAddProductModal agora é importada do serviceOrders.js

// A função closeAddProductModal agora é importada do serviceOrders.js
// Disponibilizar função importada globalmente
window.closeAddProductModal = closeAddProductModal;

// Disponibilizar função importada globalmente
window.adjustQuantity = adjustQuantity;

// Disponibilizar função importada globalmente
window.updateProductTotal = updateProductTotal;

// Função para formatar preço para exibição
function formatPriceForDisplay(price) {
    if (!price && price !== 0) return '0,00';
    
    // Garantir que é um número
    const numericPrice = parseFloat(price);
    
    // Formatar com 2 casas decimais
    const formatted = numericPrice.toFixed(2);
    
    // Separar parte inteira e decimal
    const parts = formatted.split('.');
    let integerPart = parts[0];
    const decimalPart = parts[1];
    
    // Adicionar pontos para milhares na parte inteira
    integerPart = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
    
    // Juntar com vírgula decimal
    return integerPart + ',' + decimalPart;
}

// Disponibilizar função importada globalmente
window.formatCurrencyInput = formatCurrencyInput;

// Disponibilizar função importada globalmente
window.confirmAddProduct = confirmAddProduct;

// Disponibilizar função importada globalmente
window.resetAddProductModal = resetAddProductModal;

// A função resetAddProductModal agora é importada do resetAddProductModal.js

// Função para buscar garantias por nome do cliente ou equipamento
async function searchWarrantyByCustomer() {
    const searchInput = document.getElementById('warranty-search-input');
    const searchTerm = searchInput ? searchInput.value.trim() : '';
    
    if (!searchTerm) {
        showToast('Por favor, digite um termo de busca', 'warning');
        return;
    }
    
    const tbody = document.getElementById('warranty-table-body');
    if (!tbody) return;
    
    tbody.innerHTML = '<tr><td colspan="7">Buscando...</td></tr>';
    
    try {
        let query = supabase
            .from('warranties')
            .select('*');
            
        // Filtrar por loja se houver uma selecionada
        if (getSelectedStoreId()) {
            query = query.eq('store_id', getSelectedStoreId());
        }
        
        const { data, error } = await query.order('created_at', { ascending: false });
        
        if (error) throw error;
        
        // Filtra os resultados localmente
        const filteredData = data.filter(warranty => {
            const customerName = warranty.customer_name || '';
            const equipmentBrand = warranty.equipment_brand || '';
            const equipmentModel = warranty.equipment_model || '';
            const partReplaced = warranty.part_replaced || '';
            
            return customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                   equipmentBrand.toLowerCase().includes(searchTerm.toLowerCase()) ||
                   equipmentModel.toLowerCase().includes(searchTerm.toLowerCase()) ||
                   partReplaced.toLowerCase().includes(searchTerm.toLowerCase());
        });
        
        // Oculta controles de paginação durante a busca
        const paginationContainer = document.getElementById('warranty-pagination');
        if (paginationContainer) {
            paginationContainer.style.display = 'none';
        }
        
        if (filteredData.length === 0) {
            tbody.innerHTML = '<tr><td colspan="7">Nenhuma garantia encontrada para o termo pesquisado.</td></tr>';
            return;
        }
        
        // Renderiza os resultados filtrados
        tbody.innerHTML = '';
        filteredData.forEach(warranty => {
            const row = document.createElement('tr');
            
            // Calcula data de validade da garantia
            const repairDate = new Date(warranty.repair_date);
            const validUntil = new Date(repairDate);
            validUntil.setDate(repairDate.getDate() + (warranty.warranty_period_days || 90));
            const isExpired = new Date() > validUntil;
            
            if (isExpired) {
                row.classList.add('warranty-expired');
            }
            
            row.innerHTML = `
                <td><strong>${warranty.id}</strong></td>
                <td>${warranty.customer_name}</td>
                <td>${warranty.equipment_brand} ${warranty.equipment_model}</td>
                <td>${warranty.part_replaced}</td>
                <td>R$ ${formatValueForDisplay(warranty.total_value)}</td>
                <td>${new Date(warranty.repair_date).toLocaleDateString('pt-BR')}</td>
                <td>
                    <button class="action-btn" onclick="viewWarranty(${warranty.id})" title="Visualizar">👁️</button>
                    <button class="action-btn" onclick="editWarranty(${warranty.id})" title="Editar">✏️</button>
                    <button class="action-btn" onclick="printWarranty(${warranty.id})" title="Imprimir">🖨️</button>
                    <button class="action-btn" onclick="deleteWarranty(${warranty.id})" title="Excluir">🗑️</button>
                </td>
            `;
            
            tbody.appendChild(row);
        });
        
        showToast(`${filteredData.length} garantia(s) encontrada(s)`, 'success');
        
    } catch (error) {
        console.error('Erro ao buscar garantias:', error);
        tbody.innerHTML = `<tr><td colspan="7">Erro ao buscar garantias. Tente novamente. (${error.message})</td></tr>`;
        showToast('Erro ao buscar garantias', 'error');
    }
}

// Função para limpar a pesquisa de garantias
function clearWarrantySearch() {
    const searchInput = document.getElementById('warranty-search-input');
    if (searchInput) {
        searchInput.value = '';
    }
    
    // Reexibe controles de paginação
    const paginationContainer = document.getElementById('warranty-pagination');
    if (paginationContainer) {
        paginationContainer.style.display = 'flex';
    }
    
    // Recarrega a tabela sem filtro
    loadWarrantyTable();
    showToast('Pesquisa limpa', 'info');
}

// ========================================
// SISTEMA DE GARANTIA
// ========================================

// Constantes para paginação de garantias
const WARRANTY_RECORDS_PER_PAGE = 10;

// Inicializar módulo de garantia
function initializeWarrantyModule() {
    const warrantyModule = document.getElementById('module-garantia');
    if (!warrantyModule) return;

    // Configurar eventos
    setupWarrantyEvents();
    
    // Carregar garantias
    loadWarrantyTable();
}

// Configurar eventos do módulo de garantia
function setupWarrantyEvents() {
    // Botão nova garantia
    const btnNewWarranty = document.getElementById('btn-new-warranty');
    if (btnNewWarranty) {
        btnNewWarranty.addEventListener('click', openNewWarrantyModal);
    }

    // Eventos de busca de garantias
    const warrantySearchInput = document.getElementById('warranty-search-input');
    const btnSearchWarranty = document.getElementById('btn-search-warranty');
    const btnClearWarrantySearch = document.getElementById('btn-clear-warranty-search');
    
    if (btnSearchWarranty) {
        btnSearchWarranty.addEventListener('click', () => searchWarrantyByCustomer());
    }
    
    if (btnClearWarrantySearch) {
        btnClearWarrantySearch.addEventListener('click', clearWarrantySearch);
    }
    
    if (warrantySearchInput) {
        warrantySearchInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                searchWarrantyByCustomer();
            }
        });
    }

    // Eventos de paginação
    const warrantyPrevBtn = document.getElementById('warranty-prev-page');
    const warrantyNextBtn = document.getElementById('warranty-next-page');
    
    if (warrantyPrevBtn) {
        warrantyPrevBtn.addEventListener('click', () => {
            if (!warrantyPrevBtn.disabled) {
                warrantyCurrentPage = Math.max(1, warrantyCurrentPage - 1);
                loadWarrantyTable(warrantyCurrentPage);
            }
        });
    }
    
    if (warrantyNextBtn) {
        warrantyNextBtn.addEventListener('click', () => {
            if (!warrantyNextBtn.disabled) {
                warrantyCurrentPage++;
                loadWarrantyTable(warrantyCurrentPage);
            }
        });
    }

    // Eventos dos modais
    setupWarrantyModalEvents();
}

// Configurar eventos dos modais de garantia
function setupWarrantyModalEvents() {
    // Modal de nova garantia
    const newWarrantyForm = document.getElementById('new-warranty-form');
    if (newWarrantyForm) {
        newWarrantyForm.addEventListener('submit', handleNewWarrantySubmit);
    }

    // Modal de edição de garantia
    const editWarrantyForm = document.getElementById('edit-warranty-form');
    if (editWarrantyForm) {
        editWarrantyForm.addEventListener('submit', handleEditWarrantySubmit);
    }

    // Botões de fechar modais
    const closeButtons = [
        'btn-close-warranty-modal',
        'btn-close-warranty-view-modal', 
        'btn-close-warranty-edit-modal'
    ];

    closeButtons.forEach(btnId => {
        const btn = document.getElementById(btnId);
        if (btn) {
            btn.addEventListener('click', closeWarrantyModals);
        }
    });

    // Botão de cancelar edição
    const btnCancelEdit = document.getElementById('btn-cancel-edit-warranty');
    if (btnCancelEdit) {
        btnCancelEdit.addEventListener('click', closeWarrantyModals);
    }

    // Configurar autocomplete de clientes para garantia
    setupWarrantyCustomerAutocomplete();
    setupEditWarrantyCustomerAutocomplete();

    // Configurar formatação de valores
    setupWarrantyValueFormatting();
}

// Carregar tabela de garantias
async function loadWarrantyTable(page = 1) {
    const tbody = document.getElementById('warranty-table-body');
    if (!tbody) return;
    
    warrantyCurrentPage = page;
    tbody.innerHTML = '<tr><td colspan="7">Carregando...</td></tr>';

    const from = (page - 1) * WARRANTY_RECORDS_PER_PAGE;
    const to = from + WARRANTY_RECORDS_PER_PAGE - 1;

    try {
        let query = supabase
            .from('warranties')
            .select('*', { count: 'exact' });
            
        // Filtrar por loja se houver uma selecionada
        if (getSelectedStoreId()) {
            query = query.eq('store_id', getSelectedStoreId());
        }
        
        const { data, error, count } = await query
            .order('created_at', { ascending: false })
            .range(from, to);

        if (error) throw error;
        
        updatePaginationUI('warranty', page, count);

        if (data.length === 0) {
            tbody.innerHTML = '<tr><td colspan="7">Nenhuma garantia encontrada.</td></tr>';
            return;
        }

        tbody.innerHTML = '';
        for (const warranty of data) {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td><strong>${warranty.id}</strong></td>
                <td>${warranty.customer_name || 'N/A'}</td>
                <td>${warranty.equipment_brand} ${warranty.equipment_model}</td>
                <td>${warranty.part_replaced}</td>
                <td>R$ ${formatValueForDisplay(warranty.total_value) || '0,00'}</td>
                <td>${formatDateForDisplay(warranty.repair_date)}</td>
                <td class="warranty-actions"></td>
            `;

            const actionsCell = row.querySelector('.warranty-actions');
            
            const viewBtn = document.createElement('button');
            viewBtn.className = 'action-btn';
            viewBtn.title = 'Visualizar';
            viewBtn.innerHTML = '👁️';
            viewBtn.addEventListener('click', () => viewWarranty(warranty.id));
            actionsCell.appendChild(viewBtn);

            const editBtn = document.createElement('button');
            editBtn.className = 'action-btn';
            editBtn.title = 'Editar';
            editBtn.innerHTML = '✏️';
            editBtn.addEventListener('click', () => editWarranty(warranty.id));
            actionsCell.appendChild(editBtn);

            const deleteBtn = document.createElement('button');
            deleteBtn.className = 'action-btn';
            deleteBtn.title = 'Excluir';
            deleteBtn.innerHTML = '🗑️';
            deleteBtn.addEventListener('click', () => deleteWarranty(warranty.id));
            actionsCell.appendChild(deleteBtn);

            tbody.appendChild(row);
        }
        
    } catch (error) {
        console.error('Erro ao carregar garantias:', error);
        tbody.innerHTML = `<tr><td colspan="7">Erro ao carregar dados. Tente novamente. (${error.message})</td></tr>`;
    }
}

// Abrir modal de nova garantia
function openNewWarrantyModal() {
    const modal = document.getElementById('warranty-modal-container');
    if (!modal) return;

    // Limpar formulário
    const form = document.getElementById('new-warranty-form');
    if (form) {
        form.reset();
        // Definir data padrão como hoje
        const repairDateInput = document.getElementById('warranty-repair-date');
        if (repairDateInput) {
            repairDateInput.value = new Date().toISOString().split('T')[0];
        }
    }

    modal.style.display = 'flex';
}

// Fechar modais de garantia
function closeWarrantyModals() {
    const modals = [
        'warranty-modal-container',
        'warranty-view-modal',
        'warranty-edit-modal'
    ];

    modals.forEach(modalId => {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.style.display = 'none';
        }
    });
}

// Manipular envio de nova garantia
async function handleNewWarrantySubmit(event) {
    event.preventDefault();
    
    const submitBtn = event.target.querySelector('button[type="submit"]');
    if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.textContent = 'Salvando...';
    }

    try {
        const warrantyData = {
            store_id: getSelectedStoreId(),
            customer_id: document.getElementById('warranty-selected-customer-id')?.value || null,
            customer_name: document.getElementById('warranty-customer-name')?.value || '',
        customer_phone: document.getElementById('warranty-customer-phone')?.value || null,
        equipment_brand: document.getElementById('warranty-equipment-brand')?.value || '',
        equipment_model: document.getElementById('warranty-equipment-model')?.value || '',
        part_replaced: document.getElementById('warranty-part-replaced')?.value || '',
        total_value: parseFloat(document.getElementById('warranty-total-value')?.value?.replace(/\./g, '').replace(',', '.') || '0') || 0,
        repair_date: document.getElementById('warranty-repair-date')?.value || '',
        warranty_period_days: parseInt(document.getElementById('warranty-period-days')?.value || '90') || 90,
        observations: document.getElementById('warranty-observations')?.value || null
        };

        const { data, error } = await supabase
            .from('warranties')
            .insert([warrantyData])
            .select()
            .single();

        if (error) throw error;

        showToast('Garantia criada com sucesso!', 'success');
        closeWarrantyModals();
        loadWarrantyTable();

    } catch (error) {
        console.error('Erro ao criar garantia:', error);
        showToast(`Erro ao criar garantia: ${error.message}`, 'error');
    } finally {
        if (submitBtn) {
            submitBtn.disabled = false;
            submitBtn.textContent = '💾 Salvar Garantia';
        }
    }
}

// Visualizar garantia
async function viewWarranty(warrantyId) {
    const modal = document.getElementById('warranty-view-modal');
    const titleEl = document.getElementById('warranty-view-title');
    const bodyEl = document.getElementById('warranty-view-body');
    const printBtn = document.getElementById('warranty-print-btn');

    if (!modal || !titleEl || !bodyEl) return;

    modal.style.display = 'flex';
    titleEl.textContent = `Carregando garantia #${warrantyId}...`;
    bodyEl.innerHTML = '<p>Carregando...</p>';

    try {
        const { data: warranty, error } = await supabase
            .from('warranties')
            .select('*')
            .eq('id', warrantyId)
            .single();

        if (error || !warranty) {
            bodyEl.innerHTML = `<p class="error-message">Erro ao buscar a garantia #${warrantyId}. Por favor, tente novamente.</p>`;
            console.error(error);
            return;
        }

        titleEl.textContent = `Detalhes da Garantia #${warranty.id}`;
        
        bodyEl.innerHTML = `
            <div class="warranty-view-grid">
                <div class="warranty-view-section">
                    <h4>Cliente</h4>
                    <p><strong>Nome:</strong> ${warranty.customer_name}</p>
                    <p><strong>Telefone:</strong> ${warranty.customer_phone || '(Não informado)'}</p>
                </div>
                <div class="warranty-view-section">
                    <h4>Equipamento</h4>
                    <p><strong>Marca:</strong> ${warranty.equipment_brand}</p>
                    <p><strong>Modelo:</strong> ${warranty.equipment_model}</p>
                </div>
                <div class="warranty-view-section">
                    <h4>Reparo</h4>
                    <p><strong>Peça Substituída:</strong> ${warranty.part_replaced}</p>
                    <p><strong>Valor Total:</strong> R$ ${formatValueForDisplay(warranty.total_value)}</p>
                    <p><strong>Data do Reparo:</strong> ${formatDateForDisplay(warranty.repair_date)}</p>
                </div>
                <div class="warranty-view-section full-width">
                    <h4>Observações</h4>
                    <p>${warranty.observations || 'Nenhuma observação adicional.'}</p>
                </div>
                <div class="warranty-view-section">
                    <h4>Informações da Garantia</h4>
                    <p><strong>Prazo:</strong> ${warranty.warranty_period_days || 90} dias</p>
                    <p><strong>Data de Criação:</strong> ${formatDateForDisplay(warranty.created_at)}</p>
                    <p><strong>Válida até:</strong> ${(() => {
                        const repairDate = new Date(warranty.repair_date);
                        const validUntil = new Date(repairDate);
                        validUntil.setDate(repairDate.getDate() + (warranty.warranty_period_days || 90));
                        return formatDateForDisplay(validUntil.toISOString().split('T')[0]);
                    })()}</p>
                </div>
            </div>
        `;

        printBtn.onclick = () => printWarranty(warrantyId);

    } catch (error) {
        console.error('Erro ao carregar garantia:', error);
        bodyEl.innerHTML = `<p class="error-message">Erro inesperado ao carregar garantia.</p>`;
    }
}

// Editar garantia
async function editWarranty(warrantyId) {
    const modal = document.getElementById('warranty-edit-modal');
    const titleEl = document.getElementById('warranty-edit-title');
    const form = document.getElementById('edit-warranty-form');

    if (!modal || !titleEl || !form) return;

    modal.style.display = 'flex';
    titleEl.textContent = `Editando Garantia #${warrantyId}`;

    try {
        const { data: warranty, error } = await supabase
            .from('warranties')
            .select('*')
            .eq('id', warrantyId)
            .single();

        if (error || !warranty) {
            showToast('Erro ao buscar dados da garantia para edição.', 'error');
            modal.style.display = 'none';
            return;
        }

        // Preencher formulário
        document.getElementById('edit-warranty-id').value = warranty.id;
        document.getElementById('edit-warranty-selected-customer-id').value = warranty.customer_id || '';
        document.getElementById('edit-warranty-customer-name').value = warranty.customer_name;
        document.getElementById('edit-warranty-customer-phone').value = warranty.customer_phone || '';
        document.getElementById('edit-warranty-equipment-brand').value = warranty.equipment_brand;
        document.getElementById('edit-warranty-equipment-model').value = warranty.equipment_model;
        document.getElementById('edit-warranty-part-replaced').value = warranty.part_replaced;
        document.getElementById('edit-warranty-total-value').value = formatValueForDisplay(warranty.total_value);
        document.getElementById('edit-warranty-repair-date').value = warranty.repair_date;
        document.getElementById('edit-warranty-period-days').value = warranty.warranty_period_days || 90;
        document.getElementById('edit-warranty-observations').value = warranty.observations || '';

    } catch (error) {
        console.error('Erro ao carregar garantia para edição:', error);
        showToast('Erro inesperado ao carregar garantia.', 'error');
        modal.style.display = 'none';
    }
}

// Manipular envio de edição de garantia
async function handleEditWarrantySubmit(event) {
    event.preventDefault();
    
    const submitBtn = event.target.querySelector('button[type="submit"]');
    if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.textContent = 'Salvando...';
    }

    try {
        const warrantyId = document.getElementById('edit-warranty-id').value;
        
        const warrantyData = {
            customer_id: document.getElementById('edit-warranty-selected-customer-id')?.value || null,
            customer_name: document.getElementById('edit-warranty-customer-name').value,
            customer_phone: document.getElementById('edit-warranty-customer-phone').value || null,
            equipment_brand: document.getElementById('edit-warranty-equipment-brand').value,
            equipment_model: document.getElementById('edit-warranty-equipment-model').value,
            part_replaced: document.getElementById('edit-warranty-part-replaced').value,
            total_value: parseFloat(document.getElementById('edit-warranty-total-value').value.replace(/\./g, '').replace(',', '.')) || 0,
            repair_date: document.getElementById('edit-warranty-repair-date').value,
            warranty_period_days: parseInt(document.getElementById('edit-warranty-period-days').value) || 90,
            observations: document.getElementById('edit-warranty-observations').value || null
        };

        const { error } = await supabase
            .from('warranties')
            .update(warrantyData)
            .eq('id', warrantyId);

        if (error) throw error;

        showToast(`Garantia #${warrantyId} atualizada com sucesso!`, 'success');
        closeWarrantyModals();
        loadWarrantyTable();

    } catch (error) {
        console.error('Erro ao atualizar garantia:', error);
        showToast(`Erro ao atualizar garantia: ${error.message}`, 'error');
    } finally {
        if (submitBtn) {
            submitBtn.disabled = false;
            submitBtn.textContent = '💾 Salvar Alterações';
        }
    }
}

// Excluir garantia
async function deleteWarranty(warrantyId) {
    if (!confirm(`Tem certeza que deseja excluir a garantia #${warrantyId}?\n\nEsta ação não pode ser desfeita.`)) {
        return;
    }

    try {
        const { error } = await supabase
            .from('warranties')
            .delete()
            .eq('id', warrantyId);

        if (error) throw error;

        showToast(`Garantia #${warrantyId} excluída com sucesso!`, 'success');
        loadWarrantyTable();

    } catch (error) {
        console.error('Erro ao excluir garantia:', error);
        showToast(`Erro ao excluir garantia: ${error.message}`, 'error');
    }
}

// Configurar autocomplete de clientes para garantia
function setupWarrantyCustomerAutocomplete() {
    const searchInput = document.getElementById('warranty-customer-search');
    const resultsDiv = document.getElementById('warranty-customer-results');
    const nameInput = document.getElementById('warranty-customer-name');
    const phoneInput = document.getElementById('warranty-customer-phone');
    const customerIdInput = document.getElementById('warranty-selected-customer-id');

    if (!searchInput || !resultsDiv) return;

    let searchTimeout;
    
    searchInput.addEventListener('input', async (e) => {
        clearTimeout(searchTimeout);
        searchTimeout = setTimeout(async () => {
            const query = e.target.value.trim();

            if (query.length < 2) {
                resultsDiv.innerHTML = '';
                resultsDiv.style.display = 'none';
                return;
            }

            try {
                const { data: customers, error } = await supabase
                    .from('customers')
                    .select('id, full_name, phone')
                    .ilike('full_name', `%${query}%`)
                    .limit(5);

                if (error) {
                    console.error('Erro na busca de clientes:', error);
                    return;
                }

                if (customers.length === 0) {
                    resultsDiv.innerHTML = '<div class="autocomplete-item">Nenhum cliente encontrado</div>';
                } else {
                    resultsDiv.innerHTML = customers.map(c => `
                        <div class="autocomplete-item" data-customer-id="${c.id}">
                            ${c.full_name} ${c.phone ? `<small>(${c.phone})</small>` : ''}
                        </div>
                    `).join('');
                }
                resultsDiv.style.display = 'block';

            } catch (error) {
                console.error('Erro geral na busca:', error);
            }
        }, 300);
    });

    resultsDiv.addEventListener('click', (e) => {
        const item = e.target.closest('.autocomplete-item');
        if (item && item.dataset.customerId) {
            const customerId = item.dataset.customerId;
            const customerName = item.textContent.split(' (')[0];
            const phoneMatch = item.textContent.match(/\(([^)]+)\)/);
            const customerPhone = phoneMatch ? phoneMatch[1] : '';

            searchInput.value = customerName;
            nameInput.value = customerName;
            phoneInput.value = customerPhone;
            customerIdInput.value = customerId;
            
            resultsDiv.style.display = 'none';
        }
    });
}

// Configurar autocomplete de clientes para edição de garantia
function setupEditWarrantyCustomerAutocomplete() {
    const searchInput = document.getElementById('edit-warranty-customer-search');
    const resultsDiv = document.getElementById('edit-warranty-customer-results');
    const nameInput = document.getElementById('edit-warranty-customer-name');
    const phoneInput = document.getElementById('edit-warranty-customer-phone');
    const customerIdInput = document.getElementById('edit-warranty-selected-customer-id');

    if (!searchInput || !resultsDiv) return;

    let searchTimeout;
    
    searchInput.addEventListener('input', async (e) => {
        clearTimeout(searchTimeout);
        searchTimeout = setTimeout(async () => {
            const query = e.target.value.trim();

            if (query.length < 2) {
                resultsDiv.innerHTML = '';
                resultsDiv.style.display = 'none';
                return;
            }

            try {
                const { data: customers, error } = await supabase
                    .from('customers')
                    .select('id, full_name, phone')
                    .ilike('full_name', `%${query}%`)
                    .limit(5);

                if (error) {
                    console.error('Erro na busca de clientes:', error);
                    return;
                }

                if (customers.length === 0) {
                    resultsDiv.innerHTML = '<div class="autocomplete-item">Nenhum cliente encontrado</div>';
                } else {
                    resultsDiv.innerHTML = customers.map(c => `
                        <div class="autocomplete-item" data-customer-id="${c.id}">
                            ${c.full_name} ${c.phone ? `<small>(${c.phone})</small>` : ''}
                        </div>
                    `).join('');
                }
                resultsDiv.style.display = 'block';

            } catch (error) {
                console.error('Erro geral na busca:', error);
            }
        }, 300);
    });

    resultsDiv.addEventListener('click', (e) => {
        const item = e.target.closest('.autocomplete-item');
        if (item && item.dataset.customerId) {
            const customerId = item.dataset.customerId;
            const customerName = item.textContent.split(' (')[0];
            const phoneMatch = item.textContent.match(/\(([^)]+)\)/);
            const customerPhone = phoneMatch ? phoneMatch[1] : '';

            searchInput.value = customerName;
            nameInput.value = customerName;
            phoneInput.value = customerPhone;
            customerIdInput.value = customerId;
            
            resultsDiv.style.display = 'none';
        }
    });
}

// Configurar formatação de valores para garantia
function setupWarrantyValueFormatting() {
    const valueInputs = [
        'warranty-total-value',
        'edit-warranty-total-value'
    ];

    valueInputs.forEach(inputId => {
        const input = document.getElementById(inputId);
        if (input) {
            input.addEventListener('input', function(e) {
                let value = e.target.value.replace(/\D/g, '');
                if (value) {
                    value = (parseInt(value) / 100).toFixed(2);
                    value = value.replace('.', ',');
                    value = value.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
                }
                e.target.value = value;
            });
        }
    });
}

// Imprimir garantia
async function printWarranty(warrantyId) {
    try {
        const { data: warranty, error } = await supabase
            .from('warranties')
            .select('*')
            .eq('id', warrantyId)
            .single();

        if (error || !warranty) {
            showToast('Erro ao buscar dados da garantia para impressão', 'error');
            return;
        }

        // Buscar logo customizada do Supabase (mesmo processo da OS)
        let logoUrl = null;
        try {
            const logoPaths = [
                `public/store_${getSelectedStoreId() || 1}/print-logo.png`,
        `public/store_${getSelectedStoreId() || 1}/print-logo.jpg`,
        `public/store_${getSelectedStoreId() || 1}/logo.png`,
                `public/print_logo.png`,
                `public/logo.png`
            ];

            for (const path of logoPaths) {
                const { data: urlData } = await supabase.storage.from('assets').getPublicUrl(path);
                if (urlData && urlData.publicUrl) {
                    try {
                        const response = await fetch(urlData.publicUrl, { method: 'HEAD' });
                        if (response.ok) {
                            logoUrl = urlData.publicUrl;
                            break;
                        }
                    } catch (e) { /* ignore fetch errors */ }
                }
            }
        } catch (logoError) {
            console.log('Erro ao buscar logo customizada:', logoError);
        }

        warranty.logoUrl = logoUrl;

        // Salvar no localStorage para o template de impressão
        localStorage.setItem('currentWarranty_for_print', JSON.stringify(warranty));
        
        // Abrir janela de impressão usando template dedicado
        window.open('print-warranty-template.html', '_blank');
        
        showToast(`Garantia #${warrantyId} enviada para impressão`, 'success');

    } catch (error) {
        console.error('Erro ao imprimir garantia:', error);
        showToast('Erro ao preparar impressão da garantia', 'error');
    }
}

// NOVO: Função para reabrir um caixa fechado
window.reopenCashRegister = async function(cashRegisterId) {
    console.log('🔄 reopenCashRegister chamada com ID:', cashRegisterId);
    
    if (!cashRegisterId) {
        showToast('ID do caixa inválido.', 'error');
        return;
    }

    if (!confirm(`Tem certeza que deseja reabrir o caixa #${cashRegisterId}? O saldo de fechamento será zerado.`)) {
        return;
    }

    try {
        // Primeiro, verifica se já existe um caixa aberto para evitar conflitos
        const { data: openCash, error: checkError } = await supabase
            .from('cash_registers')
            .select('id')
            .eq('status', 'open')
            .eq('store_id', getSelectedStoreId());

        if (checkError) throw checkError;

        if (openCash.length > 0) {
            showToast('Já existe um caixa aberto. Feche-o antes de reabrir outro.', 'error');
            return;
        }

        // Reabre o caixa
        const { error: updateError } = await supabase
            .from('cash_registers')
            .update({
                status: 'open',
                closed_at: null,
                closing_balance: null,
                counted_balance: null,
                difference: null,
                closed_by_user_id: null
            })
            .eq('id', cashRegisterId);

        if (updateError) throw updateError;

        showToast(`Caixa #${cashRegisterId} reaberto com sucesso!`, 'success');
        
        // Recarrega o módulo do caixa para refletir o estado reaberto
        await initializeCashRegisterModule();
            
        } catch (error) {
        console.error('Erro ao reabrir caixa:', error);
        showToast(`Erro ao reabrir caixa: ${error.message}`, 'error');
    }
}

// ========================================
// SISTEMA DE TROCA DE SENHA
// ========================================

function initializePasswordChange() {
    const passwordForm = document.getElementById('change-password-form');
    if (!passwordForm) return;

    const currentPasswordInput = document.getElementById('current-password');
    const newPasswordInput = document.getElementById('new-password');
    const confirmPasswordInput = document.getElementById('confirm-password');
    const reqLength = document.getElementById('req-length');
    const reqMatch = document.getElementById('req-match');
    const reqDifferent = document.getElementById('req-different');
    
    // Toggle de visibilidade da senha
    document.querySelectorAll('.password-toggle-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const targetId = this.getAttribute('data-target');
            const input = document.getElementById(targetId);
            const icon = this.querySelector('.toggle-icon');
            
            if (input.type === 'password') {
                input.type = 'text';
                icon.textContent = '🙈';
            } else {
                input.type = 'password';
                icon.textContent = '👁️';
            }
        });
    });

    // Validação em tempo real
    function validatePasswords() {
        const currentPassword = currentPasswordInput.value;
        const newPassword = newPasswordInput.value;
        const confirmPassword = confirmPasswordInput.value;
        
        // Validar comprimento
        if (newPassword.length >= 6) {
            reqLength.classList.add('valid');
            reqLength.classList.remove('invalid');
        } else {
            reqLength.classList.add('invalid');
            reqLength.classList.remove('valid');
        }
        
        // Validar se senhas coincidem
        if (newPassword && confirmPassword && newPassword === confirmPassword) {
            reqMatch.classList.add('valid');
            reqMatch.classList.remove('invalid');
            confirmPasswordInput.parentElement.parentElement.classList.add('success');
            confirmPasswordInput.parentElement.parentElement.classList.remove('error');
        } else if (confirmPassword) {
            reqMatch.classList.add('invalid');
            reqMatch.classList.remove('valid');
            confirmPasswordInput.parentElement.parentElement.classList.add('error');
            confirmPasswordInput.parentElement.parentElement.classList.remove('success');
        } else {
            reqMatch.classList.remove('valid', 'invalid');
            confirmPasswordInput.parentElement.parentElement.classList.remove('error', 'success');
        }
        
        // Validar se a nova senha é diferente da atual
        if (currentPassword && newPassword) {
            if (currentPassword === newPassword) {
                reqDifferent.classList.add('invalid');
                reqDifferent.classList.remove('valid');
                newPasswordInput.parentElement.parentElement.classList.add('error');
                newPasswordInput.parentElement.parentElement.classList.remove('success');
            } else {
                reqDifferent.classList.add('valid');
                reqDifferent.classList.remove('invalid');
                newPasswordInput.parentElement.parentElement.classList.remove('error');
                if (newPassword.length >= 6) {
                    newPasswordInput.parentElement.parentElement.classList.add('success');
                }
            }
        } else {
            reqDifferent.classList.remove('valid', 'invalid');
        }
    }

    currentPasswordInput.addEventListener('input', validatePasswords);
    newPasswordInput.addEventListener('input', validatePasswords);
    confirmPasswordInput.addEventListener('input', validatePasswords);

    // Processar formulário
    passwordForm.addEventListener('submit', async function(event) {
        event.preventDefault();
        
        const currentPassword = currentPasswordInput.value;
        const newPassword = newPasswordInput.value;
        const confirmPassword = confirmPasswordInput.value;
        
        // Validações
        if (!currentPassword) {
            showToast('Por favor, digite sua senha atual.', 'error');
            return;
        }
        
        if (newPassword.length < 6) {
            showToast('A senha deve ter pelo menos 6 caracteres.', 'error');
            return;
        }
        
        if (newPassword !== confirmPassword) {
            showToast('As senhas não coincidem.', 'error');
            return;
        }
        
        if (currentPassword === newPassword) {
            showToast('A nova senha deve ser diferente da senha atual.', 'error');
            return;
        }
        
        const submitBtn = passwordForm.querySelector('button[type="submit"]');
        const originalText = submitBtn.textContent;
        submitBtn.textContent = '🔄 Alterando...';
        submitBtn.disabled = true;
        
        try {
            // Primeiro, verificar se a senha atual está correta
            const { error: signInError } = await supabase.auth.signInWithPassword({
                email: getCurrentUser()?.email,
                password: currentPassword
            });
            
            if (signInError) {
                showToast('Senha atual incorreta.', 'error');
                return;
            }
            
            // Alterar senha via Supabase Auth
            const { error } = await supabase.auth.updateUser({
                password: newPassword
            });
            
            if (error) throw error;
            
            showToast('Senha alterada com sucesso!', 'success');
            passwordForm.reset();
            
            // Remover classes de validação
            document.querySelectorAll('.requirements-list li').forEach(li => {
                li.classList.remove('valid', 'invalid');
            });
            
        } catch (error) {
            console.error('Erro ao alterar senha:', error);
            showToast(`Erro ao alterar senha: ${error.message}`, 'error');
        } finally {
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
        }
    });
}

// ========================================
// FUNÇÕES PARA EDIÇÃO E REMOÇÃO DE PRODUTOS NA OS
// ========================================



// A função saveEditedOSProduct já está importada de serviceOrders.js

// Função para editar preço/quantidade do produto na OS
window.editOSProductPrice = function(productId) {
    const productDiv = document.querySelector(`.product-item[data-product-id="${productId}"]`);
    if (!productDiv) {
        console.error('Produto não encontrado:', productId);
        return;
    }
    
    const productNameElement = productDiv.querySelector('.product-info strong');
    if (!productNameElement) {
        console.error('Elemento strong não encontrado no produto');
        return;
    }
    
    const productName = productNameElement.textContent;
    const currentQty = productDiv.dataset.quantity;
    const currentPrice = productDiv.dataset.price;
    
    // Criar produto fictício para usar o modal (sem controle de estoque na edição)
    const product = {
        id: productId,
        name: productName,
        price: parseFloat(currentPrice),
        stock: 0,
        track_stock: false // Não controlar estoque na edição
    };
    
    // Armazenar referência para edição
    window.selectedProductForOS = product;
    window.editingProductDiv = productDiv;
    
    // Abrir modal com valores atuais
    const modal = document.getElementById('add-product-modal');
    if (!modal) return;
    
    // Alterar título do modal
    modal.querySelector('h2').textContent = '✏️ Editar Produto da OS';
    
    // Preencher informações (sem controle de estoque para edição)
    document.getElementById('selected-product-name').textContent = productName;
    document.getElementById('selected-product-stock').textContent = '∞';
    document.getElementById('selected-product-price').textContent = `R$ ${parseFloat(currentPrice).toFixed(2)}`;
    
    // Configurar modal para não controlar estoque na edição
    modal.dataset.trackStock = 'false';
    modal.dataset.actualStock = '0';
    
    // Preencher valores atuais
    document.getElementById('product-quantity').value = currentQty;
    
    // Formatar preço atual corretamente
    const formattedCurrentPrice = formatPriceForDisplay(parseFloat(currentPrice));
    document.getElementById('product-custom-price').value = formattedCurrentPrice;
    
    // Atualizar subtotal
    updateProductTotal();
    
    // Alterar texto do botão
    const confirmBtn = modal.querySelector('.btn-primary');
    confirmBtn.textContent = '💾 Salvar Alterações';
    confirmBtn.onclick = () => saveEditedOSProduct(productId);
    
    // Exibir modal
    modal.style.display = 'flex';
    
    // Focar no campo de quantidade
    setTimeout(() => {
        document.getElementById('product-quantity').focus();
    }, 100);
};

// Função para remover produto da OS
window.removeOSProduct = function(productId) {
    const productDiv = document.querySelector(`.product-item[data-product-id="${productId}"]`);
    if (!productDiv) {
        console.error('Produto não encontrado:', productId);
        return;
    }
    
    const productNameElement = productDiv.querySelector('.product-info strong');
    if (!productNameElement) {
        console.error('Elemento strong não encontrado no produto');
        return;
    }
    
    const productName = productNameElement.textContent;
    
    if (confirm(`Remover "${productName}" da OS?`)) {
        productDiv.remove();
        updateOSTotal(); // Atualizar total da OS
        showToast(`Produto "${productName}" removido!`, 'success');
    }
};

// ========================================
// FUNÇÕES DO MODAL DE NOVO CLIENTE (PARA OS)
// ========================================

// Função para abrir o modal de novo cliente
function openNewCustomerModal() {
    console.log('🚀 openNewCustomerModal chamada!');
    const modal = document.getElementById('new-customer-modal');
    console.log('🔍 Modal encontrado:', modal);
    if (!modal) {
        console.error('❌ Modal de novo cliente não encontrado');
        return;
    }
    
    // Limpar formulário
    const form = document.getElementById('new-customer-modal-form');
    if (form) form.reset();
    
    // Exibir modal
    modal.style.display = 'flex';
    console.log('✅ Modal exibido com display:', modal.style.display);
    
    // Configurar máscaras de telefone e CEP
    setupCustomerModalMasks();
    
    // Focar no primeiro campo
    setTimeout(() => {
        const nameInput = document.getElementById('modal-new-customer-name');
        if (nameInput) nameInput.focus();
    }, 100);
}

// Função para fechar o modal de novo cliente
function closeNewCustomerModal() {
    const modal = document.getElementById('new-customer-modal');
    if (modal) {
        modal.style.display = 'none';
    }
}

// Função para configurar máscaras no modal de cliente
function setupCustomerModalMasks() {
    // Máscara de telefone
    const phoneInput = document.getElementById('modal-new-customer-phone');
    if (phoneInput) {
        phoneInput.addEventListener('input', function(e) {
            let value = e.target.value.replace(/\D/g, '');
            
            // Limitar a 11 dígitos
            if (value.length > 11) {
                value = value.slice(0, 11);
            }
            
            // Aplicar formatação baseada no tamanho
            if (value.length >= 11) {
                // Celular com 9 dígitos: (XX) XXXXX-XXXX
                value = value.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
            } else if (value.length >= 10) {
                // Fixo ou celular antigo: (XX) XXXX-XXXX
                value = value.replace(/(\d{2})(\d{4})(\d{4})/, '($1) $2-$3');
            } else if (value.length >= 6) {
                // Formatação parcial: (XX) XXXX-X
                value = value.replace(/(\d{2})(\d{4})(\d{0,4})/, '($1) $2-$3');
            } else if (value.length >= 2) {
                // Formatação parcial: (XX) X
                value = value.replace(/(\d{2})(\d{0,5})/, '($1) $2');
            } else if (value.length >= 1) {
                // Formatação parcial: (X
                value = value.replace(/(\d{0,2})/, '($1');
            }
            
            e.target.value = value;
        });
    }
    
    // Máscara de CEP
    const zipInput = document.getElementById('modal-new-customer-zip');
    if (zipInput) {
        zipInput.addEventListener('input', function(e) {
            let value = e.target.value.replace(/\D/g, '');
            if (value.length <= 8) {
                value = value.replace(/(\d{5})(\d{3})/, '$1-$2');
            }
            e.target.value = value;
        });
        
        // Buscar endereço por CEP
        zipInput.addEventListener('blur', async function(e) {
            const cep = e.target.value.replace(/\D/g, '');
            if (cep.length === 8) {
                await fetchAddressByModalCEP(cep);
            }
        });
    }
}

// Função para buscar endereço por CEP no modal
async function fetchAddressByModalCEP(cep) {
    try {
        const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
        const data = await response.json();
        
        if (!data.erro) {
            // Preencher campos de endereço
            const streetInput = document.getElementById('modal-new-customer-street');
            const neighborhoodInput = document.getElementById('modal-new-customer-neighborhood');
            const cityInput = document.getElementById('modal-new-customer-city');
            const stateInput = document.getElementById('modal-new-customer-state');
            
            if (streetInput && data.logradouro) streetInput.value = data.logradouro;
            if (neighborhoodInput && data.bairro) neighborhoodInput.value = data.bairro;
            if (cityInput && data.localidade) cityInput.value = data.localidade;
            if (stateInput && data.uf) stateInput.value = data.uf;
            
            // Focar no campo número
            const numberInput = document.getElementById('modal-new-customer-number');
            if (numberInput) numberInput.focus();
        }
    } catch (error) {
        console.error('Erro ao buscar CEP:', error);
    }
}

// Função para salvar novo cliente do modal
async function saveNewCustomerFromModal() {
    const form = document.getElementById('new-customer-modal-form');
    if (!form) return;
    
    // Validar campos obrigatórios
    const nameInput = document.getElementById('modal-new-customer-name');
    if (!nameInput || !nameInput.value.trim()) {
        showToast('Nome é obrigatório!', 'error');
        if (nameInput) nameInput.focus();
        return;
    }
    
    try {
        // Coletar dados do formulário
        const customerData = {
            full_name: document.getElementById('modal-new-customer-name')?.value?.trim() || '',
            phone: document.getElementById('modal-new-customer-phone')?.value?.trim() || '',
            birth_date: document.getElementById('modal-new-customer-birth-date')?.value || null,
            address: {
                zip: document.getElementById('modal-new-customer-zip')?.value?.trim() || '',
                street: document.getElementById('modal-new-customer-street')?.value?.trim() || '',
                number: document.getElementById('modal-new-customer-number')?.value?.trim() || '',
                neighborhood: document.getElementById('modal-new-customer-neighborhood')?.value?.trim() || '',
                city: document.getElementById('modal-new-customer-city')?.value?.trim() || '',
                state: document.getElementById('modal-new-customer-state')?.value?.trim() || ''
            }
        };
        
        // Salvar no banco
        const { data, error } = await supabase
            .from('customers')
            .insert([customerData])
            .select()
            .single();
        
        if (error) throw error;
        
        // Sucesso - selecionar cliente automaticamente na OS
        const customerSearchInput = document.getElementById('os-customer-search');
        const selectedCustomerIdInput = document.getElementById('os-selected-customer-id');
        
        if (customerSearchInput && selectedCustomerIdInput) {
            customerSearchInput.value = data.full_name;
            selectedCustomerIdInput.value = data.id;
            
            // Limpar resultados de busca
            const resultsContainer = document.getElementById('os-customer-results');
            if (resultsContainer) {
                resultsContainer.innerHTML = '';
                resultsContainer.style.display = 'none';
            }
        }
        
        // Fechar modal
        closeNewCustomerModal();
        
        // Mostrar sucesso
        showToast(`Cliente "${data.full_name}" cadastrado e selecionado!`, 'success');
        
        // Focar no próximo campo da OS
        setTimeout(() => {
            const brandInput = document.getElementById('os-brand');
            if (brandInput) brandInput.focus();
        }, 100);
        
    } catch (error) {
        console.error('Erro ao salvar cliente:', error);
        showToast('Erro ao cadastrar cliente: ' + error.message, 'error');
    }
}

// Log de confirmação de carregamento completo do main.js
// Debug removido

