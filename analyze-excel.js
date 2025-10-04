import XLSX from 'xlsx';

// Função para analisar a estrutura da planilha
function analyzeExcelStructure() {
    try {
        console.log('🔍 Analisando estrutura da planilha Excel...');
        
        // Ler arquivo Excel
        const workbook = XLSX.readFile('Tabela Tiaguinho cell.xlsx');
        
        console.log('📋 Planilhas encontradas:', workbook.SheetNames);
        
        // Analisar primeira planilha
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        
        console.log(`\n📊 Analisando planilha: ${sheetName}`);
        
        // Converter para JSON com diferentes opções
        console.log('\n--- Análise com cabeçalhos automáticos ---');
        const dataWithHeaders = XLSX.utils.sheet_to_json(worksheet);
        console.log('Primeiros 3 registros:', dataWithHeaders.slice(0, 3));
        
        console.log('\n--- Análise como array ---');
        const dataAsArray = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
        console.log('Primeiras 10 linhas:');
        dataAsArray.slice(0, 10).forEach((row, index) => {
            console.log(`Linha ${index + 1}:`, row);
        });
        
        console.log('\n--- Informações da planilha ---');
        console.log('Range:', worksheet['!ref']);
        
        // Tentar identificar padrões
        console.log('\n--- Identificando padrões ---');
        
        // Verificar se há dados em colunas específicas
        const range = XLSX.utils.decode_range(worksheet['!ref']);
        console.log(`Dimensões: ${range.e.r + 1} linhas x ${range.e.c + 1} colunas`);
        
        // Analisar algumas células específicas
        console.log('\nCélulas específicas:');
        for (let row = 0; row <= Math.min(5, range.e.r); row++) {
            for (let col = 0; col <= Math.min(10, range.e.c); col++) {
                const cellAddress = XLSX.utils.encode_cell({ r: row, c: col });
                const cell = worksheet[cellAddress];
                if (cell && cell.v) {
                    console.log(`${cellAddress}: ${cell.v} (tipo: ${cell.t})`);
                }
            }
        }
        
    } catch (error) {
        console.error('❌ Erro ao analisar planilha:', error);
    }
}

// Executar análise
analyzeExcelStructure();