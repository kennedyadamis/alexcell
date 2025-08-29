import { supabase } from '../api/supabase.js';
import { dbSelect, dbUpdate } from '../utils/authInterceptor.js';
import { showToast } from '../utils/utils.js'; // Assumindo que showToast será movido para utils.js, se ainda não foi

export async function fillUserPermissionsList(userId) {
    const container = document.getElementById('user-permissions-list');
    if (!container) return;
    container.innerHTML = '<p>Carregando permissões...</p>';
    try {
        const { data: userPermissions, error } = await dbSelect('user_store_permissions', {
            select: 'id, can_manage_os, can_manage_pdv, can_manage_cash, can_manage_stock, can_view_reports, can_manage_users, can_manage_cost_prices, can_manage_os_expiration, store_id',
            eq: { user_id: userId }
        });

        if (error) {
            throw error;
        }

        if (userPermissions.length === 0) {
            container.innerHTML = '<p>Nenhuma permissão encontrada para este usuário.</p>';
            return;
        }

        container.innerHTML = ''; // Limpa o carregador
        userPermissions.forEach(p => {
            // const loja = p.stores?.name || 'Loja'; // Removido pois não há relacionamento stores(name)
            const loja = `Loja ID: ${p.store_id}`; // Exibe o ID da loja ou personalize conforme necessário
            const group = document.createElement('div');
            group.className = 'permission-store-group';
            group.innerHTML = `
                <div class="permission-store-title">${loja}</div>
                <div class="permission-grid">
                    <div class="permission-item"><input type="checkbox" id="perm-os-${p.id}" ${p.can_manage_os ? 'checked' : ''}><label for="perm-os-${p.id}">Gerenciar OS</label></div>
                    <div class="permission-item"><input type="checkbox" id="perm-pdv-${p.id}" ${p.can_manage_pdv ? 'checked' : ''}><label for="perm-pdv-${p.id}">PDV</label></div>
                    <div class="permission-item"><input type="checkbox" id="perm-caixa-${p.id}" ${p.can_manage_cash ? 'checked' : ''}><label for="perm-caixa-${p.id}">Caixa</label></div>
                    <div class="permission-item"><input type="checkbox" id="perm-estoque-${p.id}" ${p.can_manage_stock ? 'checked' : ''}><label for="perm-estoque-${p.id}">Estoque</label></div>
                    <div class="permission-item"><input type="checkbox" id="perm-relatorios-${p.id}" ${p.can_view_reports ? 'checked' : ''}><label for="perm-relatorios-${p.id}">Relatórios</label></div>
                    <div class="permission-item"><input type="checkbox" id="perm-garantia-${p.id}" ${p.can_manage_users ? 'checked' : ''}><label for="perm-garantia-${p.id}">Garantia</label></div>
                    <div class="permission-item"><input type="checkbox" id="perm-custo-${p.id}" ${p.can_manage_cost_prices ? 'checked' : ''}><label for="perm-custo-${p.id}">Preços de Custo</label></div>
                    <div class="permission-item"><input type="checkbox" id="perm-expiracao-${p.id}" ${p.can_manage_os_expiration ? 'checked' : ''}><label for="perm-expiracao-${p.id}">Expiração de OS</label></div>

                </div>
            `;
            container.appendChild(group);
        });
    } catch (err) {
        container.innerHTML = `<p>Erro ao carregar permissões: ${err.message}</p>`;
    }
}

export function openEditUserModal(userId) {
    // Abrir o modal de edição
    const modal = document.getElementById('edit-permissions-modal');
    if (!modal) return;
    modal.style.display = 'flex'; // Garantir centralização
    // Buscar dados do usuário e preencher o formulário
    dbSelect('profiles', {
        select: 'id, full_name, email, role',
        eq: { id: userId },
        single: true
    }).then(({ data: user, error }) => {
            if (error || !user) {
                alert('Erro ao buscar usuário para edição.');
                return;
            }
            if (document.getElementById('edit-permissions-user-id')) {
                document.getElementById('edit-permissions-user-id').value = user.id;
            }
            if (document.getElementById('edit-user-role')) {
                document.getElementById('edit-user-role').value = user.role;
            }
            document.getElementById('edit-permissions-title').textContent = `Editar Permissões: ${user.full_name || user.email}`;
            fillUserPermissionsList(user.id);
        });
}

const editPermissionsForm = document.getElementById('edit-permissions-form');
if (editPermissionsForm) {
    editPermissionsForm.addEventListener('submit', async function(event) {
        event.preventDefault();
        const userId = document.getElementById('edit-permissions-user-id')?.value || '';
        const role = document.getElementById('edit-user-role')?.value || '';
        // Coletar permissões por loja
        const permissionGroups = document.querySelectorAll('.permission-store-group');
        for (const group of permissionGroups) {
            // O id da permissão está no id dos checkboxes, ex: perm-os-9
            const permId = group.querySelector('input[type="checkbox"]').id.split('-').pop();
            const can_manage_os = group.querySelector(`#perm-os-${permId}`)?.checked || false;
            const can_manage_pdv = group.querySelector(`#perm-pdv-${permId}`)?.checked || false;
            const can_manage_cash = group.querySelector(`#perm-caixa-${permId}`)?.checked || false;
            const can_manage_stock = group.querySelector(`#perm-estoque-${permId}`)?.checked || false;
            const can_view_reports = group.querySelector(`#perm-relatorios-${permId}`)?.checked || false;
            const can_manage_users = group.querySelector(`#perm-garantia-${permId}`)?.checked || false;
            const can_manage_cost_prices = group.querySelector(`#perm-custo-${permId}`)?.checked || false;
            const can_manage_os_expiration = group.querySelector(`#perm-expiracao-${permId}`)?.checked || false;
            // Salvando permissões no banco de dados
            // Atualizar permissões no Supabase
            const { error } = await dbUpdate('user_store_permissions', {
                can_manage_os,
                can_manage_pdv,
                can_manage_cash,
                can_manage_stock,
                can_view_reports,
                can_manage_users,
                can_manage_cost_prices,
                can_manage_os_expiration
            }, { eq: { id: permId } });
            if (error) {
                showToast('Erro ao salvar permissões: ' + error.message, 'error');
                return;
            }
        }
        // Atualizar role do usuário
        const { error: roleError } = await dbUpdate('profiles', { role }, { eq: { id: userId } });
        if (roleError) {
            showToast('Erro ao salvar função: ' + roleError.message, 'error');
            return;
        }
        showToast('Permissões salvas com sucesso!', 'success');
        document.getElementById('edit-permissions-modal').style.display = 'none';
        // A função loadAllUsersAndPermissions deve ser chamada do módulo principal
        // já que ela carrega todos os usuários, não apenas as permissões de um único usuário.
        // É responsabilidade do chamador inicializar ou recarregar a lista principal de usuários.
        // Portanto, NÃO chame loadAllUsersAndPermissions() aqui.
    });
}