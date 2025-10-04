import * as XLSX from 'xlsx';
import { supabase } from '../api/supabase.js';

/**
 * Calcula o preço de venda baseado no custo e nas regras de margem
 * @param {number} cost - Preço de custo
 * @returns {number} - Preço de venda calculado
 */
function calculateSalePrice(cost) {
    const costValue = parseFloat(cost);
    
    if (isNaN(costValue) || costValue <= 0) {
        return 0;
    }
    
    let margin;
    
    if (costValue < 65) {
        margin = 2.5; // 150% de margem = multiplicar por 2.5
    } else if (costValue >= 66 && costValue <= 80) {
        margin = 2.1; // 110% de margem = multiplicar por 2.1
    } else if (costValue >= 80 && costValue <= 120) {
        margin = 2.3; // 130% de margem = multiplicar por 2.3
    } else { // acima de 120
        margin = 2.0; // 100% de margem = multiplicar por 2.0
    }
    
    return Math.round(costValue * margin * 100) / 100; // Arredonda para 2 casas decimais
}

/**
 * Normaliza o nome da categoria
 * @param {string} category - Nome da categoria original
 * @returns {string} - Nome da categoria normalizado
 */
function normalizeCategory(category) {
    if (!category || typeof category !== 'string') {
        return 'Diversos';
    }
    
    const normalized = category.trim().toLowerCase();
    
    // Mapeamento de categorias comuns
    const categoryMap = {
        'celular': 'Celulares',
        'celulares': 'Celulares',
        'smartphone': 'Celulares',
        'smartphones': 'Celulares',
        'telefone': 'Celulares',
        'telefones': 'Celulares',
        'iphone': 'Celulares',
        'samsung': 'Celulares',
        'xiaomi': 'Celulares',
        'motorola': 'Celulares',
        
        'acessorio': 'Acessórios',
        'acessorios': 'Acessórios',
        'acessório': 'Acessórios',
        'acessórios': 'Acessórios',
        'cabo': 'Acessórios',
        'cabos': 'Acessórios',
        'carregador': 'Acessórios',
        'carregadores': 'Acessórios',
        'fone': 'Acessórios',
        'fones': 'Acessórios',
        'headphone': 'Acessórios',
        'headphones': 'Acessórios',
        'capinha': 'Acessórios',
        'capinhas': 'Acessórios',
        'capa': 'Acessórios',
        'capas': 'Acessórios',
        'pelicula': 'Acessórios',
        'peliculas': 'Acessórios',
        'película': 'Acessórios',
        'películas': 'Acessórios',
        'suporte': 'Acessórios',
        'suportes': 'Acessórios',
        
        'tablet': 'Tablets',
        'tablets': 'Tablets',
        'ipad': 'Tablets',
        
        'notebook': 'Informática',
        'notebooks': 'Informática',
        'laptop': 'Informática',
        'laptops': 'Informática',
        'computador': 'Informática',
        'computadores': 'Informática',
        'pc': 'Informática',
        'mouse': 'Informática',
        'teclado': 'Informática',
        'teclados': 'Informática',
        'monitor': 'Informática',
        'monitores': 'Informática',
        
        'smartwatch': 'Wearables',
        'smartwatches': 'Wearables',
        'relogio': 'Wearables',
        'relógio': 'Wearables',
        'relogios': 'Wearables',
        'relógios': 'Wearables',
        'pulseira': 'Wearables',
        'pulseiras': 'Wearables',
        
        'game': 'Games',
        'games': 'Games',
        'console': 'Games',
        'consoles': 'Games',
        'playstation': 'Games',
        'xbox': 'Games',
        'nintendo': 'Games',
        'controle': 'Games',
        'controles': 'Games',
        
        'tv': 'Eletrônicos',
        'televisao': 'Eletrônicos',
        'televisão': 'Eletrônicos',
        'televisoes': 'Eletrônicos',
        'televisões': 'Eletrônicos',
        'som': 'Eletrônicos',
        'audio': 'Eletrônicos',
        'áudio': 'Eletrônicos',
        'caixa de som': 'Eletrônicos',
        'speaker': 'Eletrônicos',
        'speakers': 'Eletrônicos'
    };
    
    return categoryMap[normalized] || category.trim();
}

