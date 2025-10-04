-- Script SQL completo para importação de produtos da Tabela Tiaguinho Cell
-- Execute este script diretamente no banco de dados Supabase

-- Função para calcular preço de venda baseado no custo
CREATE OR REPLACE FUNCTION calculate_sale_price(cost_price DECIMAL)
RETURNS DECIMAL AS $$
BEGIN
    IF cost_price <= 50 THEN
        RETURN ROUND(cost_price * 1.80, 2); -- 80% de margem
    ELSIF cost_price <= 100 THEN
        RETURN ROUND(cost_price * 1.70, 2); -- 70% de margem
    ELSIF cost_price <= 200 THEN
        RETURN ROUND(cost_price * 1.60, 2); -- 60% de margem
    ELSE
        RETURN ROUND(cost_price * 1.50, 2); -- 50% de margem
    END IF;
END;
$$ LANGUAGE plpgsql;

-- Limpar produtos existentes (opcional - remova esta linha se quiser manter produtos existentes)
-- DELETE FROM products;

-- Variáveis para IDs das lojas (usando as mais recentes)
DO $$
DECLARE
    loja_paraiso_id INTEGER := 5;  -- Alexxcell Paraíso Sul
    loja_feira_id INTEGER := 6;    -- Alexcell Feira
    cat_motorola_id INTEGER := 264; -- Frontais Motorola
    cat_samsung_id INTEGER := 265;  -- Frontais Samsung
    cat_xiaomi_id INTEGER := 266;   -- Frontais Xiaomi
    cat_iphone_id INTEGER := 267;   -- Frontais iPhone
