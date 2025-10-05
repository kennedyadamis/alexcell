const fs = require('fs');

// Função para executar importação em lotes
async function importBulkPlacas() {
  console.log('🚀 Iniciando importação em massa das placas de carga restantes...\n');
  
  // Lotes restantes para importar (6 a 16)
  const lotesRestantes = [];
  for (let i = 6; i <= 16; i++) {
    lotesRestantes.push(i);
  }
  
  console.log(`📦 Lotes a serem processados: ${lotesRestantes.join(', ')}`);
  console.log(`📊 Total de lotes: ${lotesRestantes.length}`);
  console.log(`📈 Produtos por lote: 20`);
  console.log(`🎯 Total de produtos a importar: ${lotesRestantes.length * 20}\n`);
  
  // Consolidar todos os lotes em um único arquivo
  let sqlConsolidado = '-- IMPORTAÇÃO EM MASSA - PLACAS DE CARGA (LOTES 6-16)\n';
  sqlConsolidado += '-- Total de produtos: ' + (lotesRestantes.length * 20) + '\n\n';
  
  let totalProdutos = 0;
  
  for (const lote of lotesRestantes) {
    const nomeArquivo = `lote-placas-${lote}.sql`;
    
    try {
      if (fs.existsSync(nomeArquivo)) {
        const conteudo = fs.readFileSync(nomeArquivo, 'utf8');
        
        sqlConsolidado += `-- ========== LOTE ${lote} ==========\n`;
        sqlConsolidado += conteudo + '\n\n';
        
        // Contar produtos no lote
        const matches = conteudo.match(/INSERT INTO products/g);
        const produtosNoLote = matches ? matches.length : 0;
        totalProdutos += produtosNoLote;
        
        console.log(`✅ Lote ${lote}: ${produtosNoLote} produtos processados`);
      } else {
        console.log(`❌ Arquivo ${nomeArquivo} não encontrado`);
      }
    } catch (error) {
      console.log(`❌ Erro ao processar lote ${lote}:`, error.message);
    }
  }
  
  // Salvar arquivo consolidado
  const nomeArquivoFinal = 'import-placas-bulk-final.sql';
  fs.writeFileSync(nomeArquivoFinal, sqlConsolidado);
  
  console.log(`\n🎉 CONSOLIDAÇÃO CONCLUÍDA!`);
  console.log(`📁 Arquivo gerado: ${nomeArquivoFinal}`);
  console.log(`📊 Total de produtos consolidados: ${totalProdutos}`);
  console.log(`📈 Progresso atual: 105 produtos já importados`);
  console.log(`🎯 Meta final: 325 produtos`);
  console.log(`⏳ Restam: ${325 - 105} produtos para importar`);
  
  return {
    arquivo: nomeArquivoFinal,
    totalProdutos,
    progressoAtual: 105,
    metaFinal: 325,
    restantes: 325 - 105
  };
}

// Executar
importBulkPlacas()
  .then(resultado => {
    console.log('\n✨ Script executado com sucesso!');
    console.log('📋 Próximo passo: Executar o arquivo SQL gerado no banco de dados');
  })
  .catch(error => {
    console.error('❌ Erro na execução:', error);
  });