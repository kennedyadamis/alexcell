const XLSX = require('xlsx');
const fs = require('fs');

// Ler o arquivo Excel
const workbook = XLSX.readFile('Tabela Tiaguinho cell.xlsx');

// Encontrar a aba de placas de carga
const placasSheetName = 'Placas de carga';
const worksheet = workbook.Sheets[placasSheetName];

if (!worksheet) {
    console.log('Aba "Placas de carga" não encontrada!');
    process.exit(1);
}

// Converter para JSON
const data = XLSX.utils.sheet_to_json(worksheet);

console.log(`Total de linhas na aba "${placasSheetName}": ${data.length}`);
console.log('Colunas disponíveis:', Object.keys(data[0] || {}));

// Processar dados das placas de carga
const placasProducts = [];
let skuCounter = 1;

// Função para aplicar regras de preço
function calculatePrice(originalPrice, quantity) {
    if (quantity <= 25) {
        return 70.00; // R$ 70,00 para até 25 unidades
    } else if (quantity <= 50) {
        return originalPrice * 1.20; // 120% do preço original para 26-50 unidades
    } else {
        return originalPrice * 1.30; // 130% do preço original para mais de 50 unidades
    }
}

// Processar cada marca/coluna
Object.keys(data[0] || {}).forEach(brand => {
    if (brand.includes('__EMPTY')) return; // Pular colunas vazias
    
    console.log(`\nProcessando marca: ${brand}`);
    
    data.forEach((row, index) => {
        const model = row[brand];
        const priceColumn = Object.keys(row).find(key => 
            key.includes('__EMPTY') && 
            Object.keys(data[0]).indexOf(key) === Object.keys(data[0]).indexOf(brand) + 1
        );
        
        if (model && model.trim() && priceColumn && row[priceColumn]) {
            const originalPrice = parseFloat(row[priceColumn]);
            if (!isNaN(originalPrice)) {
                const productName = `Placa de Carga ${brand} ${model.trim()}`;
                const sku = `PLC${String(skuCounter).padStart(4, '0')}`;
                
                // Assumir estoque de 30 unidades para aplicar regra de preço
                const stock = 30;
                const finalPrice = calculatePrice(originalPrice, stock);
                
                placasProducts.push({
                    name: productName,
                    sku: sku,
                    originalPrice: originalPrice,
                    finalPrice: finalPrice,
                    stock: stock
                });
                
                skuCounter++;
            }
        }
    });
});

console.log(`\nTotal de placas de carga processadas: ${placasProducts.length}`);

if (placasProducts.length > 0) {
    console.log('\nExemplos de placas processadas:');
    placasProducts.slice(0, 5).forEach(product => {
        console.log(`- ${product.name}: R$ ${product.originalPrice.toFixed(2)} → R$ ${product.finalPrice.toFixed(2)}`);
    });
    
    // Gerar SQL
    let sql = `-- Importação correta das Placas de Carga\n`;
    sql += `-- Data: ${new Date().toISOString()}\n\n`;
    
    // Criar categoria
    sql += `-- Criar categoria Placas de Carga\n`;
    sql += `INSERT INTO categories (name, store_id) VALUES ('Placas de Carga', 1) ON CONFLICT DO NOTHING;\n\n`;
    
    // Inserir produtos
    sql += `-- Inserir placas de carga\n`;
    placasProducts.forEach(product => {
        sql += `INSERT INTO products (name, sku, category_id, cost_price, price, stock, store_id) VALUES (\n`;
        sql += `  '${product.name.replace(/'/g, "''")}',\n`;
        sql += `  '${product.sku}',\n`;
        sql += `  (SELECT id FROM categories WHERE name = 'Placas de Carga' AND store_id = 1),\n`;
        sql += `  ${product.originalPrice.toFixed(2)},\n`;
        sql += `  ${product.finalPrice.toFixed(2)},\n`;
        sql += `  ${product.stock},\n`;
        sql += `  1\n`;
        sql += `);\n\n`;
    });
    
    // Salvar arquivo SQL
    fs.writeFileSync('import-placas-carga-correto.sql', sql);
    console.log('\nArquivo SQL gerado: import-placas-carga-correto.sql');
    
    // Estatísticas
    const prices = placasProducts.map(p => p.finalPrice);
    console.log(`\nEstatísticas de preços:`);
    console.log(`- Menor preço: R$ ${Math.min(...prices).toFixed(2)}`);
    console.log(`- Maior preço: R$ ${Math.max(...prices).toFixed(2)}`);
    console.log(`- Preço médio: R$ ${(prices.reduce((a, b) => a + b, 0) / prices.length).toFixed(2)}`);
} else {
    console.log('Nenhuma placa de carga encontrada para processar.');
}