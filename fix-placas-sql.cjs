const fs = require('fs');

try {
  // Ler o arquivo SQL
  let sql = fs.readFileSync('import-placas-carga.sql', 'utf8');
  
  // Substituir todas as ocorrências do INSERT com created_at e updated_at
  sql = sql.replace(
    /INSERT INTO products \(name, sku, category_id, cost_price, price, stock, store_id, created_at, updated_at\)\s*VALUES \(\s*'([^']+)',\s*'([^']+)',\s*\(SELECT id FROM categories WHERE name = 'Placas de Carga'\),\s*([0-9.]+),\s*([0-9.]+),\s*([0-9]+),\s*([0-9]+),\s*NOW\(\),\s*NOW\(\)\s*\);/g,
    `INSERT INTO products (name, sku, category_id, cost_price, price, stock, store_id)
VALUES (
  '$1',
  '$2',
  (SELECT id FROM categories WHERE name = 'Placas de Carga'),
  $3,
  $4,
  $5,
  $6
);`
  );
  
  // Salvar o arquivo corrigido
  fs.writeFileSync('import-placas-carga-fixed.sql', sql);
  
  console.log('Arquivo SQL corrigido salvo como import-placas-carga-fixed.sql');
  
  // Contar quantos INSERTs foram corrigidos
  const insertCount = (sql.match(/INSERT INTO products/g) || []).length - 1; // -1 para não contar o comentário
  console.log(`Total de INSERTs corrigidos: ${insertCount}`);
  
} catch (error) {
  console.error('Erro:', error.message);
}