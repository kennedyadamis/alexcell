const fs = require('fs');

async function executeBatches() {
    console.log('🚀 Executando importação em lotes das placas de carga...\n');
    
    // Lotes 4, 5, 6 (próximos 3 lotes)
    const batchesToExecute = [4, 5, 6];
    
    for (const batchNum of batchesToExecute) {
        const filename = `lote-placas-${batchNum}.sql`;
        
        if (fs.existsSync(filename)) {
            const content = fs.readFileSync(filename, 'utf8');
            const productCount = (content.match(/\('Placa de Carga/g) || []).length;
            
            console.log(`📦 Lote ${batchNum}: ${productCount} produtos`);
            
            // Mostrar alguns exemplos
            const lines = content.split('\n');
            const examples = lines.filter(line => line.includes("'Placa de Carga")).slice(0, 2);
            examples.forEach(example => {
                const match = example.match(/'([^']+)'/);
                if (match) {
                    console.log(`   📱 ${match[1]}`);
                }
            });
            
            console.log(`\n✅ SQL do Lote ${batchNum}:`);
            console.log(content);
            console.log('\n' + '='.repeat(80) + '\n');
        }
    }
    
    console.log('📊 Próximos lotes preparados para execução!');
}

executeBatches().catch(console.error);