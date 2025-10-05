-- ATUALIZAÇÃO DE PREÇOS - PLACAS DE CARGA
-- Data: 04/10/2025

-- REGRA 1: Produtos até R$30 = Preço fixo R$70,00
UPDATE products 
SET price = 70.00 
WHERE category_id = 290 
  AND cost_price <= 30;

-- REGRA 2: Produtos R$26-50 = Custo + 120% (custo × 2.20)
UPDATE products 
SET price = ROUND(cost_price * 2.20, 2) 
WHERE category_id = 290 
  AND cost_price BETWEEN 26 AND 50;

-- REGRA 3: Produtos acima R$50 = Custo + 130% (custo × 2.30)
UPDATE products 
SET price = ROUND(cost_price * 2.30, 2) 
WHERE category_id = 290 
  AND cost_price > 50;

-- VERIFICAÇÃO DOS PREÇOS ATUALIZADOS
SELECT 
  COUNT(*) as total,
  CASE 
    WHEN cost_price <= 30 THEN 'Até R$30 (R$70 fixo)'
    WHEN cost_price BETWEEN 26 AND 50 THEN 'R$26-50 (+120%)'
    WHEN cost_price > 50 THEN 'Acima R$50 (+130%)'
  END as regra_aplicada,
  MIN(price) as menor_preco,
  MAX(price) as maior_preco,
  AVG(price) as preco_medio
FROM products 
WHERE category_id = 290 
GROUP BY 
  CASE 
    WHEN cost_price <= 30 THEN 'Até R$30 (R$70 fixo)'
    WHEN cost_price BETWEEN 26 AND 50 THEN 'R$26-50 (+120%)'
    WHEN cost_price > 50 THEN 'Acima R$50 (+130%)'
  END
ORDER BY menor_preco;

