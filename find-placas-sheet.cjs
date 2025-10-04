const XLSX = require('xlsx');

// Ler o arquivo Excel
const workbook = XLSX.readFile('Tabela Tiaguinho cell.xlsx');

console.log('Todas as abas disponíveis na planilha:');
workbook.SheetNames.forEach((name, index) => {
    console.log(`${index + 1}. "${name}"`);
});

// Procurar por abas que contenham "placa" ou "carga"
console.log('\nAbas que podem conter placas de carga:');
const possibleSheets = workbook.SheetNames.filter(name => 
    name.toLowerCase().includes('placa') || 
    name.toLowerCase().includes('carga') ||
    name.toLowerCase().includes('sub')
);

if (possibleSheets.length > 0) {
    possibleSheets.forEach(sheetName => {
        console.log(`\n--- Analisando aba: "${sheetName}" ---`);
        const worksheet = workbook.Sheets[sheetName];
        const data = XLSX.utils.sheet_to_json(worksheet);
        
        console.log(`Linhas: ${data.length}`);
        if (data.length > 0) {
            console.log('Colunas:', Object.keys(data[0]));
            console.log('Primeira linha:', data[0]);
        }
    });
} else {
    console.log('Nenhuma aba específica encontrada. Vamos verificar todas as abas...');
    
    workbook.SheetNames.forEach(sheetName => {
        console.log(`\n--- Aba: "${sheetName}" ---`);
        const worksheet = workbook.Sheets[sheetName];
        const data = XLSX.utils.sheet_to_json(worksheet);
        
        console.log(`Linhas: ${data.length}`);
        if (data.length > 0) {
            console.log('Colunas:', Object.keys(data[0]));
            
            // Verificar se há dados relacionados a placas
            const hasPlacaData = data.some(row => {
                return Object.values(row).some(value => {
                    if (typeof value === 'string') {
                        return value.toLowerCase().includes('placa') || 
                               value.toLowerCase().includes('carga') ||
                               value.toLowerCase().includes('sub');
                    }
                    return false;
                });
            });
            
            if (hasPlacaData) {
                console.log('*** Esta aba contém dados relacionados a placas! ***');
            }
        }
    });
}