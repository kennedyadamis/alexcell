import { supabase } from '../api/supabase.js';

// ========================================
// SISTEMA DE AUTENTICAÇÃO
// ========================================

export function initializeAuth() {
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
// FORMULÁRIOS DE AUTENTICAÇÃO
// ========================================

export function initializeAuthForms() {
    const loginForm = document.getElementById('login-form');

    // Formulário de Login
    if (loginForm) {
        loginForm.addEventListener('submit', function(event) {
            event.preventDefault();
            handleLogin();
        });
    }

    // Configurar toggle de visibilidade da senha
    const passwordToggleIcon = document.querySelector('.password-toggle-icon[data-target="login-password"]');
    if (passwordToggleIcon) {
        passwordToggleIcon.addEventListener('click', function() {
            const inputId = this.dataset.target;
            togglePasswordVisibility(inputId, this);
        });
    }
}

// ========================================
// MANIPULADORES DE AUTENTICAÇÃO
// ========================================

async function handleLogin() {
    const formData = {
        email: document.getElementById('login-email').value,
        password: document.getElementById('login-password').value,
    };

    if (!validateAuthForm(formData, 'login')) {
        return;
    }

    const submitButton = document.querySelector('#login-form button[type="submit"]');
    const originalText = submitButton.textContent;
    submitButton.textContent = 'Verificando...';
    submitButton.disabled = true;

    try {
        console.log('Tentando login com:', { email: formData.email });
        const { data, error } = await supabase.auth.signInWithPassword({
            email: formData.email,
            password: formData.password,
        });

        console.log('Resposta do Supabase:', { data, error });

        if (error) throw error;

        showAuthMessage('success', 'Login bem-sucedido! Redirecionando...');
        
        // Pequeno delay para garantir que o evento de autenticação seja processado
        setTimeout(() => {
            // Força o redirecionamento se o listener não funcionar
            const hasStorePermissions = sessionStorage.getItem('user_store_permissions');
            if (hasStorePermissions) {
                window.location.href = 'dashboard.html';
            } else {
                window.location.href = 'store-selector.html';
            }
        }, 1000);

    } catch (error) {
        console.error('Erro detalhado no login:', error);
        showAuthMessage('error', `Falha no login: ${error.message}`);
    } finally {
        submitButton.textContent = originalText;
        submitButton.disabled = false;
    }
}

// ========================================
// VALIDAÇÃO DE FORMULÁRIOS
// ========================================

function validateAuthForm(data, type) {
    hideAuthMessages();
    if (!data.email || !data.password) {
        showAuthMessage('error', 'Por favor, preencha todos os campos obrigatórios.');
        return false;
    }
    if (!isValidEmail(data.email)) {
        showAuthMessage('error', 'Por favor, insira um e-mail válido.');
        return false;
    }
    if (data.password.length < 6) {
        showAuthMessage('error', 'A senha deve ter pelo menos 6 caracteres.');
        return false;
    }
    return true;
}

function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// ========================================
// SISTEMA DE MENSAGENS
// ========================================

function showAuthMessage(type, message) {
    hideAuthMessages();
    const messageElement = type === 'error' 
        ? document.getElementById('auth-error-message')
        : document.getElementById('auth-success-message');
    const textElement = document.getElementById(type === 'error' ? 'error-message-text' : 'success-message-text');
    if (messageElement && textElement) {
        textElement.textContent = message;
        messageElement.classList.add('show');
        messageElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
        setTimeout(() => {
            messageElement.classList.remove('show');
        }, 8000);
    }
}

export function hideAuthMessages() {
    const successMessage = document.getElementById('auth-success-message');
    const errorMessage = document.getElementById('auth-error-message');
    if (successMessage) successMessage.classList.remove('show');
    if (errorMessage) errorMessage.classList.remove('show');
}

export function togglePasswordVisibility(inputId, icon) {
    const passwordInput = document.getElementById(inputId);
    if (passwordInput.type === 'password') {
        passwordInput.type = 'text';
        icon.textContent = '🙈';
    } else {
        passwordInput.type = 'password';
        icon.textContent = '��️';
    }
}

export async function checkOSAccess() {
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session) {
        alert('Você precisa fazer login para acessar a Ordem de Serviço.');
        window.location.href = 'auth.html';
    }
}
