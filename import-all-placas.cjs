const fs = require('fs');

async function importAllBatches() {
    console.log('Iniciando importação de todos os lotes de placas de carga...\n');
    
    let totalImported = 25; // Já importamos 5 + 20 produtos
    
    // Importar lotes de 2 a 16
    for (let i = 2; i <= 16; i++) {
        const filename = `lote-placas-${i}.sql`;
        
        if (fs.existsSync(filename)) {
            console.log(`Importando ${filename}...`);
            const sqlContent = fs.readFileSync(filename, 'utf8');
            
            // Contar quantos produtos tem neste lote
            const productCount = (sqlContent.match(/\('Placa de Carga/g) || []).length;
            
            console.log(`Lote ${i}: ${productCount} produtos`);
            console.log('SQL:', sqlContent.substring(0, 200) + '...\n');
            
            totalImported += productCount;
        } else {
            console.log(`Arquivo ${filename} não encontrado.`);
        }
    }
    
    console.log(`\nTotal de produtos que serão importados: ${totalImported}`);
    console.log('\nPara executar a importação no banco, execute cada arquivo SQL individualmente ou use o comando SQL diretamente no Supabase.');
    
    // Criar um arquivo consolidado com todos os lotes
    let consolidatedSQL = '-- Importação consolidada de todas as placas de carga restantes\n\n';
    
    for (let i = 2; i <= 16; i++) {
        const filename = `lote-placas-${i}.sql`;
        if (fs.existsSync(filename)) {
            const content = fs.readFileSync(filename, 'utf8');
            consolidatedSQL += `-- Lote ${i}\n${content}\n\n`;
        }
    }
    
    fs.writeFileSync('import-todas-placas-restantes.sql', consolidatedSQL);
    console.log('\nArquivo consolidado criado: import-todas-placas-restantes.sql');
}

importAllBatches().catch(console.error);