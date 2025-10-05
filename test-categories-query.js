// Teste direto da query de categorias
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://your-project.supabase.co';
const supabaseKey = 'your-anon-key';
const supabase = createClient(supabaseUrl, supabaseKey);

async function testCategoriesQuery() {
    console.log('=== TESTE DIRETO DE CATEGORIAS ===');
    
    try {
        // Teste 1: Buscar todas as categorias sem filtro
        console.log('1. Buscando TODAS as categorias...');
        const { data: allCategories, error: allError } = await supabase
            .from('categories')
            .select('*');
        
        console.log('Todas as categorias:', allCategories);
        console.log('Erro (se houver):', allError);
        
        // Teste 2: Buscar categorias por store_id = 1
        console.log('2. Buscando categorias para store_id = 1...');
        const { data: store1Categories, error: store1Error } = await supabase
            .from('categories')
            .select('*')
            .eq('store_id', 1);
        
        console.log('Categorias store_id=1:', store1Categories);
        console.log('Erro (se houver):', store1Error);
        
        // Teste 3: Buscar categorias por store_id = "1" (string)
        console.log('3. Buscando categorias para store_id = "1" (string)...');
        const { data: store1StringCategories, error: store1StringError } = await supabase
            .from('categories')
            .select('*')
            .eq('store_id', '1');
        
        console.log('Categorias store_id="1":', store1StringCategories);
        console.log('Erro (se houver):', store1StringError);
        
        // Teste 4: Verificar estrutura da tabela
        console.log('4. Verificando estrutura da tabela...');
        const { data: sampleCategory, error: sampleError } = await supabase
            .from('categories')
            .select('*')
            .limit(1)
            .single();
        
        console.log('Exemplo de categoria:', sampleCategory);
        console.log('Erro (se houver):', sampleError);
        
    } catch (error) {
        console.error('Erro geral no teste:', error);
    }
}

// Executar teste quando a página carregar
if (typeof window !== 'undefined') {
    window.testCategoriesQuery = testCategoriesQuery;
    console.log('Função testCategoriesQuery disponível. Execute: testCategoriesQuery()');
}