import XLSX from 'xlsx';
import { createClient } from '@supabase/supabase-js';

// Configuração do Supabase
const supabaseUrl = 'https://dvfldedemzgdnfhxtzro.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImR2ZmxkZWRlbXpnZG5maHh0enJvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTA4NzUzMTcsImV4cCI6MjA2NjQ1MTMxN30.6WxpY73KFvZTtvjyT6YYOWpHJZ-bmNY_FyhbiqgHRec';
const supabase = createClient(supabaseUrl, supabaseKey);

// Função para calcular preço de venda baseado no custo
function calculateSalePrice(cost) {
    const costValue = parseFloat(cost);
    
    if (costValue < 65) {
        return costValue * 2.5; // +150%
    } else if (costValue >= 66 && costValue <= 80) {
        return costValue * 2.1; // +110%
    } else if (costValue > 80 && costValue <= 120) {
        return costValue * 2.3; // +130%
    } else {
        return costValue * 2.0; // +100%
    }
}

// Função para normalizar nome da categoria
function normalizeCategory(category) {
    if (!category) return 'Geral';
    
    return category
        .toString()
        .trim()
        .toLowerCase()
        .replace(/[áàâãä]/g, 'a')
        .replace(/[éèêë]/g, 'e')
        .replace(/[íìîï]/g, 'i')
        .replace(/[óòôõö]/g, 'o')
        .replace(/[úùûü]/g, 'u')
        .replace(/[ç]/g, 'c')
        .replace(/[^a-z0-9\s]/g, '')
        .replace(/\s+/g, ' ')
        .trim();
}

// Função para criar categoria se não existir
async function getOrCreateCategory(categoryName) {
    const normalizedName = normalizeCategory(categoryName);
    
    // Verificar se categoria já existe
    const { data: existingCategory } = await supabase
        .from('categories')
        .select('id')
        .eq('name', normalizedName)
        .single();
    
    if (existingCategory) {
        return existingCategory.id;
    }
    
    // Criar nova categoria
    const { data: newCategory, error } = await supabase
        .from('categories')
        .insert([{ name: normalizedName }])
        .select('id')
        .single();
    
    if (error) {
        console.error('Erro ao criar categoria:', error);
        return null;
    }
    
    return newCategory.id;
}

// Função principal para importar produtos
async function importAllProducts() {
    try {
        console.log('🔍 Analisando planilha Excel...');
        
        // Ler arquivo Excel
        const workbook = XLSX.readFile('Tabela Tiaguinho cell.xlsx');
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        
        // Converter para JSON
        const data = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
        
        console.log(`📊 Encontradas ${data.length} linhas na planilha`);
        console.log('🔍 Primeiras 5 linhas:');
        data.slice(0, 5).forEach((row, index) => {
            console.log(`Linha ${index + 1}:`, row);
        });
        
        // Identificar cabeçalhos (assumindo que estão na primeira linha)
        const headers = data[0];
        console.log('📋 Cabeçalhos encontrados:', headers);
        
        // Processar dados (pular cabeçalho)
        const products = [];
        for (let i = 1; i < data.length; i++) {
            const row = data[i];
            if (!row || row.length === 0) continue;
            
            // Mapear dados baseado na estrutura comum de planilhas de produtos
            const product = {
                name: row[0] || `Produto ${i}`,
                sku: row[1] || `SKU${i}`,
                cost: parseFloat(row[2]) || 0,
                category: row[3] || 'Geral',
                brand: row[4] || '',
                description: row[5] || '',
                stock: parseInt(row[6]) || 0
            };
            
            // Calcular preço de venda
            product.salePrice = calculateSalePrice(product.cost);
            
            products.push(product);
        }
        
        console.log(`✅ ${products.length} produtos processados`);
        console.log('📋 Exemplo de produto processado:', products[0]);
        
        // Buscar lojas
        const { data: stores } = await supabase
            .from('stores')
            .select('id, name');
        
        console.log('🏪 Lojas encontradas:', stores);
        
        // Importar produtos para cada loja
        let totalImported = 0;
        
        for (const store of stores) {
            console.log(`\n🏪 Importando para loja: ${store.name}`);
            
            for (const product of products) {
                try {
                    // Criar categoria se necessário
                    const categoryId = await getOrCreateCategory(product.category);
                    
                    // Inserir produto
                    const { data: insertedProduct, error } = await supabase
                        .from('products')
                        .insert([{
                            name: product.name,
                            sku: `${product.sku}-${store.id}`,
                            price: product.salePrice,
                            cost_price: product.cost,
                            stock: product.stock,
                            category_id: categoryId,
                            store_id: store.id,
                            track_stock: true
                        }]);
                    
                    if (error) {
                        console.error(`❌ Erro ao inserir produto ${product.name}:`, error);
                    } else {
                        totalImported++;
                        console.log(`✅ ${product.name} - Custo: R$${product.cost.toFixed(2)} → Venda: R$${product.salePrice.toFixed(2)}`);
                    }
                } catch (err) {
                    console.error(`❌ Erro ao processar produto ${product.name}:`, err);
                }
            }
        }
        
        console.log(`\n🎉 Importação concluída! ${totalImported} produtos importados no total.`);
        
        // Mostrar estatísticas por faixa de margem
        const stats = {
            'Margem 150% (< R$65)': products.filter(p => p.cost < 65).length,
            'Margem 110% (R$66-80)': products.filter(p => p.cost >= 66 && p.cost <= 80).length,
            'Margem 130% (R$80-120)': products.filter(p => p.cost > 80 && p.cost <= 120).length,
            'Margem 100% (> R$120)': products.filter(p => p.cost > 120).length
        };
        
        console.log('\n📊 Estatísticas de margem aplicada:');
        Object.entries(stats).forEach(([range, count]) => {
            console.log(`${range}: ${count} produtos`);
        });
        
    } catch (error) {
        console.error('❌ Erro durante a importação:', error);
    }
}

// Executar importação
importAllProducts();

export { importAllProducts, calculateSalePrice, normalizeCategory };