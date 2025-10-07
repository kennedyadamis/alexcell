import { supabase } from '../api/supabase.js';
import { dbSelect } from '../utils/authInterceptor.js';
import { showToast, updatePaginationUI } from '../utils/utils.js';
import { openEditUserModal } from './userPermissions.js'; // Importa a função de abrir o modal

export function initializePermissionsModule() {
    // Inicialização do botão de criar novo usuário, se houver
    const btnCreateUser = document.getElementById('btn-create-user');
    if (btnCreateUser) {
        btnCreateUser.addEventListener('click', () => {
            openCreateUserModal();
        });
    }

    // Inicializar event listeners para modais
    initializeModalEventListeners();

    // Carregar todos os usuários e permissões ao inicializar o módulo
    loadAllUsersAndPermissions();
}

export async function loadAllUsersAndPermissions() {
    const userListBody = document.getElementById('user-permissions-list-body');
    if (!userListBody) {
        return;
    }

    userListBody.innerHTML = '<tr><td colspan="4" class="text-center">Carregando usuários...</td></tr>';

    try {
        const { data: users, error } = await dbSelect('profiles', {
            select: 'id, full_name, email, role',
            order: { column: 'full_name', ascending: true }
        });

        if (error) throw error;

        if (!users || users.length === 0) {
            userListBody.innerHTML = '<tr><td colspan="4" class="text-center">Nenhum usuário encontrado.</td></tr>';
            return;
        }

        userListBody.innerHTML = ''; // Limpa a tabela
        users.forEach(user => {
            const row = document.createElement('tr');
            const roleMap = {
                owner: 'Dono',
                admin: 'Administrador',
                technician: 'Técnico',
                employee: 'Funcionário'
            };
            const roleText = roleMap[user.role] || user.role || 'Indefinido';
            const roleClass = user.role || 'default';

            row.innerHTML = `
                <td>${user.full_name || 'Nome não fornecido'}</td>
                <td>${user.email}</td>
                <td><span class="user-role-badge ${roleClass}">${roleText}</span></td>
                <td class="os-actions">
                    <button class="btn btn-sm btn-outline-primary btn-edit-user-permissions" data-user-id="${user.id}">
                        Editar Permissões
                    </button>
                    ${user.role !== 'owner' ? `
                        <button class="btn btn-sm btn-outline-danger btn-delete-user" data-user-id="${user.id}" data-user-name="${user.full_name || user.email}">
                            Excluir
                        </button>
                    ` : ''}
                </td>
            `;
            userListBody.appendChild(row);
        });

        document.querySelectorAll('.btn-edit-user-permissions').forEach(button => {
            button.addEventListener('click', (e) => {
                const userId = e.currentTarget.getAttribute('data-user-id');
                if (userId) {
                    openEditUserModal(userId);
                }
            });
        });

        document.querySelectorAll('.btn-delete-user').forEach(button => {
            button.addEventListener('click', (e) => {
                const userId = e.currentTarget.getAttribute('data-user-id');
                const userName = e.currentTarget.getAttribute('data-user-name');
                if (userId && userName) {
                    confirmDeleteUser(userId, userName);
                }
            });
        });

    } catch (err) {
        console.error("Erro ao carregar usuários e permissões:", err);
        userListBody.innerHTML = `<tr><td colspan="4" class="text-center error-message">Erro ao carregar usuários: ${err.message}</td></tr>`;
        showToast('Falha ao carregar lista de usuários.', 'error');
    }
}

// Função para abrir o modal de criação de usuário
export function openCreateUserModal() {
    const modal = document.getElementById('create-user-modal');
    if (!modal) return;
    
    // Limpar o formulário
    const form = document.getElementById('create-user-form');
    if (form) {
        form.reset();
    }
    
    modal.style.display = 'flex';
}

// Função para fechar modais
function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.style.display = 'none';
    }
}

// Inicializar event listeners para modais
function initializeModalEventListeners() {
    // Event listeners para botões de fechar modal
    document.querySelectorAll('.close-modal-btn').forEach(btn => {
        // Remove listeners anteriores para evitar duplicação
        btn.removeEventListener('click', handleCloseModalClick);
        btn.addEventListener('click', handleCloseModalClick);
    });

    // Event listener para o formulário de criação de usuário
    const createUserForm = document.getElementById('create-user-form');
    if (createUserForm) {
        createUserForm.removeEventListener('submit', handleCreateUser);
        createUserForm.addEventListener('submit', handleCreateUser);
    }
}