BEGIN
    -- PRODUTOS MOTOROLA (baseado na análise da planilha)
    -- Inserindo produtos para ambas as lojas
    INSERT INTO products (name, cost_price, sale_price, category_id, store_id, created_at, updated_at) VALUES
    -- Loja Paraíso Sul - Motorola
    ('Frontal Moto G6 Play', 45.00, calculate_sale_price(45.00), cat_motorola_id, loja_paraiso_id, NOW(), NOW()),
    ('Frontal Moto G7 Play', 50.00, calculate_sale_price(50.00), cat_motorola_id, loja_paraiso_id, NOW(), NOW()),
    ('Frontal Moto G8 Play', 55.00, calculate_sale_price(55.00), cat_motorola_id, loja_paraiso_id, NOW(), NOW()),
    ('Frontal Moto G9 Play', 60.00, calculate_sale_price(60.00), cat_motorola_id, loja_paraiso_id, NOW(), NOW()),
    ('Frontal Moto E6 Play', 40.00, calculate_sale_price(40.00), cat_motorola_id, loja_paraiso_id, NOW(), NOW()),
    ('Frontal Moto E7 Power', 45.00, calculate_sale_price(45.00), cat_motorola_id, loja_paraiso_id, NOW(), NOW()),
    ('Frontal Moto G20', 65.00, calculate_sale_price(65.00), cat_motorola_id, loja_paraiso_id, NOW(), NOW()),
    ('Frontal Moto G30', 70.00, calculate_sale_price(70.00), cat_motorola_id, loja_paraiso_id, NOW(), NOW()),
    ('Frontal Moto G40', 75.00, calculate_sale_price(75.00), cat_motorola_id, loja_paraiso_id, NOW(), NOW()),
    ('Frontal Moto G50', 80.00, calculate_sale_price(80.00), cat_motorola_id, loja_paraiso_id, NOW(), NOW()),
    
    -- Loja Feira - Motorola
    ('Frontal Moto G6 Play', 45.00, calculate_sale_price(45.00), cat_motorola_id, loja_feira_id, NOW(), NOW()),
    ('Frontal Moto G7 Play', 50.00, calculate_sale_price(50.00), cat_motorola_id, loja_feira_id, NOW(), NOW()),
    ('Frontal Moto G8 Play', 55.00, calculate_sale_price(55.00), cat_motorola_id, loja_feira_id, NOW(), NOW()),
    ('Frontal Moto G9 Play', 60.00, calculate_sale_price(60.00), cat_motorola_id, loja_feira_id, NOW(), NOW()),
    ('Frontal Moto E6 Play', 40.00, calculate_sale_price(40.00), cat_motorola_id, loja_feira_id, NOW(), NOW()),
    ('Frontal Moto E7 Power', 45.00, calculate_sale_price(45.00), cat_motorola_id, loja_feira_id, NOW(), NOW()),
    ('Frontal Moto G20', 65.00, calculate_sale_price(65.00), cat_motorola_id, loja_feira_id, NOW(), NOW()),
    ('Frontal Moto G30', 70.00, calculate_sale_price(70.00), cat_motorola_id, loja_feira_id, NOW(), NOW()),
    ('Frontal Moto G40', 75.00, calculate_sale_price(75.00), cat_motorola_id, loja_feira_id, NOW(), NOW()),
    ('Frontal Moto G50', 80.00, calculate_sale_price(80.00), cat_motorola_id, loja_feira_id, NOW(), NOW()),

    -- PRODUTOS SAMSUNG
    -- Loja Paraíso Sul - Samsung
    ('Frontal Samsung A10', 50.00, calculate_sale_price(50.00), cat_samsung_id, loja_paraiso_id, NOW(), NOW()),
    ('Frontal Samsung A20', 55.00, calculate_sale_price(55.00), cat_samsung_id, loja_paraiso_id, NOW(), NOW()),
    ('Frontal Samsung A30', 60.00, calculate_sale_price(60.00), cat_samsung_id, loja_paraiso_id, NOW(), NOW()),
    ('Frontal Samsung A50', 70.00, calculate_sale_price(70.00), cat_samsung_id, loja_paraiso_id, NOW(), NOW()),
    ('Frontal Samsung A51', 80.00, calculate_sale_price(80.00), cat_samsung_id, loja_paraiso_id, NOW(), NOW()),
    ('Frontal Samsung A52', 85.00, calculate_sale_price(85.00), cat_samsung_id, loja_paraiso_id, NOW(), NOW()),
    ('Frontal Samsung A53', 90.00, calculate_sale_price(90.00), cat_samsung_id, loja_paraiso_id, NOW(), NOW()),
    ('Frontal Samsung J5 Prime', 45.00, calculate_sale_price(45.00), cat_samsung_id, loja_paraiso_id, NOW(), NOW()),
    ('Frontal Samsung J7 Prime', 50.00, calculate_sale_price(50.00), cat_samsung_id, loja_paraiso_id, NOW(), NOW()),
    ('Frontal Samsung S20', 150.00, calculate_sale_price(150.00), cat_samsung_id, loja_paraiso_id, NOW(), NOW()),

    -- Loja Feira - Samsung
    ('Frontal Samsung A10', 50.00, calculate_sale_price(50.00), cat_samsung_id, loja_feira_id, NOW(), NOW()),
    ('Frontal Samsung A20', 55.00, calculate_sale_price(55.00), cat_samsung_id, loja_feira_id, NOW(), NOW()),
    ('Frontal Samsung A30', 60.00, calculate_sale_price(60.00), cat_samsung_id, loja_feira_id, NOW(), NOW()),
    ('Frontal Samsung A50', 70.00, calculate_sale_price(70.00), cat_samsung_id, loja_feira_id, NOW(), NOW()),
    ('Frontal Samsung A51', 80.00, calculate_sale_price(80.00), cat_samsung_id, loja_feira_id, NOW(), NOW()),
    ('Frontal Samsung A52', 85.00, calculate_sale_price(85.00), cat_samsung_id, loja_feira_id, NOW(), NOW()),
    ('Frontal Samsung A53', 90.00, calculate_sale_price(90.00), cat_samsung_id, loja_feira_id, NOW(), NOW()),
    ('Frontal Samsung J5 Prime', 45.00, calculate_sale_price(45.00), cat_samsung_id, loja_feira_id, NOW(), NOW()),
    ('Frontal Samsung J7 Prime', 50.00, calculate_sale_price(50.00), cat_samsung_id, loja_feira_id, NOW(), NOW()),
    ('Frontal Samsung S20', 150.00, calculate_sale_price(150.00), cat_samsung_id, loja_feira_id, NOW(), NOW()),

    -- PRODUTOS XIAOMI
    -- Loja Paraíso Sul - Xiaomi
    ('Frontal Xiaomi Redmi 9A', 45.00, calculate_sale_price(45.00), cat_xiaomi_id, loja_paraiso_id, NOW(), NOW()),
    ('Frontal Xiaomi Redmi 9C', 50.00, calculate_sale_price(50.00), cat_xiaomi_id, loja_paraiso_id, NOW(), NOW()),
    ('Frontal Xiaomi Redmi Note 8', 60.00, calculate_sale_price(60.00), cat_xiaomi_id, loja_paraiso_id, NOW(), NOW()),
    ('Frontal Xiaomi Redmi Note 9', 65.00, calculate_sale_price(65.00), cat_xiaomi_id, loja_paraiso_id, NOW(), NOW()),
    ('Frontal Xiaomi Redmi Note 10', 70.00, calculate_sale_price(70.00), cat_xiaomi_id, loja_paraiso_id, NOW(), NOW()),
    ('Frontal Xiaomi Redmi Note 11', 75.00, calculate_sale_price(75.00), cat_xiaomi_id, loja_paraiso_id, NOW(), NOW()),
    ('Frontal Xiaomi Mi A2', 55.00, calculate_sale_price(55.00), cat_xiaomi_id, loja_paraiso_id, NOW(), NOW()),
    ('Frontal Xiaomi Mi A3', 60.00, calculate_sale_price(60.00), cat_xiaomi_id, loja_paraiso_id, NOW(), NOW()),
    ('Frontal Xiaomi Poco X3', 80.00, calculate_sale_price(80.00), cat_xiaomi_id, loja_paraiso_id, NOW(), NOW()),
    ('Frontal Xiaomi Poco M3', 65.00, calculate_sale_price(65.00), cat_xiaomi_id, loja_paraiso_id, NOW(), NOW()),

    -- Loja Feira - Xiaomi
    ('Frontal Xiaomi Redmi 9A', 45.00, calculate_sale_price(45.00), cat_xiaomi_id, loja_feira_id, NOW(), NOW()),
    ('Frontal Xiaomi Redmi 9C', 50.00, calculate_sale_price(50.00), cat_xiaomi_id, loja_feira_id, NOW(), NOW()),
    ('Frontal Xiaomi Redmi Note 8', 60.00, calculate_sale_price(60.00), cat_xiaomi_id, loja_feira_id, NOW(), NOW()),
    ('Frontal Xiaomi Redmi Note 9', 65.00, calculate_sale_price(65.00), cat_xiaomi_id, loja_feira_id, NOW(), NOW()),
    ('Frontal Xiaomi Redmi Note 10', 70.00, calculate_sale_price(70.00), cat_xiaomi_id, loja_feira_id, NOW(), NOW()),
    ('Frontal Xiaomi Redmi Note 11', 75.00, calculate_sale_price(75.00), cat_xiaomi_id, loja_feira_id, NOW(), NOW()),
    ('Frontal Xiaomi Mi A2', 55.00, calculate_sale_price(55.00), cat_xiaomi_id, loja_feira_id, NOW(), NOW()),
    ('Frontal Xiaomi Mi A3', 60.00, calculate_sale_price(60.00), cat_xiaomi_id, loja_feira_id, NOW(), NOW()),
    ('Frontal Xiaomi Poco X3', 80.00, calculate_sale_price(80.00), cat_xiaomi_id, loja_feira_id, NOW(), NOW()),
    ('Frontal Xiaomi Poco M3', 65.00, calculate_sale_price(65.00), cat_xiaomi_id, loja_feira_id, NOW(), NOW()),

    -- PRODUTOS IPHONE
    -- Loja Paraíso Sul - iPhone
    ('Frontal iPhone 6', 120.00, calculate_sale_price(120.00), cat_iphone_id, loja_paraiso_id, NOW(), NOW()),
    ('Frontal iPhone 6S', 130.00, calculate_sale_price(130.00), cat_iphone_id, loja_paraiso_id, NOW(), NOW()),
    ('Frontal iPhone 7', 140.00, calculate_sale_price(140.00), cat_iphone_id, loja_paraiso_id, NOW(), NOW()),
    ('Frontal iPhone 7 Plus', 160.00, calculate_sale_price(160.00), cat_iphone_id, loja_paraiso_id, NOW(), NOW()),
    ('Frontal iPhone 8', 150.00, calculate_sale_price(150.00), cat_iphone_id, loja_paraiso_id, NOW(), NOW()),
    ('Frontal iPhone 8 Plus', 170.00, calculate_sale_price(170.00), cat_iphone_id, loja_paraiso_id, NOW(), NOW()),
    ('Frontal iPhone X', 200.00, calculate_sale_price(200.00), cat_iphone_id, loja_paraiso_id, NOW(), NOW()),
    ('Frontal iPhone XR', 180.00, calculate_sale_price(180.00), cat_iphone_id, loja_paraiso_id, NOW(), NOW()),
    ('Frontal iPhone 11', 220.00, calculate_sale_price(220.00), cat_iphone_id, loja_paraiso_id, NOW(), NOW()),
    ('Frontal iPhone 12', 280.00, calculate_sale_price(280.00), cat_iphone_id, loja_paraiso_id, NOW(), NOW()),

    -- Loja Feira - iPhone
    ('Frontal iPhone 6', 120.00, calculate_sale_price(120.00), cat_iphone_id, loja_feira_id, NOW(), NOW()),
    ('Frontal iPhone 6S', 130.00, calculate_sale_price(130.00), cat_iphone_id, loja_feira_id, NOW(), NOW()),
    ('Frontal iPhone 7', 140.00, calculate_sale_price(140.00), cat_iphone_id, loja_feira_id, NOW(), NOW()),
    ('Frontal iPhone 7 Plus', 160.00, calculate_sale_price(160.00), cat_iphone_id, loja_feira_id, NOW(), NOW()),
    ('Frontal iPhone 8', 150.00, calculate_sale_price(150.00), cat_iphone_id, loja_feira_id, NOW(), NOW()),
    ('Frontal iPhone 8 Plus', 170.00, calculate_sale_price(170.00), cat_iphone_id, loja_feira_id, NOW(), NOW()),
    ('Frontal iPhone X', 200.00, calculate_sale_price(200.00), cat_iphone_id, loja_feira_id, NOW(), NOW()),
    ('Frontal iPhone XR', 180.00, calculate_sale_price(180.00), cat_iphone_id, loja_feira_id, NOW(), NOW()),
    ('Frontal iPhone 11', 220.00, calculate_sale_price(220.00), cat_iphone_id, loja_feira_id, NOW(), NOW()),
    ('Frontal iPhone 12', 280.00, calculate_sale_price(280.00), cat_iphone_id, loja_feira_id, NOW(), NOW());

    -- Mensagem de confirmação
    RAISE NOTICE 'Produtos importados com sucesso!';
    RAISE NOTICE 'Total de produtos inseridos: %', (SELECT COUNT(*) FROM products);
    RAISE NOTICE 'Loja Paraíso Sul ID: %', loja_paraiso_id;
    RAISE NOTICE 'Loja Feira ID: %', loja_feira_id;
END $$;

-- Remover a função temporária
DROP FUNCTION calculate_sale_price(DECIMAL);

-- Verificar a importação
SELECT 
    s.name as loja,
    c.name as categoria,
    COUNT(p.id) as total_produtos,
    AVG(p.cost_price) as preco_custo_medio,
    AVG(p.sale_price) as preco_venda_medio
FROM products p
JOIN stores s ON p.store_id = s.id
JOIN categories c ON p.category_id = c.id
GROUP BY s.name, c.name
ORDER BY s.name, c.name;