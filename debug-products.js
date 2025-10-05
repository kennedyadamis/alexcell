import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://dvfldedemzgdnfhxtzro.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImR2ZmxkZWRlbXpnZG5maHh0enJvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTA4NzUzMTcsImV4cCI6MjA2NjQ1MTMxN30.6WxpY73KFvZTtvjyT6YYOWpHJZ-bmNY_FyhbiqgHRec';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function checkProducts() {
  try {
    const { data, error } = await supabase
      .from('service_orders')
      .select('id, products, created_at')
      .order('created_at', { ascending: false })
      .limit(5);
    
    if (error) {
      console.error('Erro:', error);
      return;
    }
    
    console.log('=== DADOS DOS PRODUTOS ===');
    data.forEach(os => {
      console.log(`\nOS ID: ${os.id}`);
      console.log(`Created at: ${os.created_at}`);
      console.log(`Products type: ${typeof os.products}`);
      console.log(`Products value:`, os.products);
      
      if (typeof os.products === 'string') {
        try {
          const parsed = JSON.parse(os.products);
          console.log('Parsed products:', parsed);
          if (Array.isArray(parsed)) {
            parsed.forEach((product, index) => {
              console.log(`  Produto ${index + 1}:`, {
                id: product.id,
                name: product.name,
                quantity: product.quantity,
                price: product.price
              });
            });
          }
        } catch (e) {
          console.log('Erro ao fazer parse:', e.message);
        }
      }
      console.log('---');
    });
  } catch (error) {
    console.error('Erro geral:', error);
  }
}

checkProducts();