const fs = require('fs');

async function importRemainingFast() {
    console.log('🚀 Importação rápida dos lotes restantes de placas de carga...\n');
    
    // Lotes 5 a 16 (restantes)
    const remainingBatches = [5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16];
    
    console.log(`📊 Status atual: 85 produtos já importados`);
    console.log(`📦 Lotes restantes: ${remainingBatches.length} lotes`);
    console.log(`🎯 Meta: 325 produtos totais\n`);
    
    let totalToImport = 0;
    
    // Consolidar todos os lotes restantes em um único SQL
    let consolidatedSQL = '';
    
    for (const batchNum of remainingBatches) {
        const filename = `lote-placas-${batchNum}.sql`;
        
        if (fs.existsSync(filename)) {
            const content = fs.readFileSync(filename, 'utf8');
            const productCount = (content.match(/\('Placa de Carga/g) || []).length;
            
            console.log(`✅ Lote ${batchNum}: ${productCount} produtos preparados`);
            
            // Adicionar ao SQL consolidado
            consolidatedSQL += `-- Lote ${batchNum}\n${content}\n\n`;
            totalToImport += productCount;
        }
    }
    
    console.log(`\n📈 Total a importar: ${totalToImport} produtos`);
    console.log(`🎯 Total final esperado: ${85 + totalToImport} produtos`);
    
    // Salvar SQL consolidado
    fs.writeFileSync('import-placas-restantes-consolidado.sql', consolidatedSQL);
    console.log(`\n💾 SQL consolidado salvo em: import-placas-restantes-consolidado.sql`);
    
    console.log(`\n🚀 Pronto para importação em massa!`);
    console.log(`   Execute o arquivo SQL consolidado no banco de dados.`);
}

importRemainingFast().catch(console.error);