/**
 * Cria ou obtém uma categoria no banco de dados
 * @param {string} categoryName - Nome da categoria
 * @param {number} storeId - ID da loja
 * @returns {Promise<number>} - ID da categoria
 */
async function getOrCreateCategory(categoryName, storeId) {
    const normalizedName = normalizeCategory(categoryName);
    
    // Verifica se a categoria já existe
    const { data: existingCategory, error: searchError } = await supabase
        .from('categories')
        .select('id')
        .eq('name', normalizedName)
        .eq('store_id', storeId)
        .single();
    
    if (existingCategory) {
        return existingCategory.id;
    }
    
    // Cria nova categoria
    const { data: newCategory, error: createError } = await supabase
        .from('categories')
        .insert([{
            name: normalizedName,
            store_id: storeId
        }])
        .select('id')
        .single();
    
    if (createError) {
        console.error('Erro ao criar categoria:', createError);
        throw createError;
    }
    
    return newCategory.id;
}

/**
 * Processa e importa produtos da planilha Excel
 * @param {File} file - Arquivo Excel
 * @param {number} storeId - ID da loja de destino
 * @returns {Promise<Object>} - Resultado da importação
 */
export async function importProductsFromExcel(file, storeId) {
    try {
        // Lê o arquivo Excel
        const arrayBuffer = await file.arrayBuffer();
        const workbook = XLSX.read(arrayBuffer, { type: 'array' });
        
        // Pega a primeira planilha
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        
        // Converte para JSON
        const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
        
        if (jsonData.length < 2) {
            throw new Error('Planilha deve conter pelo menos uma linha de cabeçalho e uma linha de dados');
        }
        
        // Identifica as colunas (assumindo que a primeira linha é o cabeçalho)
        const headers = jsonData[0].map(h => h ? h.toString().toLowerCase().trim() : '');
        const dataRows = jsonData.slice(1);
        
        // Mapeia as colunas necessárias
        const columnMap = {
            name: headers.findIndex(h => 
                h.includes('produto') || 
                h.includes('nome') || 
                h.includes('descrição') || 
                h.includes('descricao') ||
                h.includes('item')
            ),
            cost: headers.findIndex(h => 
                h.includes('custo') || 
                h.includes('preço de custo') || 
                h.includes('preco de custo') ||
                h.includes('valor de custo') ||
                h.includes('cost')
            ),
            category: headers.findIndex(h => 
                h.includes('categoria') || 
                h.includes('tipo') || 
                h.includes('class') ||
                h.includes('grupo')
            ),
            sku: headers.findIndex(h => 
                h.includes('sku') || 
                h.includes('código') || 
                h.includes('codigo') ||
                h.includes('ref') ||
                h.includes('referencia') ||
                h.includes('referência')
            ),
            stock: headers.findIndex(h => 
                h.includes('estoque') || 
                h.includes('quantidade') || 
                h.includes('qtd') ||
                h.includes('stock')
            )
        };
        
        console.log('Mapeamento de colunas:', columnMap);
        console.log('Cabeçalhos encontrados:', headers);
        
        if (columnMap.name === -1) {
            throw new Error('Coluna de nome/produto não encontrada. Verifique se existe uma coluna com "produto", "nome" ou "descrição"');
        }
        
        if (columnMap.cost === -1) {
            throw new Error('Coluna de custo não encontrada. Verifique se existe uma coluna com "custo" ou "preço de custo"');
        }
        
        const results = {
            success: 0,
            errors: [],
            total: dataRows.length,
            products: []
        };
        
        // Processa cada linha
        for (let i = 0; i < dataRows.length; i++) {
            const row = dataRows[i];
            
            try {
                // Extrai dados da linha
                const productName = row[columnMap.name]?.toString().trim();
                const costPrice = parseFloat(row[columnMap.cost]) || 0;
                const categoryName = row[columnMap.category]?.toString().trim() || 'Diversos';
                const sku = row[columnMap.sku]?.toString().trim() || '';
                const stock = parseInt(row[columnMap.stock]) || 0;
                
                if (!productName) {
                    results.errors.push(`Linha ${i + 2}: Nome do produto não encontrado`);
                    continue;
                }
                
                if (costPrice <= 0) {
                    results.errors.push(`Linha ${i + 2}: Preço de custo inválido para "${productName}"`);
                    continue;
                }
                
                // Calcula preço de venda
                const salePrice = calculateSalePrice(costPrice);
                
                // Obtém ou cria categoria
                const categoryId = await getOrCreateCategory(categoryName, storeId);
                
                // Prepara dados do produto
                const productData = {
                    name: productName,
                    sku: sku || null,
                    cost_price: costPrice,
                    price: salePrice,
                    stock: stock,
                    category_id: categoryId,
                    store_id: storeId,
                    track_stock: true
                };
                
                // Verifica se produto já existe (por SKU ou nome)
                let existingProduct = null;
                
                if (sku) {
                    const { data } = await supabase
                        .from('products')
                        .select('id')
                        .eq('sku', sku)
                        .eq('store_id', storeId)
                        .single();
                    existingProduct = data;
                }
                
                if (!existingProduct) {
                    const { data } = await supabase
                        .from('products')
                        .select('id')
                        .eq('name', productName)
                        .eq('store_id', storeId)
                        .single();
                    existingProduct = data;
                }
                
                if (existingProduct) {
                    // Atualiza produto existente
                    const { error: updateError } = await supabase
                        .from('products')
                        .update(productData)
                        .eq('id', existingProduct.id);
                    
                    if (updateError) {
                        results.errors.push(`Linha ${i + 2}: Erro ao atualizar "${productName}": ${updateError.message}`);
                        continue;
                    }
                } else {
                    // Cria novo produto
                    const { error: insertError } = await supabase
                        .from('products')
                        .insert([productData]);
                    
                    if (insertError) {
                        results.errors.push(`Linha ${i + 2}: Erro ao criar "${productName}": ${insertError.message}`);
                        continue;
                    }
                }
                
                results.success++;
                results.products.push({
                    name: productName,
                    cost: costPrice,
                    price: salePrice,
                    category: normalizeCategory(categoryName),
                    margin: `${Math.round(((salePrice - costPrice) / costPrice) * 100)}%`
                });
                
            } catch (error) {
                results.errors.push(`Linha ${i + 2}: ${error.message}`);
            }
        }
        
        return results;
        
    } catch (error) {
        console.error('Erro na importação:', error);
        throw error;
    }
}

