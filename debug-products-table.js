import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://dvfldedemzgdnfhxtzro.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImR2ZmxkZWRlbXpnZG5maHh0enJvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTA4NzUzMTcsImV4cCI6MjA2NjQ1MTMxN30.6WxpY73KFvZTtvjyT6YYOWpHJZ-bmNY_FyhbiqgHRec';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function checkProductsTable() {
  try {
    // Verificar produto com ID 589 que apareceu como "Produto sem nome"
    const { data: product589, error: error589 } = await supabase
      .from('products')
      .select('*')
      .eq('id', 589)
      .single();
    
    if (error589) {
      console.error('Erro ao buscar produto 589:', error589);
    } else {
      console.log('=== PRODUTO ID 589 ===');
      console.log('Nome:', product589.name);
      console.log('Dados completos:', product589);
    }
    
    // Verificar alguns produtos aleatórios
    const { data: randomProducts, error: randomError } = await supabase
      .from('products')
      .select('id, name, price, cost_price')
      .limit(10);
    
    if (randomError) {
      console.error('Erro ao buscar produtos aleatórios:', randomError);
    } else {
      console.log('\n=== PRODUTOS ALEATÓRIOS ===');
      randomProducts.forEach(product => {
        console.log(`ID: ${product.id}, Nome: "${product.name}", Preço: ${product.price}`);
      });
    }
    
    // Verificar produtos sem nome
    const { data: noNameProducts, error: noNameError } = await supabase
      .from('products')
      .select('id, name, price, cost_price')
      .or('name.is.null,name.eq.')
      .limit(5);
    
    if (noNameError) {
      console.error('Erro ao buscar produtos sem nome:', noNameError);
    } else {
      console.log('\n=== PRODUTOS SEM NOME ===');
      console.log(`Encontrados ${noNameProducts.length} produtos sem nome:`);
      noNameProducts.forEach(product => {
        console.log(`ID: ${product.id}, Nome: "${product.name}", Preço: ${product.price}`);
      });
    }
    
  } catch (error) {
    console.error('Erro geral:', error);
  }
}

checkProductsTable();