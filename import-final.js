import XLSX from 'xlsx';
import { createClient } from '@supabase/supabase-js';

// Configuração do Supabase
const supabaseUrl = 'https://dvfldedemzgdnfhxtzro.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImR2ZmxkZWRlbXpnZG5maHh0enJvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTA4NzUzMTcsImV4cCI6MjA2NjQ1MTMxN30.6WxpY73KFvZTtvjyT6YYOWpHJZ-bmNY_FyhbiqgHRec';
const supabase = createClient(supabaseUrl, supabaseKey);

// IDs das lojas (já existem no banco)
const STORES = [
    { id: 1, name: 'Alexxcell Paraísoo Sul' },
    { id: 2, name: 'Alexcell Feira' },
    { id: 3, name: 'Alexxcell Paraíso Sul' },
    { id: 4, name: 'Alexcell Feira' },
    { id: 5, name: 'Alexxcell Paraíso Sul' },
    { id: 6, name: 'Alexcell Feira' }
];

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
async function getOrCreateCategory(categoryName, storeId) {
    const normalizedName = normalizeCategory(categoryName);
    
    // Verificar se categoria já existe
    const { data: existingCategory } = await supabase
        .from('categories')
        .select('id')
        .eq('name', normalizedName)
        .eq('store_id', storeId)
        .single();
    
    if (existingCategory) {
        return existingCategory.id;
    }
    
    // Criar nova categoria
    const { data: newCategory, error } = await supabase
        .from('categories')
        .insert([{ name: normalizedName, store_id: storeId }])
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
        console.log(`🏪 Usando lojas: ${STORES.map(s => s.name).join(', ')}`);
        
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
            for (const brandConfig of brandColumns) {
                const productName = row[brandConfig.nameCol];
                const price = row[brandConfig.priceCol];
                
                // Verificar se há dados válidos
                if (productName && price && 
                    productName.toString().trim() !== '' && 
                    !isNaN(parseFloat(price))) {
                    
                    const cost = parseFloat(price);
                    const salePrice = calculateSalePrice(cost);
                    
                    products.push({
                        id: productId++,
                        name: productName.toString().trim(),
                        brand: brandConfig.brand,
                        cost: cost,
                        sale_price: salePrice,
                        category: brandConfig.brand // Usar marca como categoria
                    });
                }
            }
        }
        
        console.log(`📦 ${products.length} produtos processados`);
        
        if (products.length === 0) {
            console.log('❌ Nenhum produto encontrado para importar!');
            return;
        }
        
        let totalImported = 0;
        
        // Importar produtos para cada loja (usando apenas as duas primeiras lojas únicas)
        const uniqueStores = [STORES[0], STORES[1]]; // Alexxcell Paraísoo Sul e Alexcell Feira
        
        for (const store of uniqueStores) {
            console.log(`\n🏪 Importando produtos para: ${store.name}`);
            
            for (const product of products) {
                try {
                    // Criar categoria se necessário
                    const categoryId = await getOrCreateCategory(product.category, store.id);
                    
                    if (!categoryId) {
                        console.error(`❌ Erro ao criar categoria para ${product.name}`);
                        continue;
                    }
                    
                    // Inserir produto
                    const { error } = await supabase
                        .from('products')
                        .insert([{
                            name: product.name,
                            brand: product.brand,
                            cost_price: product.cost,
                            sale_price: product.sale_price,
                            category_id: categoryId,
                            store_id: store.id,
                            stock_quantity: 0,
                            min_stock: 1,
                            is_active: true
                        }]);
                    
                    if (error) {
                        console.error(`❌ Erro ao inserir produto ${product.name}:`, error.message);
                    } else {
                        totalImported++;
                        if (totalImported % 100 === 0) {
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
        
        console.log(`\n📈 Total de produtos por loja: ${products.length} produtos em cada uma das ${uniqueStores.length} lojas`);
        console.log(`📈 Total geral: ${totalImported} registros de produtos criados`);
        
    } catch (error) {
        console.error('❌ Erro durante a importação:', error);
    }
}

// Executar importação
importAllProducts();

export { importAllProducts, calculateSalePrice, normalizeCategory };