import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://dvfldedemzgdnfhxtzro.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImR2ZmxkZWRlbXpnZG5maHh0enJvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTA4NzUzMTcsImV4cCI6MjA2NjQ1MTMxN30.6WxpY73KFvZTtvjyT6YYOWpHJZ-bmNY_FyhbiqgHRec';

const supabase = createClient(supabaseUrl, supabaseKey);

async function testConnection() {
    try {
        console.log('Testando conexão com Supabase...');
        
        // Teste 1: Verificar conexão básica
        const { data: testData, error: testError } = await supabase
            .from('stores')
            .select('*');
            
        if (testError) {
            console.error('Erro ao conectar:', testError);
            return;
        }
        
        console.log('✅ Conexão estabelecida com sucesso!');
        console.log('Lojas encontradas:', testData.length);
        console.log('Dados das lojas:', testData);
        
        // Teste 2: Verificar se as tabelas existem
        const { data: tablesData, error: tablesError } = await supabase
            .from('products')
            .select('count(*)', { count: 'exact' });
            
        if (tablesError) {
            console.error('Erro ao acessar tabela products:', tablesError);
        } else {
            console.log('✅ Tabela products acessível');
        }
        
    } catch (error) {
        console.error('Erro geral:', error);
    }
}

testConnection();