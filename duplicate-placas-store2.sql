-- DUPLICAÇÃO DE PLACAS DE CARGA PARA LOJA 2 (FEIRA)
-- Data: 04/10/2025

-- Inserir todas as placas de carga da loja 1 na loja 2
INSERT INTO products (name, sku, category_id, cost_price, price, stock, store_id)
SELECT 
  name,
  CONCAT(sku, '-L2') as sku,  -- Adicionar sufixo -L2 para diferenciar
  category_id,
  cost_price,
  price,
  stock,
  2 as store_id  -- Loja 2 (feira)
FROM products 
WHERE category_id = 290 
  AND store_id = 1;

-- VERIFICAÇÃO DA DUPLICAÇÃO
SELECT 
  store_id,
  CASE 
    WHEN store_id = 1 THEN 'Loja 1 (Principal)'
    WHEN store_id = 2 THEN 'Loja 2 (Feira)'
  END as loja_nome,
  COUNT(*) as total_produtos,
  MIN(price) as menor_preco,
  MAX(price) as maior_preco,
  AVG(price) as preco_medio
FROM products 
WHERE category_id = 290 
GROUP BY store_id, 
  CASE 
    WHEN store_id = 1 THEN 'Loja 1 (Principal)'
    WHEN store_id = 2 THEN 'Loja 2 (Feira)'
  END
ORDER BY store_id;

-- EXEMPLOS DE PRODUTOS DUPLICADOS
SELECT 
  name,
  sku,
  store_id,
  cost_price,
  price
FROM products 
WHERE category_id = 290 
  AND (sku LIKE 'PLC0001%' OR sku LIKE 'PLC0002%' OR sku LIKE 'PLC0003%')
ORDER BY name, store_id;
