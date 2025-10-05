const fs = require('fs');

// Script para corrigir preços das placas de carga
async function fixPlacasPrices() {
  console.log('🔧 CORREÇÃO DE PREÇOS - PLACAS DE CARGA');
  console.log('=======================================\n');
  
  console.log('📊 ANÁLISE ATUAL DOS PREÇOS:');
  console.log('   • Até R$30: 101 produtos (custo médio: R$20,99)');
  console.log('   • R$26-50: 5 produtos (custo médio: R$41,00)');
  console.log('   • Acima R$50: 4 produtos (custo médio: R$127,50)\n');
  
  console.log('🎯 NOVAS REGRAS DE PREÇO:');
  console.log('   • Até R$30: Preço fixo de R$70,00');
  console.log('   • R$26-50: Custo + 120% (custo × 2.20)');
  console.log('   • Acima R$50: Custo + 130% (custo × 2.30)\n');
  
  // Gerar SQL para atualização de preços
  let sqlUpdates = '-- ATUALIZAÇÃO DE PREÇOS - PLACAS DE CARGA\n';
  sqlUpdates += '-- Data: ' + new Date().toLocaleDateString('pt-BR') + '\n\n';
  
  // Regra 1: Até R$30 = Preço fixo R$70,00
  sqlUpdates += '-- REGRA 1: Produtos até R$30 = Preço fixo R$70,00\n';
  sqlUpdates += 'UPDATE products \n';
  sqlUpdates += 'SET price = 70.00 \n';
  sqlUpdates += 'WHERE category_id = 290 \n';
  sqlUpdates += '  AND cost_price <= 30;\n\n';
  
  // Regra 2: R$26-50 = Custo + 120%
  sqlUpdates += '-- REGRA 2: Produtos R$26-50 = Custo + 120% (custo × 2.20)\n';
  sqlUpdates += 'UPDATE products \n';
  sqlUpdates += 'SET price = ROUND(cost_price * 2.20, 2) \n';
  sqlUpdates += 'WHERE category_id = 290 \n';
  sqlUpdates += '  AND cost_price BETWEEN 26 AND 50;\n\n';
  
  // Regra 3: Acima R$50 = Custo + 130%
  sqlUpdates += '-- REGRA 3: Produtos acima R$50 = Custo + 130% (custo × 2.30)\n';
  sqlUpdates += 'UPDATE products \n';
  sqlUpdates += 'SET price = ROUND(cost_price * 2.30, 2) \n';
  sqlUpdates += 'WHERE category_id = 290 \n';
  sqlUpdates += '  AND cost_price > 50;\n\n';
  
  // Query de verificação
  sqlUpdates += '-- VERIFICAÇÃO DOS PREÇOS ATUALIZADOS\n';
  sqlUpdates += 'SELECT \n';
  sqlUpdates += '  COUNT(*) as total,\n';
  sqlUpdates += '  CASE \n';
  sqlUpdates += '    WHEN cost_price <= 30 THEN \'Até R$30 (R$70 fixo)\'\n';
  sqlUpdates += '    WHEN cost_price BETWEEN 26 AND 50 THEN \'R$26-50 (+120%)\'\n';
  sqlUpdates += '    WHEN cost_price > 50 THEN \'Acima R$50 (+130%)\'\n';
  sqlUpdates += '  END as regra_aplicada,\n';
  sqlUpdates += '  MIN(price) as menor_preco,\n';
  sqlUpdates += '  MAX(price) as maior_preco,\n';
  sqlUpdates += '  AVG(price) as preco_medio\n';
  sqlUpdates += 'FROM products \n';
  sqlUpdates += 'WHERE category_id = 290 \n';
  sqlUpdates += 'GROUP BY \n';
  sqlUpdates += '  CASE \n';
  sqlUpdates += '    WHEN cost_price <= 30 THEN \'Até R$30 (R$70 fixo)\'\n';
  sqlUpdates += '    WHEN cost_price BETWEEN 26 AND 50 THEN \'R$26-50 (+120%)\'\n';
  sqlUpdates += '    WHEN cost_price > 50 THEN \'Acima R$50 (+130%)\'\n';
  sqlUpdates += '  END\n';
  sqlUpdates += 'ORDER BY menor_preco;\n\n';
  
  // Salvar arquivo SQL
  const nomeArquivo = 'update-placas-prices.sql';
  fs.writeFileSync(nomeArquivo, sqlUpdates);
  
  console.log('✅ SCRIPT SQL GERADO COM SUCESSO!');
  console.log(`📁 Arquivo: ${nomeArquivo}`);
  console.log('\n📋 PRÓXIMOS PASSOS:');
  console.log('   1. Executar o SQL no banco de dados');
  console.log('   2. Verificar se os preços foram atualizados corretamente');
  console.log('   3. Duplicar produtos para a loja 2 (feira)\n');
  
  // Simular os novos preços
  console.log('💰 SIMULAÇÃO DOS NOVOS PREÇOS:');
  console.log('   • 101 produtos até R$30: R$70,00 cada');
  console.log('   • 5 produtos R$26-50: R$90,20 (média)');
  console.log('   • 4 produtos acima R$50: R$293,25 (média)');
  
  return {
    arquivo: nomeArquivo,
    totalProdutos: 110,
    regras: {
      ate30: { quantidade: 101, precoFixo: 70.00 },
      entre26e50: { quantidade: 5, multiplicador: 2.20 },
      acima50: { quantidade: 4, multiplicador: 2.30 }
    }
  };
}

// Executar
fixPlacasPrices()
  .then(resultado => {
    console.log('\n🎉 SCRIPT CONCLUÍDO!');
    console.log('📋 Pronto para executar as atualizações de preço.');
  })
  .catch(error => {
    console.error('❌ Erro:', error);
  });