import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://dvfldedemzgdnfhxtzro.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImR2ZmxkZWRlbXpnZG5maHh0enJvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTA4NzUzMTcsImV4cCI6MjA2NjQ1MTMxN30.6WxpY73KFvZTtvjyT6YYOWpHJZ-bmNY_FyhbiqgHRec';

const supabase = createClient(supabaseUrl, supabaseKey);

async function removeRemainingCategories() {
    console.log('🗑️ Removendo as categorias restantes...');
    
    const categoryIds = [274, 275, 276, 277, 278]; // IDs das categorias encontradas
    
    try {
        // Primeiro, verificar se há produtos associados a essas categorias
        console.log('🔍 Verificando produtos associados...');
        
        for (const categoryId of categoryIds) {
            const { data: products, error: productError } = await supabase
                .from('products')
                .select('id, name')
                .eq('category_id', categoryId);
                
            if (productError) {
                console.error(`❌ Erro ao verificar produtos da categoria ${categoryId}:`, productError);
                continue;
            }
            
            if (products && products.length > 0) {
                console.log(`⚠️ Categoria ${categoryId} tem ${products.length} produtos associados. Atualizando produtos...`);
                
                // Atualizar produtos para category_id = null
                const { error: updateError } = await supabase
                    .from('products')
                    .update({ category_id: null })
                    .eq('category_id', categoryId);
                    
                if (updateError) {
                    console.error(`❌ Erro ao atualizar produtos da categoria ${categoryId}:`, updateError);
                    continue;
                }
                
                console.log(`✅ ${products.length} produtos da categoria ${categoryId} atualizados para sem categoria`);
            } else {
                console.log(`✅ Categoria ${categoryId} não tem produtos associados`);
            }
        }
        
        // Agora remover as categorias
        console.log('🗑️ Removendo categorias...');
        
        const { data: deletedCategories, error: deleteError } = await supabase
            .from('categories')
            .delete()
            .in('id', categoryIds)
            .select();
            
        if (deleteError) {
            console.error('❌ Erro ao remover categorias:', deleteError);
            return;
        }
        
        console.log(`✅ ${deletedCategories.length} categorias removidas com sucesso:`);
        deletedCategories.forEach(cat => {
            console.log(`- ID: ${cat.id}, Nome: "${cat.name}"`);
        });
        
    } catch (err) {
        console.error('❌ Erro na remoção:', err);
    }
}

removeRemainingCategories();