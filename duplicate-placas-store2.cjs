const fs = require('fs');

// Script para duplicar placas de carga para a loja 2 (feira)
async function duplicatePlacasToStore2() {
  console.log('🏪 DUPLICAÇÃO PARA LOJA 2 - PLACAS DE CARGA');
  console.log('==========================================\n');
  
  console.log('📊 STATUS ATUAL:');
  console.log('   ✅ Loja 1: 110 produtos com preços atualizados');
  console.log('   🎯 Meta: Duplicar todos para Loja 2 (feira)\n');
  
  console.log('💰 PREÇOS ATUALIZADOS:');
  console.log('   • 101 produtos até R$30: R$70,00 fixo');
  console.log('   • 5 produtos R$26-50: R$77,00 - R$110,00');
  console.log('   • 4 produtos acima R$50: R$138,00 - R$437,00\n');
  
  // Gerar SQL para duplicação
  let sqlDuplication = '-- DUPLICAÇÃO DE PLACAS DE CARGA PARA LOJA 2 (FEIRA)\n';
  sqlDuplication += '-- Data: ' + new Date().toLocaleDateString('pt-BR') + '\n\n';
  
  sqlDuplication += '-- Inserir todas as placas de carga da loja 1 na loja 2\n';
  sqlDuplication += 'INSERT INTO products (name, sku, category_id, cost_price, price, stock, store_id)\n';
  sqlDuplication += 'SELECT \n';
  sqlDuplication += '  name,\n';
  sqlDuplication += '  CONCAT(sku, \'-L2\') as sku,  -- Adicionar sufixo -L2 para diferenciar\n';
  sqlDuplication += '  category_id,\n';
  sqlDuplication += '  cost_price,\n';
  sqlDuplication += '  price,\n';
  sqlDuplication += '  stock,\n';
  sqlDuplication += '  2 as store_id  -- Loja 2 (feira)\n';
  sqlDuplication += 'FROM products \n';
  sqlDuplication += 'WHERE category_id = 290 \n';
  sqlDuplication += '  AND store_id = 1;\n\n';
  
  // Query de verificação
  sqlDuplication += '-- VERIFICAÇÃO DA DUPLICAÇÃO\n';
  sqlDuplication += 'SELECT \n';
  sqlDuplication += '  store_id,\n';
  sqlDuplication += '  CASE \n';
  sqlDuplication += '    WHEN store_id = 1 THEN \'Loja 1 (Principal)\'\n';
  sqlDuplication += '    WHEN store_id = 2 THEN \'Loja 2 (Feira)\'\n';
  sqlDuplication += '  END as loja_nome,\n';
  sqlDuplication += '  COUNT(*) as total_produtos,\n';
  sqlDuplication += '  MIN(price) as menor_preco,\n';
  sqlDuplication += '  MAX(price) as maior_preco,\n';
  sqlDuplication += '  AVG(price) as preco_medio\n';
  sqlDuplication += 'FROM products \n';
  sqlDuplication += 'WHERE category_id = 290 \n';
  sqlDuplication += 'GROUP BY store_id, \n';
  sqlDuplication += '  CASE \n';
  sqlDuplication += '    WHEN store_id = 1 THEN \'Loja 1 (Principal)\'\n';
  sqlDuplication += '    WHEN store_id = 2 THEN \'Loja 2 (Feira)\'\n';
  sqlDuplication += '  END\n';
  sqlDuplication += 'ORDER BY store_id;\n\n';
  
  // Query para verificar alguns exemplos
  sqlDuplication += '-- EXEMPLOS DE PRODUTOS DUPLICADOS\n';
  sqlDuplication += 'SELECT \n';
  sqlDuplication += '  name,\n';
  sqlDuplication += '  sku,\n';
  sqlDuplication += '  store_id,\n';
  sqlDuplication += '  cost_price,\n';
  sqlDuplication += '  price\n';
  sqlDuplication += 'FROM products \n';
  sqlDuplication += 'WHERE category_id = 290 \n';
  sqlDuplication += '  AND (sku LIKE \'PLC0001%\' OR sku LIKE \'PLC0002%\' OR sku LIKE \'PLC0003%\')\n';
  sqlDuplication += 'ORDER BY name, store_id;\n';
  
  // Salvar arquivo SQL
  const nomeArquivo = 'duplicate-placas-store2.sql';
  fs.writeFileSync(nomeArquivo, sqlDuplication);
  
  console.log('✅ SCRIPT SQL GERADO COM SUCESSO!');
  console.log(`📁 Arquivo: ${nomeArquivo}`);
  console.log('\n📋 O QUE SERÁ FEITO:');
  console.log('   1. Duplicar 110 produtos da loja 1 para loja 2');
  console.log('   2. Adicionar sufixo "-L2" nos SKUs da loja 2');
  console.log('   3. Manter os mesmos preços atualizados');
  console.log('   4. Manter o mesmo estoque (30 unidades)');
  
  console.log('\n🏪 RESULTADO ESPERADO:');
  console.log('   • Loja 1: 110 produtos (SKUs originais)');
  console.log('   • Loja 2: 110 produtos (SKUs com -L2)');
  console.log('   • Total: 220 produtos de placas de carga');
  
  return {
    arquivo: nomeArquivo,
    loja1: 110,
    loja2: 110,
    total: 220,
    categoria: 'Placas de Carga'
  };
}

// Executar
duplicatePlacasToStore2()
  .then(resultado => {
    console.log('\n🎉 SCRIPT DE DUPLICAÇÃO PRONTO!');
    console.log(`📋 Total final esperado: ${resultado.total} produtos`);
  })
  .catch(error => {
    console.error('❌ Erro:', error);
  });