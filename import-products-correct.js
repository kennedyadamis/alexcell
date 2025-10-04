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
        
        // Converter para JSON como array
        const data = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
        
        console.log(`📊 Encontradas ${data.length} linhas na planilha`);
        
        // Buscar lojas
        const { data: stores, error: storesError } = await supabase
            .from('stores')
            .select('id, name');
        
        if (storesError) {
            console.error('❌ Erro ao buscar lojas:', storesError);
            return;
        }
        
        console.log('🏪 Lojas encontradas:', stores);
        
        if (!stores || stores.length === 0) {
            console.error('❌ Nenhuma loja encontrada no banco de dados!');
            return;
        }
        
        // Definir estrutura das colunas baseada na análise
        const brandColumns = [
            { brand: 'MOTOROLA', nameCol: 0, priceCol: 1 },    // A, B
            { brand: 'SAMSUNG', nameCol: 3, priceCol: 4 },     // D, E  
            { brand: 'XIAOMI', nameCol: 6, priceCol: 7 },      // G, H
            { brand: 'IPHONE', nameCol: 9, priceCol: 10 }      // J, K
        ];
        
        const products = [];
        let productId = 1;
        
        // Processar dados (pular linha de cabeçalho)
        for (let rowIndex = 1; rowIndex < data.length; rowIndex++) {
            const row = data[rowIndex];
            if (!row || row.length === 0) continue;
            
            // Processar cada marca
            for (const brandInfo of brandColumns) {
                const productName = row[brandInfo.nameCol];
                const productPrice = row[brandInfo.priceCol];
                
                // Verificar se há dados válidos
                if (productName && productPrice && 
                    typeof productName === 'string' && 
                    typeof productPrice === 'number' && 
                    productPrice > 0) {
                    
                    const product = {
                        name: productName.trim(),
                        sku: `${brandInfo.brand.substring(0, 3).toUpperCase()}${productId.toString().padStart(4, '0')}`,
                        cost: productPrice,
                        category: brandInfo.brand,
                        brand: brandInfo.brand,
                        salePrice: calculateSalePrice(productPrice),
                        stock: 10 // Stock padrão
                    };
                    
                    products.push(product);
                    productId++;
                }
            }
        }
        
        console.log(`✅ ${products.length} produtos processados`);
        
        // Mostrar alguns exemplos
        console.log('\n📋 Exemplos de produtos processados:');
        products.slice(0, 5).forEach(product => {
            const marginPercent = ((product.salePrice - product.cost) / product.cost * 100).toFixed(0);
            console.log(`${product.brand} - ${product.name}: R$${product.cost.toFixed(2)} → R$${product.salePrice.toFixed(2)} (+${marginPercent}%)`);
        });
        
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
                            sku: `${product.sku}-L${store.id}`,
                            price: product.salePrice,
                            cost_price: product.cost,
                            stock: product.stock,
                            category_id: categoryId,
                            store_id: store.id,
                            track_stock: true
                        }]);
                    
                    if (error) {
                        console.error(`❌ Erro ao inserir produto ${product.name}:`, error.message);
                    } else {
                        totalImported++;
                        if (totalImported % 50 === 0) {
                            console.log(`✅ ${totalImported} produtos importados...`);
                        }
                    }
                } catch (err) {
                    console.error(`❌ Erro ao processar produto ${product.name}:`, err.message);
                }
            }
        }
        
        console.log(`\n🎉 Importação concluída! ${totalImported} produtos importados no total.`);
        
        // Mostrar estatísticas por marca
        const brandStats = {};
        products.forEach(product => {
            if (!brandStats[product.brand]) {
                brandStats[product.brand] = 0;
            }
            brandStats[product.brand]++;
        });
        
        console.log('\n📊 Estatísticas por marca:');
        Object.entries(brandStats).forEach(([brand, count]) => {
            console.log(`${brand}: ${count} produtos`);
        });
        
        // Mostrar estatísticas por faixa de margem
        const marginStats = {
            'Margem 150% (< R$65)': products.filter(p => p.cost < 65).length,
            'Margem 110% (R$66-80)': products.filter(p => p.cost >= 66 && p.cost <= 80).length,
            'Margem 130% (R$80-120)': products.filter(p => p.cost > 80 && p.cost <= 120).length,
            'Margem 100% (> R$120)': products.filter(p => p.cost > 120).length
        };
        
        console.log('\n📊 Estatísticas de margem aplicada:');
        Object.entries(marginStats).forEach(([range, count]) => {
            console.log(`${range}: ${count} produtos`);
        });
        
    } catch (error) {
        console.error('❌ Erro durante a importação:', error);
    }
}

// Executar importação
importAllProducts();

export { importAllProducts, calculateSalePrice, normalizeCategory };