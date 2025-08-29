-- Script para adicionar a coluna can_manage_os_expiration na tabela user_store_permissions
-- Execute este comando no painel SQL do Supabase

ALTER TABLE user_store_permissions 
ADD COLUMN can_manage_os_expiration BOOLEAN DEFAULT false;

-- Opcional: Atualizar registros existentes para dar permissão aos administradores
-- UPDATE user_store_permissions 
-- SET can_manage_os_expiration = true 
-- WHERE user_id IN (
--     SELECT id FROM profiles WHERE role IN ('owner', 'admin')
-- );

-- Verificar se a coluna foi adicionada corretamente
SELECT column_name, data_type, is_nullable, column_default 
FROM information_schema.columns 
WHERE table_name = 'user_store_permissions' 
AND column_name = 'can_manage_os_expiration';