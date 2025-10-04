const fs = require('fs');

// Ler o arquivo SQL
const sqlContent = fs.readFileSync('import-placas-carga-correto.sql', 'utf8');

// Extrair apenas os INSERTs de produtos
const lines = sqlContent.split('\n');
const insertLines = [];
let currentInsert = '';

for (const line of lines) {
    if (line.trim().startsWith('INSERT INTO products')) {
        if (currentInsert) {
            insertLines.push(currentInsert.trim());
        }
        currentInsert = line;
    } else if (currentInsert && line.trim()) {
        currentInsert += '\n' + line;
        if (line.trim() === ');') {
            insertLines.push(currentInsert.trim());
            currentInsert = '';
        }
    }
}

console.log(`Total de INSERTs encontrados: ${insertLines.length}`);

// Dividir em lotes de 50
const batchSize = 50;
const batches = [];

for (let i = 0; i < insertLines.length; i += batchSize) {
    batches.push(insertLines.slice(i, i + batchSize));
}

console.log(`Dividido em ${batches.length} lotes de até ${batchSize} produtos cada`);

// Salvar cada lote em um arquivo separado
batches.forEach((batch, index) => {
    const batchContent = `-- Lote ${index + 1} de ${batches.length} - Placas de Carga\n\n` + batch.join('\n\n') + '\n';
    const filename = `import-placas-lote-${String(index + 1).padStart(2, '0')}.sql`;
    fs.writeFileSync(filename, batchContent);
    console.log(`Lote ${index + 1}: ${batch.length} produtos salvos em ${filename}`);
});

console.log('\nTodos os lotes foram criados. Execute-os um por vez no banco de dados.');
console.log('Exemplo: node execute-batch.cjs 1');