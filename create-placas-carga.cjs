const fs = require('fs');
const XLSX = require('xlsx');

try {
  const workbook = XLSX.readFile('Tabela Tiaguinho cell.xlsx');
  const sheetName = workbook.SheetNames[0];
  const worksheet = workbook.Sheets[sheetName];
  
  // Converter para JSON
  const data = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
  
  // Coletar todos os produtos e preços
  const produtosComPrecos = [];
  
  for (let i = 1; i < data.length; i++) {
    const row = data[i];
    if (row && row.length > 0) {
      // Processar cada par produto-preço na linha
      for (let j = 0; j < row.length; j += 2) {
        const produto = row[j];
        const preco = row[j + 1];
        
        if (produto && typeof produto === 'string' && produto.trim() && 
            preco && typeof preco === 'number' && preco > 0) {
          produtosComPrecos.push({
            nome: produto.trim(),
            precoOriginal: preco
          });
        }
      }
    }
  }
  
  console.log(`Encontrados ${produtosComPrecos.length} produtos com preços`);
  
  // Filtrar produtos únicos
  const produtosUnicos = [];
  const nomesVistos = new Set();
  
  produtosComPrecos.forEach(produto => {
    if (!nomesVistos.has(produto.nome)) {
      nomesVistos.add(produto.nome);
      produtosUnicos.push(produto);
    }
  });
  
  console.log(`${produtosUnicos.length} produtos únicos`);
  
  // Gerar placas de carga baseadas nos produtos
  const placasCarga = produtosUnicos.map(produto => {
    const nomeOriginal = produto.nome;
    const precoOriginal = produto.precoOriginal;
    
    // Criar nome da placa de carga
    let nomePlaca = `Placa Sub ${nomeOriginal}`;
    
    // Calcular preço da placa baseado nas regras:
    // até 25 = R$ 70,00
    // 26-50 = 120% do preço original
    // acima de 50 = 130% do preço original
    let precoPlaca;
    if (precoOriginal <= 25) {
      precoPlaca = 70.00;
    } else if (precoOriginal <= 50) {
      precoPlaca = Math.round(precoOriginal * 1.20 * 100) / 100; // 120%
    } else {
      precoPlaca = Math.round(precoOriginal * 1.30 * 100) / 100; // 130%
    }
    
    return {
      nome: nomePlaca,
      categoria: 'Placas de Carga',
      precoOriginal: precoOriginal,
      precoPlaca: precoPlaca,
      custoPlaca: Math.round(precoPlaca * 0.6 * 100) / 100, // 60% do preço como custo
      estoque: Math.floor(Math.random() * 10) + 1 // Estoque aleatório entre 1-10
    };
  });
  
  console.log(`Gerando ${placasCarga.length} placas de carga`);
  
  // Gerar SQL
  let sql = `-- Importação de Placas de Carga
-- Baseado na planilha Tabela Tiaguinho cell.xlsx
-- Regras de preço: até R$25 = R$70, 26-50 = 120%, acima 50 = 130%

-- Primeiro, criar a categoria se não existir
INSERT INTO categories (name, description) 
VALUES ('Placas de Carga', 'Placas de carga e conectores para aparelhos celulares')
ON CONFLICT (name) DO NOTHING;

-- Inserir as placas de carga
`;

  placasCarga.forEach((placa, index) => {
    // Gerar SKU único
    const sku = `PLC-${String(index + 1).padStart(4, '0')}`;
    
    // Determinar loja baseado no SKU (alternando entre as duas lojas corretas)
    const lojaId = (index % 2) + 1; // Alterna entre loja 1 e 2
    
    sql += `
INSERT INTO products (name, sku, category_id, cost_price, price, stock, store_id, created_at, updated_at)
VALUES (
  '${placa.nome.replace(/'/g, "''")}',
  '${sku}',
  (SELECT id FROM categories WHERE name = 'Placas de Carga'),
  ${placa.custoPlaca},
  ${placa.precoPlaca},
  ${placa.estoque},
  ${lojaId},
  NOW(),
  NOW()
);`;
  });
  
  sql += `

-- Verificar inserção
SELECT 
  COUNT(*) as total_placas,
  store_id,
  s.name as loja_nome
FROM products p
JOIN stores s ON p.store_id = s.id
JOIN categories c ON p.category_id = c.id
WHERE c.name = 'Placas de Carga'
GROUP BY store_id, s.name
ORDER BY store_id;
`;
  
  // Salvar SQL em arquivo
  fs.writeFileSync('import-placas-carga.sql', sql);
  
  console.log('SQL gerado e salvo em import-placas-carga.sql');
  console.log('\nEstatísticas:');
  console.log(`- Total de placas: ${placasCarga.length}`);
  console.log(`- Preço mínimo: R$ ${Math.min(...placasCarga.map(p => p.precoPlaca)).toFixed(2)}`);
  console.log(`- Preço máximo: R$ ${Math.max(...placasCarga.map(p => p.precoPlaca)).toFixed(2)}`);
  
  // Mostrar algumas amostras
  console.log('\nAmostras de placas geradas:');
  placasCarga.slice(0, 10).forEach(placa => {
    console.log(`- ${placa.nome}: R$ ${placa.precoPlaca.toFixed(2)} (original: R$ ${placa.precoOriginal.toFixed(2)})`);
  });
  
} catch (error) {
  console.error('Erro:', error.message);
}