// Função para lidar com cliques nos botões de fechar modal
function handleCloseModalClick(e) {
    const modalId = e.target.getAttribute('data-modal');
    if (modalId) {
        closeModal(modalId);
    } else {
        // Se não tem data-modal, tenta fechar o modal pai
        const modalOverlay = e.target.closest('.modal-overlay');
        if (modalOverlay) {
            modalOverlay.style.display = 'none';
        }
    }
}

// Função para lidar com cliques no overlay do modal
function handleOverlayClick(e) {
    if (e.target === e.currentTarget) {
        e.target.style.display = 'none';
    }
}

// Função para lidar com a criação de usuário
async function handleCreateUser(event) {
    event.preventDefault();
    
    const fullName = document.getElementById('new-user-full-name')?.value?.trim();
    const email = document.getElementById('new-user-email')?.value?.trim();
    const password = document.getElementById('new-user-password')?.value;
    const role = document.getElementById('new-user-system-role')?.value;
    
    // Validações básicas
    if (!fullName || !email || !password || !role) {
        showToast('Por favor, preencha todos os campos obrigatórios.', 'error');
        return;
    }
    
    if (password.length < 6) {
        showToast('A senha deve ter pelo menos 6 caracteres.', 'error');
        return;
    }
    
    // Validar formato do email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        showToast('Por favor, insira um e-mail válido.', 'error');
        return;
    }
    
    // Desabilitar botão durante o processo
    const submitBtn = event.target.querySelector('button[type="submit"]');
    const originalText = submitBtn?.textContent;
    if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.textContent = '⏳ Criando usuário...';
    }
    
    try {
        // Verificar se o email já existe
        const { data: existingUsers, error: checkError } = await supabase
            .from('profiles')
            .select('email')
            .eq('email', email);
        
        if (checkError) {
            console.warn('Erro ao verificar email existente:', checkError.message);
        }
        
        if (existingUsers && existingUsers.length > 0) {
            showToast('Este e-mail já está cadastrado no sistema.', 'error');
            return;
        }
        
        // Como não temos acesso à service_role key no frontend,
        // vamos usar o método de signup que está disponível para usuários anônimos
        const { data: authData, error: authError } = await supabase.auth.signUp({
            email: email,
            password: password,
            options: {
                data: {
                    full_name: fullName,
                    role: role
                }
            }
        });
        
        if (authError) {
            throw new Error(`Erro ao criar usuário: ${authError.message}`);
        }
        
        if (!authData.user) {
            throw new Error('Usuário não foi criado corretamente.');
        }
        
        // O perfil é criado automaticamente pelo trigger handle_new_user
        // Não é necessário criar ou atualizar manualmente
        
        showToast(`Usuário "${fullName}" criado com sucesso! 🎉`, 'success');
        closeModal('create-user-modal');
        
        // Limpar formulário
        const form = document.getElementById('create-user-form');
        if (form) {
            form.reset();
        }
        
        // Recarregar a lista de usuários
        loadAllUsersAndPermissions();
        
    } catch (error) {
         console.error('Erro ao criar usuário:', error);
         showToast(error.message || 'Erro ao criar usuário.', 'error');
     } finally {
        // Reabilitar botão
        if (submitBtn) {
            submitBtn.disabled = false;
            submitBtn.textContent = originalText;
        }
    }
 }

// Função para confirmar exclusão de usuário
function confirmDeleteUser(userId, userName) {
    // Preencher o modal com as informações do usuário
    const userNameDisplay = document.getElementById('delete-user-name');
    userNameDisplay.textContent = userName;
    
    // Mostrar o modal
    const modal = document.getElementById('delete-user-modal');
    modal.style.display = 'flex';
    
    // Configurar o botão de confirmação
    const confirmBtn = document.getElementById('confirm-delete-user');
    confirmBtn.onclick = () => {
        closeModal('delete-user-modal');
        deleteUser(userId, userName);
    };
}

// Função para excluir usuário
async function deleteUser(userId, userName) {
    try {
        // Chamar a Edge Function para exclusão completa
        const { data, error } = await supabase.functions.invoke('delete-user', {
            body: { userId: userId }
        });
        
        if (error) {
            throw new Error(`Erro ao excluir usuário: ${error.message}`);
        }
        
        if (data.error) {
            throw new Error(data.error);
        }
        
        showToast(`Usuário "${userName}" foi excluído completamente do sistema! 🗑️`, 'success');
        
        // Recarregar a lista de usuários
        loadAllUsersAndPermissions();
        
    } catch (error) {
        console.error('Erro ao excluir usuário:', error);
        showToast(error.message || 'Erro ao excluir usuário.', 'error');
    }
}