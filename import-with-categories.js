import XLSX from 'xlsx';
import { createClient } from '@supabase/supabase-js';

// Configuração do Supabase
const supabaseUrl = 'https://dvfldedemzgdnfhxtzro.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImR2ZmxkZWRlbXpnZG5maHh0enJvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTA4NzUzMTcsImV4cCI6MjA2NjQ1MTMxN30.6WxpY73KFvZTtvjyT6YYOWpHJZ-bmNY_FyhbiqgHRec';

const supabase = createClient(supabaseUrl, supabaseKey);

// Mapeamento de categorias por marca
const categoryMapping = {
    'MOTOROLA': 'Frontais Motorola',
    'SAMSUNG': 'Frontais Samsung',
    'XIAOMI': 'Frontais Xiaomi',
    'IPHONE': 'Frontais iPhone'
};

// Função para calcular preço de venda com base nas regras de margem
function calculateSalePrice(costPrice) {
    if (costPrice < 65) {
        return Math.round(costPrice * 1.5); // 150%
    } else if (costPrice >= 66 && costPrice <= 80) {
        return Math.round(costPrice * 1.1); // 110%
    } else if (costPrice >= 80 && costPrice <= 120) {
        return Math.round(costPrice * 1.3); // 130%
    } else {
        return Math.round(costPrice * 1.0); // 100%
    }
}

// Função para normalizar nome do produto
function normalizeProductName(name) {
    if (!name) return '';
    return name.toString().trim();
}

// Função para buscar ou criar categoria
async function getOrCreateCategory(categoryName) {
    try {
        // Primeiro, tenta buscar a categoria existente
        const { data: existingCategory, error: searchError } = await supabase
            .from('categories')
            .select('id')
            .eq('name', categoryName)
            .single();

        if (existingCategory) {
            return existingCategory.id;
        }

        // Se não encontrou, cria uma nova categoria
        const { data: newCategory, error: createError } = await supabase
            .from('categories')
            .insert({ name: categoryName })
            .select('id')
            .single();

        if (createError) {
            console.error('Erro ao criar categoria:', createError);
            return null;
        }

        return newCategory.id;
    } catch (error) {
        console.error('Erro ao buscar/criar categoria:', error);
        return null;
    }
}

// Função principal de importação
async function importProducts() {
    try {
        console.log('Iniciando importação de produtos...');

        // Carrega a planilha
        const workbook = XLSX.readFile('Tabela Tiaguinho cell.xlsx');
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        
        // Converte para array
        const data = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
        
        console.log(`Planilha carregada com ${data.length} linhas`);

        // Busca as lojas
        const { data: stores, error: storesError } = await supabase
            .from('stores')
            .select('id, name');

        if (storesError) {
            console.error('Erro ao buscar lojas:', storesError);
            return;
        }

        if (!stores || stores.length === 0) {
            console.log('Nenhuma loja encontrada no banco de dados!');
            return;
        }

        console.log(`Encontradas ${stores.length} lojas:`, stores.map(s => s.name));

        // Configuração das colunas por marca
        const brandColumns = {
            'MOTOROLA': { product: 0, price: 1 },
            'SAMSUNG': { product: 3, price: 4 },
            'XIAOMI': { product: 6, price: 7 },
            'IPHONE': { product: 9, price: 10 }
        };

        let totalProducts = 0;

        // Processa cada marca
        for (const [brand, columns] of Object.entries(brandColumns)) {
            console.log(`\nProcessando produtos da marca: ${brand}`);
            
            const categoryName = categoryMapping[brand];
            const categoryId = await getOrCreateCategory(categoryName);
            
            if (!categoryId) {
                console.error(`Erro ao obter categoria para ${brand}`);
                continue;
            }

            let brandProducts = 0;

            // Processa cada linha da planilha (começando da linha 2, pois linha 1 são os headers)
            for (let i = 1; i < data.length; i++) {
                const row = data[i];
                
                const productName = normalizeProductName(row[columns.product]);
                const costPrice = parseFloat(row[columns.price]);

                // Verifica se tem dados válidos
                if (!productName || isNaN(costPrice) || costPrice <= 0) {
                    continue;
                }

                const salePrice = calculateSalePrice(costPrice);

                // Insere o produto para cada loja
                for (const store of stores) {
                    try {
                        const { error: insertError } = await supabase
                            .from('products')
                            .insert({
                                name: productName,
                                cost_price: costPrice,
                                sale_price: salePrice,
                                category_id: categoryId,
                                store_id: store.id
                            });

                        if (insertError) {
                            console.error(`Erro ao inserir produto ${productName} na loja ${store.name}:`, insertError);
                        }
                    } catch (error) {
                        console.error(`Erro ao processar produto ${productName}:`, error);
                    }
                }

                brandProducts++;
                totalProducts++;
            }

            console.log(`${brand}: ${brandProducts} produtos processados`);
        }

        console.log(`\nImportação concluída! Total de produtos únicos processados: ${totalProducts}`);
        console.log(`Total de registros inseridos: ${totalProducts * stores.length}`);

    } catch (error) {
        console.error('Erro durante a importação:', error);
    }
}

// Executa a importação
importProducts();