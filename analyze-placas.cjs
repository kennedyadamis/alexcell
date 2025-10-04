const fs = require('fs');
const XLSX = require('xlsx');

try {
  const workbook = XLSX.readFile('Tabela Tiaguinho cell.xlsx');
  const sheetName = workbook.SheetNames[0];
  const worksheet = workbook.Sheets[sheetName];
  
  // Pegar o range da planilha
  const range = XLSX.utils.decode_range(worksheet['!ref']);
  console.log('Range da planilha:', worksheet['!ref']);
  
  // Ler todas as células para entender a estrutura
  console.log('Primeiras linhas da planilha:');
  for (let row = 0; row <= Math.min(10, range.e.r); row++) {
    let rowData = [];
    for (let col = 0; col <= range.e.c; col++) {
      const cellAddress = XLSX.utils.encode_cell({r: row, c: col});
      const cell = worksheet[cellAddress];
      rowData.push(cell ? cell.v : '');
    }
    console.log(`Linha ${row + 1}:`, rowData);
  }
  
  // Procurar por 'placa' em todas as células
  console.log('\nProcurando por "placa" em todas as células...');
  let placasEncontradas = [];
  for (let row = 0; row <= range.e.r; row++) {
    for (let col = 0; col <= range.e.c; col++) {
      const cellAddress = XLSX.utils.encode_cell({r: row, c: col});
      const cell = worksheet[cellAddress];
      if (cell && cell.v && typeof cell.v === 'string') {
        const valor = cell.v.toLowerCase();
        if (valor.includes('placa')) {
          placasEncontradas.push({
            linha: row + 1,
            coluna: col + 1,
            valor: cell.v
          });
        }
      }
    }
  }
  
  console.log('Células com "placa" encontradas:', placasEncontradas.length);
  placasEncontradas.slice(0, 20).forEach(p => {
    console.log(`Linha ${p.linha} Coluna ${p.coluna}: ${p.valor}`);
  });
  
  // Procurar também por 'sub' ou 'carga'
  console.log('\nProcurando por "sub" ou "carga"...');
  let outrasEncontradas = [];
  for (let row = 0; row <= range.e.r; row++) {
    for (let col = 0; col <= range.e.c; col++) {
      const cellAddress = XLSX.utils.encode_cell({r: row, c: col});
      const cell = worksheet[cellAddress];
      if (cell && cell.v && typeof cell.v === 'string') {
        const valor = cell.v.toLowerCase();
        if (valor.includes('sub') || valor.includes('carga')) {
          outrasEncontradas.push({
            linha: row + 1,
            coluna: col + 1,
            valor: cell.v
          });
        }
      }
    }
  }
  
  console.log('Células com "sub" ou "carga" encontradas:', outrasEncontradas.length);
  outrasEncontradas.slice(0, 20).forEach(p => {
    console.log(`Linha ${p.linha} Coluna ${p.coluna}: ${p.valor}`);
  });
  
} catch (error) {
  console.error('Erro:', error.message);
}