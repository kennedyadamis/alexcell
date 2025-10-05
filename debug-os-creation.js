import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://ixqvqjqjqjqjqjqjqjqj.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Iml4cXZxanFqcWpxanFqcWpxanFqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjU0NzE2NzUsImV4cCI6MjA0MTA0NzY3NX0.Ej5Ej5Ej5Ej5Ej5Ej5Ej5Ej5Ej5Ej5Ej5Ej5Ej5Ej5';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function debugOSCreation() {
    try {
        console.log('=== DEBUGANDO CRIAÇÃO DE OS ===');
        
        // Buscar as últimas 3 OS criadas
        const { data: orders, error } = await supabase
            .from('service_orders')
            .select('id, products, created_at')
            .order('created_at', { ascending: false })
            .limit(3);

        if (error) {
            console.error('Erro ao buscar OS:', error);
            return;
        }

        console.log(`\nEncontradas ${orders.length} OS:`);
        
        for (const order of orders) {
            console.log(`\n--- OS ID: ${order.id} ---`);
            console.log(`Criada em: ${order.created_at}`);
            console.log(`Tipo de products: ${typeof order.products}`);
            
            if (typeof order.products === 'string') {
                try {
                    const parsedProducts = JSON.parse(order.products);
                    console.log('Products (parsed):', parsedProducts);
                    
                    if (Array.isArray(parsedProducts)) {
                        parsedProducts.forEach((product, index) => {
                            console.log(`  Produto ${index + 1}:`);
                            console.log(`    ID: ${product.id}`);
                            console.log(`    Nome: "${product.name}"`);
                            console.log(`    Quantidade: ${product.quantity}`);
                            console.log(`    Preço: ${product.price}`);
                        });
                    }
                } catch (parseError) {
                    console.log('Erro ao fazer parse dos produtos:', parseError);
                    console.log('Products (raw string):', order.products);
                }
            } else if (Array.isArray(order.products)) {
                console.log('Products (array):', order.products);
                order.products.forEach((product, index) => {
                    console.log(`  Produto ${index + 1}:`);
                    console.log(`    ID: ${product.id}`);
                    console.log(`    Nome: "${product.name}"`);
                    console.log(`    Quantidade: ${product.quantity}`);
                    console.log(`    Preço: ${product.price}`);
                });
            } else {
                console.log('Products (other):', order.products);
            }
        }
        
    } catch (error) {
        console.error('Erro geral:', error);
    }
}

debugOSCreation();