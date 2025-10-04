const XLSX = require('xlsx');

// Ler o arquivo Excel
const workbook = XLSX.readFile('Tabela Tiaguinho cell.xlsx');

console.log('Abas disponíveis na planilha:');
console.log(workbook.SheetNames);

// Verificar se existe uma aba específica para placas de carga
const placasSheet = workbook.SheetNames.find(name => 
    name.toLowerCase().includes('placa') || 
    name.toLowerCase().includes('carga')
);

if (placasSheet) {
    console.log(`\nEncontrada aba: "${placasSheet}"`);
    
    // Ler dados da aba de placas
    const worksheet = workbook.Sheets[placasSheet];
    const data = XLSX.utils.sheet_to_json(worksheet);
    
    console.log(`\nTotal de linhas na aba "${placasSheet}": ${data.length}`);
    
    if (data.length > 0) {
        console.log('\nPrimeiras 10 linhas:');
        data.slice(0, 10).forEach((row, index) => {
            console.log(`${index + 1}:`, row);
        });
        
        console.log('\nColunas disponíveis:');
        console.log(Object.keys(data[0]));
    }
} else {
    console.log('\nNenhuma aba específica para placas de carga encontrada.');
    console.log('Verificando todas as abas...');
    
    workbook.SheetNames.forEach(sheetName => {
        console.log(`\n--- Aba: ${sheetName} ---`);
        const worksheet = workbook.Sheets[sheetName];
        const data = XLSX.utils.sheet_to_json(worksheet);
        console.log(`Linhas: ${data.length}`);
        
        if (data.length > 0) {
            console.log('Colunas:', Object.keys(data[0]));
        }
    });
}