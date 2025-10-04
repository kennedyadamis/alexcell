const fs = require('fs');
const XLSX = require('xlsx');

try {
  const workbook = XLSX.readFile('Tabela Tiaguinho cell.xlsx');
  const sheetName = workbook.SheetNames[0];
  const worksheet = workbook.Sheets[sheetName];
  
  // Converter para JSON para análise mais fácil
  const data = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
  
  console.log('Total de linhas:', data.length);
  console.log('Estrutura da planilha:');
  
  // Mostrar as primeiras 20 linhas para entender a estrutura
  for (let i = 0; i < Math.min(20, data.length); i++) {
    console.log(`Linha ${i + 1}:`, data[i]);
  }
  
  console.log('\n=== ANÁLISE DE COLUNAS ===');
  
  // Analisar as colunas para identificar padrões
  if (data.length > 0) {
    const firstRow = data[0];
    console.log('Primeira linha (cabeçalhos?):', firstRow);
    
    // Procurar por todas as marcas/modelos únicos
    const produtos = new Set();
    const precos = [];
    
    for (let i = 1; i < data.length; i++) {
      const row = data[i];
      if (row && row.length > 0) {
        // Coletar produtos de todas as colunas pares (nomes)
        for (let j = 0; j < row.length; j += 2) {
          if (row[j] && typeof row[j] === 'string' && row[j].trim()) {
            produtos.add(row[j].trim());
          }
          // Coletar preços das colunas ímpares
          if (row[j + 1] && typeof row[j + 1] === 'number') {
            precos.push(row[j + 1]);
          }
        }
      }
    }
    
    console.log('\nTodos os produtos únicos encontrados:');
    Array.from(produtos).sort().forEach((produto, index) => {
      console.log(`${index + 1}. ${produto}`);
    });
    
    console.log('\nEstatísticas de preços:');
    console.log('Menor preço:', Math.min(...precos));
    console.log('Maior preço:', Math.max(...precos));
    console.log('Preços únicos:', [...new Set(precos)].sort((a, b) => a - b));
    
    // Procurar por produtos que podem ser placas de carga
    console.log('\n=== PROCURANDO PLACAS DE CARGA ===');
    const possiveisPlacas = Array.from(produtos).filter(produto => {
      const p = produto.toLowerCase();
      return p.includes('placa') || 
             p.includes('sub') || 
             p.includes('carga') ||
             p.includes('carregador') ||
             p.includes('conector') ||
             p.includes('flex') ||
             p.includes('dock');
    });
    
    console.log('Possíveis placas de carga encontradas:', possiveisPlacas.length);
    possiveisPlacas.forEach(placa => console.log('- ' + placa));
    
    // Se não encontrou placas específicas, vamos assumir que são produtos de reparo
    // e criar placas baseadas nos modelos existentes
    console.log('\n=== CRIANDO PLACAS BASEADAS NOS MODELOS ===');
    const modelos = Array.from(produtos).filter(produto => {
      const p = produto.toLowerCase();
      return !p.includes('similar') && !p.includes('incell') && !p.includes('oled');
    });
    
    console.log('Modelos base para criar placas:', modelos.length);
    modelos.slice(0, 20).forEach(modelo => console.log('- ' + modelo));
  }
  
} catch (error) {
  console.error('Erro:', error.message);
}