/**
 * Valida arquivo Excel antes da importação
 * @param {File} file - Arquivo a ser validado
 * @returns {Promise<Object>} - Resultado da validação
 */
export async function validateExcelFile(file) {
    try {
        if (!file) {
            throw new Error('Nenhum arquivo selecionado');
        }
        
        if (!file.name.match(/\.(xlsx|xls)$/i)) {
            throw new Error('Arquivo deve ser do tipo Excel (.xlsx ou .xls)');
        }
        
        if (file.size > 10 * 1024 * 1024) { // 10MB
            throw new Error('Arquivo muito grande. Máximo permitido: 10MB');
        }
        
        // Lê uma amostra do arquivo para validar estrutura
        const arrayBuffer = await file.arrayBuffer();
        const workbook = XLSX.read(arrayBuffer, { type: 'array' });
        
        if (workbook.SheetNames.length === 0) {
            throw new Error('Arquivo Excel não contém planilhas');
        }
        
        const worksheet = workbook.Sheets[workbook.SheetNames[0]];
        const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
        
        if (jsonData.length < 2) {
            throw new Error('Planilha deve conter pelo menos uma linha de cabeçalho e uma linha de dados');
        }
        
        const headers = jsonData[0].map(h => h ? h.toString().toLowerCase().trim() : '');
        
        const hasNameColumn = headers.some(h => 
            h.includes('produto') || 
            h.includes('nome') || 
            h.includes('descrição') || 
            h.includes('descricao') ||
            h.includes('item')
        );
        
        const hasCostColumn = headers.some(h => 
            h.includes('custo') || 
            h.includes('preço de custo') || 
            h.includes('preco de custo') ||
            h.includes('valor de custo') ||
            h.includes('cost')
        );
        
        if (!hasNameColumn) {
            throw new Error('Planilha deve conter uma coluna de nome/produto');
        }
        
        if (!hasCostColumn) {
            throw new Error('Planilha deve conter uma coluna de custo');
        }
        
        return {
            valid: true,
            sheets: workbook.SheetNames,
            rows: jsonData.length - 1,
            headers: jsonData[0],
            preview: jsonData.slice(1, 6) // Primeiras 5 linhas de dados
        };
        
    } catch (error) {
        return {
            valid: false,
            error: error.message
        };
    }
}