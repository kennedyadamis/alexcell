const fs = require('fs');

// Ler o arquivo SQL original
const sqlContent = fs.readFileSync('import-placas-carga-correto.sql', 'utf8');

// Extrair apenas os INSERTs de produtos
const lines = sqlContent.split('\n');
const products = [];
let currentProduct = {};

for (const line of lines) {
    if (line.includes("'Placa de Carga")) {
        const nameMatch = line.match(/'([^']+)'/);
        if (nameMatch) {
            currentProduct.name = nameMatch[1];
        }
    } else if (line.includes("'PLC")) {
        const skuMatch = line.match(/'([^']+)'/);
        if (skuMatch) {
            currentProduct.sku = skuMatch[1];
        }
    } else if (line.match(/^\s*\d+\.\d+,\s*$/)) {
        if (!currentProduct.cost_price) {
            currentProduct.cost_price = parseFloat(line.trim().replace(',', ''));
        } else {
            currentProduct.price = parseFloat(line.trim().replace(',', ''));
        }
    } else if (line.match(/^\s*30,\s*$/)) {
        currentProduct.stock = 30;
    } else if (line.match(/^\s*1\s*$/)) {
        currentProduct.store_id = 1;
        if (currentProduct.name && currentProduct.sku) {
            products.push({...currentProduct});
        }
        currentProduct = {};
    }
}

console.log(`Total de produtos extraídos: ${products.length}`);

// Pular os primeiros 5 que já foram inseridos
const remainingProducts = products.slice(5);
console.log(`Produtos restantes para importar: ${remainingProducts.length}`);

// Criar lotes de 20 produtos para importação mais rápida
const batchSize = 20;
let imported = 0;

function importBatch(batch, batchNumber) {
    const values = batch.map(p => 
        `('${p.name.replace(/'/g, "''")}', '${p.sku}', 290, ${p.cost_price}, ${p.price}, ${p.stock}, ${p.store_id})`
    ).join(',\n  ');
    
    const sql = `INSERT INTO products (name, sku, category_id, cost_price, price, stock, store_id) VALUES\n  ${values};`;
    
    console.log(`\nLote ${batchNumber}: ${batch.length} produtos`);
    console.log('SQL gerado para este lote:');
    console.log(sql);
    
    return sql;
}

// Processar em lotes
for (let i = 0; i < remainingProducts.length; i += batchSize) {
    const batch = remainingProducts.slice(i, i + batchSize);
    const batchNumber = Math.floor(i / batchSize) + 1;
    const sql = importBatch(batch, batchNumber);
    
    // Salvar cada lote em arquivo
    fs.writeFileSync(`lote-placas-${batchNumber}.sql`, sql);
    console.log(`Lote ${batchNumber} salvo em lote-placas-${batchNumber}.sql`);
}

console.log(`\nTodos os ${Math.ceil(remainingProducts.length / batchSize)} lotes foram criados.`);
console.log('Execute cada arquivo .sql no banco de dados ou use o comando SQL diretamente.');