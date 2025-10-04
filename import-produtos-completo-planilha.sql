-- Script SQL para importar todos os produtos da planilha Tabela Tiaguinho cell.xlsx
-- Este script importa produtos para ambas as lojas: Alexxcell Paraíso Sul e Alexcell Feira

-- Primeiro, vamos limpar os produtos existentes (apenas os de teste)
DELETE FROM products WHERE name LIKE '%Frontal%';

-- Função para calcular preço de venda com margem
CREATE OR REPLACE FUNCTION calculate_sale_price(cost_price DECIMAL)
RETURNS DECIMAL AS $$
BEGIN
    CASE 
        WHEN cost_price <= 70 THEN RETURN cost_price * 2.5;  -- 150% margem
        WHEN cost_price <= 150 THEN RETURN cost_price * 2.2; -- 120% margem  
        WHEN cost_price <= 300 THEN RETURN cost_price * 2.0; -- 100% margem
        ELSE RETURN cost_price * 1.8; -- 80% margem
    END CASE;
END;
$$ LANGUAGE plpgsql;

-- Obter IDs das lojas
DO $$
DECLARE
    loja_paraiso_id INTEGER;
    loja_feira_id INTEGER;
    categoria_frontal_motorola_id INTEGER;
    categoria_frontal_samsung_id INTEGER;
    categoria_frontal_xiaomi_id INTEGER;
    categoria_frontal_iphone_id INTEGER;
    categoria_frontal_tecno_id INTEGER;
BEGIN
    -- Buscar IDs das lojas
    SELECT id INTO loja_paraiso_id FROM stores WHERE name = 'Alexxcell Paraíso Sul';
    SELECT id INTO loja_feira_id FROM stores WHERE name = 'Alexcell Feira';
    
    -- Buscar IDs das categorias de Frontais
    SELECT id INTO categoria_frontal_motorola_id FROM categories WHERE name = 'Frontais Motorola';
    SELECT id INTO categoria_frontal_samsung_id FROM categories WHERE name = 'Frontais Samsung';
    SELECT id INTO categoria_frontal_xiaomi_id FROM categories WHERE name = 'Frontais Xiaomi';
    SELECT id INTO categoria_frontal_iphone_id FROM categories WHERE name = 'Frontais iPhone';
    
    -- Criar categoria para Tecno se não existir
    INSERT INTO categories (name, created_at) 
    VALUES ('Frontais Tecno', NOW())
    ON CONFLICT (name) DO NOTHING;
    
    SELECT id INTO categoria_frontal_tecno_id FROM categories WHERE name = 'Frontais Tecno';

    -- PRODUTOS MOTOROLA
    INSERT INTO products (name, sku, price, cost_price, stock, category_id, track_stock, store_id, created_at) VALUES
    -- Loja Paraíso Sul - Motorola
    ('Frontal Motorola G1', 'MOT-G1-PS', calculate_sale_price(70.00), 70.00, 10, categoria_frontal_motorola_id, true, loja_paraiso_id, NOW()),
    ('Frontal Motorola G2', 'MOT-G2-PS', calculate_sale_price(50.00), 50.00, 10, categoria_frontal_motorola_id, true, loja_paraiso_id, NOW()),
    ('Frontal Motorola G3', 'MOT-G3-PS', calculate_sale_price(60.00), 60.00, 10, categoria_frontal_motorola_id, true, loja_paraiso_id, NOW()),
    ('Frontal Motorola G4 com aro', 'MOT-G4-ARO-PS', calculate_sale_price(90.00), 90.00, 10, categoria_frontal_motorola_id, true, loja_paraiso_id, NOW()),
    ('Frontal Motorola G4 play com aro', 'MOT-G4P-ARO-PS', calculate_sale_price(80.00), 80.00, 10, categoria_frontal_motorola_id, true, loja_paraiso_id, NOW()),
    ('Frontal Motorola G5', 'MOT-G5-PS', calculate_sale_price(65.00), 65.00, 10, categoria_frontal_motorola_id, true, loja_paraiso_id, NOW()),
    ('Frontal Motorola G5 plus', 'MOT-G5P-PS', calculate_sale_price(60.00), 60.00, 10, categoria_frontal_motorola_id, true, loja_paraiso_id, NOW()),
    ('Frontal Motorola G5s', 'MOT-G5S-PS', calculate_sale_price(60.00), 60.00, 10, categoria_frontal_motorola_id, true, loja_paraiso_id, NOW()),
    ('Frontal Motorola G5s plus', 'MOT-G5SP-PS', calculate_sale_price(65.00), 65.00, 10, categoria_frontal_motorola_id, true, loja_paraiso_id, NOW()),
    ('Frontal Motorola G5g com aro', 'MOT-G5G-ARO-PS', calculate_sale_price(190.00), 190.00, 10, categoria_frontal_motorola_id, true, loja_paraiso_id, NOW()),
    ('Frontal Motorola G5g plus/G100', 'MOT-G5GP-G100-PS', calculate_sale_price(115.00), 115.00, 10, categoria_frontal_motorola_id, true, loja_paraiso_id, NOW()),
    ('Frontal Motorola G5g plus com aro', 'MOT-G5GP-ARO-PS', calculate_sale_price(220.00), 220.00, 10, categoria_frontal_motorola_id, true, loja_paraiso_id, NOW()),
    ('Frontal Motorola G6', 'MOT-G6-PS', calculate_sale_price(90.00), 90.00, 10, categoria_frontal_motorola_id, true, loja_paraiso_id, NOW()),
    ('Frontal Motorola G6 com aro', 'MOT-G6-ARO-PS', calculate_sale_price(100.00), 100.00, 10, categoria_frontal_motorola_id, true, loja_paraiso_id, NOW()),
    ('Frontal Motorola G6 play/E5', 'MOT-G6P-E5-PS', calculate_sale_price(70.00), 70.00, 10, categoria_frontal_motorola_id, true, loja_paraiso_id, NOW()),
    ('Frontal Motorola G6 play/E5 com aro', 'MOT-G6P-E5-ARO-PS', calculate_sale_price(80.00), 80.00, 10, categoria_frontal_motorola_id, true, loja_paraiso_id, NOW()),
    ('Frontal Motorola G6 plus', 'MOT-G6PLUS-PS', calculate_sale_price(75.00), 75.00, 10, categoria_frontal_motorola_id, true, loja_paraiso_id, NOW()),
    ('Frontal Motorola G6 plus com aro Premium', 'MOT-G6PLUS-ARO-PREM-PS', calculate_sale_price(135.00), 135.00, 10, categoria_frontal_motorola_id, true, loja_paraiso_id, NOW()),
    ('Frontal Motorola G7/G7 plus', 'MOT-G7-G7P-PS', calculate_sale_price(85.00), 85.00, 10, categoria_frontal_motorola_id, true, loja_paraiso_id, NOW()),
    ('Frontal Motorola G7 play', 'MOT-G7P-PS', calculate_sale_price(65.00), 65.00, 10, categoria_frontal_motorola_id, true, loja_paraiso_id, NOW()),
    ('Frontal Motorola G7 play com aro', 'MOT-G7P-ARO-PS', calculate_sale_price(95.00), 95.00, 10, categoria_frontal_motorola_id, true, loja_paraiso_id, NOW()),
    ('Frontal Motorola G7 power', 'MOT-G7POW-PS', calculate_sale_price(75.00), 75.00, 10, categoria_frontal_motorola_id, true, loja_paraiso_id, NOW()),
    ('Frontal Motorola G7 power com aro', 'MOT-G7POW-ARO-PS', calculate_sale_price(100.00), 100.00, 10, categoria_frontal_motorola_id, true, loja_paraiso_id, NOW()),
    ('Frontal Motorola G8 play/One Macro', 'MOT-G8P-MACRO-PS', calculate_sale_price(60.00), 60.00, 10, categoria_frontal_motorola_id, true, loja_paraiso_id, NOW()),
    ('Frontal Motorola G8 play/One Macro com aro', 'MOT-G8P-MACRO-ARO-PS', calculate_sale_price(105.00), 105.00, 10, categoria_frontal_motorola_id, true, loja_paraiso_id, NOW()),
    ('Frontal Motorola G8 play/One Macro com aro Premium', 'MOT-G8P-MACRO-ARO-PREM-PS', calculate_sale_price(130.00), 130.00, 10, categoria_frontal_motorola_id, true, loja_paraiso_id, NOW()),
    ('Frontal Motorola G8 plus', 'MOT-G8PLUS-PS', calculate_sale_price(85.00), 85.00, 10, categoria_frontal_motorola_id, true, loja_paraiso_id, NOW()),
    ('Frontal Motorola G8 plus com aro', 'MOT-G8PLUS-ARO-PS', calculate_sale_price(105.00), 105.00, 10, categoria_frontal_motorola_id, true, loja_paraiso_id, NOW()),
    ('Frontal Motorola G8 power', 'MOT-G8POW-PS', calculate_sale_price(85.00), 85.00, 10, categoria_frontal_motorola_id, true, loja_paraiso_id, NOW()),
    ('Frontal Motorola G8 power com aro', 'MOT-G8POW-ARO-PS', calculate_sale_price(125.00), 125.00, 10, categoria_frontal_motorola_id, true, loja_paraiso_id, NOW()),
    ('Frontal Motorola G8 power lite', 'MOT-G8POW-LITE-PS', calculate_sale_price(70.00), 70.00, 10, categoria_frontal_motorola_id, true, loja_paraiso_id, NOW()),
    ('Frontal Motorola G8 power lite com aro', 'MOT-G8POW-LITE-ARO-PS', calculate_sale_price(90.00), 90.00, 10, categoria_frontal_motorola_id, true, loja_paraiso_id, NOW()),
    ('Frontal Motorola G8', 'MOT-G8-PS', calculate_sale_price(75.00), 75.00, 10, categoria_frontal_motorola_id, true, loja_paraiso_id, NOW()),
    ('Frontal Motorola G8 com aro', 'MOT-G8-ARO-PS', calculate_sale_price(95.00), 95.00, 10, categoria_frontal_motorola_id, true, loja_paraiso_id, NOW()),
    ('Frontal Motorola G9', 'MOT-G9-PS', calculate_sale_price(150.00), 150.00, 10, categoria_frontal_motorola_id, true, loja_paraiso_id, NOW()),
    ('Frontal Motorola G9 play/E7 plus', 'MOT-G9P-E7P-PS', calculate_sale_price(60.00), 60.00, 10, categoria_frontal_motorola_id, true, loja_paraiso_id, NOW()),
    ('Frontal Motorola G9 play/E7 plus com aro', 'MOT-G9P-E7P-ARO-PS', calculate_sale_price(90.00), 90.00, 10, categoria_frontal_motorola_id, true, loja_paraiso_id, NOW()),
    ('Frontal Motorola G9 play/E7 plus com aro Premium', 'MOT-G9P-E7P-ARO-PREM-PS', calculate_sale_price(110.00), 110.00, 10, categoria_frontal_motorola_id, true, loja_paraiso_id, NOW()),
    ('Frontal Motorola G9 plus', 'MOT-G9PLUS-PS', calculate_sale_price(105.00), 105.00, 10, categoria_frontal_motorola_id, true, loja_paraiso_id, NOW()),
    ('Frontal Motorola G9 plus com aro', 'MOT-G9PLUS-ARO-PS', calculate_sale_price(125.00), 125.00, 10, categoria_frontal_motorola_id, true, loja_paraiso_id, NOW()),
    ('Frontal Motorola G9 power', 'MOT-G9POW-PS', calculate_sale_price(90.00), 90.00, 10, categoria_frontal_motorola_id, true, loja_paraiso_id, NOW()),
    ('Frontal Motorola G9 power com aro', 'MOT-G9POW-ARO-PS', calculate_sale_price(130.00), 130.00, 10, categoria_frontal_motorola_id, true, loja_paraiso_id, NOW()),
    ('Frontal Motorola G10/G20/G30', 'MOT-G10-G20-G30-PS', calculate_sale_price(60.00), 60.00, 10, categoria_frontal_motorola_id, true, loja_paraiso_id, NOW()),
    ('Frontal Motorola G10/G20/G30 com aro', 'MOT-G10-G20-G30-ARO-PS', calculate_sale_price(75.00), 75.00, 10, categoria_frontal_motorola_id, true, loja_paraiso_id, NOW()),
    ('Frontal Motorola G10/G20/G30 com aro Premium', 'MOT-G10-G20-G30-ARO-PREM-PS', calculate_sale_price(115.00), 115.00, 10, categoria_frontal_motorola_id, true, loja_paraiso_id, NOW()),
    ('Frontal Motorola G13/G23/G34/G53', 'MOT-G13-G23-G34-G53-PS', calculate_sale_price(85.00), 85.00, 10, categoria_frontal_motorola_id, true, loja_paraiso_id, NOW()),
    ('Frontal Motorola G13 com aro', 'MOT-G13-ARO-PS', calculate_sale_price(120.00), 120.00, 10, categoria_frontal_motorola_id, true, loja_paraiso_id, NOW()),
    ('Frontal Motorola G13 com aro Premium', 'MOT-G13-ARO-PREM-PS', calculate_sale_price(120.00), 120.00, 10, categoria_frontal_motorola_id, true, loja_paraiso_id, NOW()),
    ('Frontal Motorola G14/G54', 'MOT-G14-G54-PS', calculate_sale_price(80.00), 80.00, 10, categoria_frontal_motorola_id, true, loja_paraiso_id, NOW()),
    ('Frontal Motorola G14 com aro Premium', 'MOT-G14-ARO-PREM-PS', calculate_sale_price(170.00), 170.00, 10, categoria_frontal_motorola_id, true, loja_paraiso_id, NOW()),
    ('Frontal Motorola G15/G05', 'MOT-G15-G05-PS', calculate_sale_price(105.00), 105.00, 10, categoria_frontal_motorola_id, true, loja_paraiso_id, NOW()),
    ('Frontal Motorola G15 com aro', 'MOT-G15-ARO-PS', calculate_sale_price(175.00), 175.00, 10, categoria_frontal_motorola_id, true, loja_paraiso_id, NOW()),

    -- Loja Feira - Motorola (duplicando os mesmos produtos)
    ('Frontal Motorola G1', 'MOT-G1-FE', calculate_sale_price(70.00), 70.00, 10, categoria_frontal_motorola_id, true, loja_feira_id, NOW()),
    ('Frontal Motorola G2', 'MOT-G2-FE', calculate_sale_price(50.00), 50.00, 10, categoria_frontal_motorola_id, true, loja_feira_id, NOW()),
    ('Frontal Motorola G3', 'MOT-G3-FE', calculate_sale_price(60.00), 60.00, 10, categoria_frontal_motorola_id, true, loja_feira_id, NOW()),
    ('Frontal Motorola G4 com aro', 'MOT-G4-ARO-FE', calculate_sale_price(90.00), 90.00, 10, categoria_frontal_motorola_id, true, loja_feira_id, NOW()),
    ('Frontal Motorola G4 play com aro', 'MOT-G4P-ARO-FE', calculate_sale_price(80.00), 80.00, 10, categoria_frontal_motorola_id, true, loja_feira_id, NOW()),
    ('Frontal Motorola G5', 'MOT-G5-FE', calculate_sale_price(65.00), 65.00, 10, categoria_frontal_motorola_id, true, loja_feira_id, NOW()),
    ('Frontal Motorola G5 plus', 'MOT-G5P-FE', calculate_sale_price(60.00), 60.00, 10, categoria_frontal_motorola_id, true, loja_feira_id, NOW()),
    ('Frontal Motorola G5s', 'MOT-G5S-FE', calculate_sale_price(60.00), 60.00, 10, categoria_frontal_motorola_id, true, loja_feira_id, NOW()),
    ('Frontal Motorola G5s plus', 'MOT-G5SP-FE', calculate_sale_price(65.00), 65.00, 10, categoria_frontal_motorola_id, true, loja_feira_id, NOW()),
    ('Frontal Motorola G5g com aro', 'MOT-G5G-ARO-FE', calculate_sale_price(190.00), 190.00, 10, categoria_frontal_motorola_id, true, loja_feira_id, NOW()),
    ('Frontal Motorola G5g plus/G100', 'MOT-G5GP-G100-FE', calculate_sale_price(115.00), 115.00, 10, categoria_frontal_motorola_id, true, loja_feira_id, NOW()),
    ('Frontal Motorola G5g plus com aro', 'MOT-G5GP-ARO-FE', calculate_sale_price(220.00), 220.00, 10, categoria_frontal_motorola_id, true, loja_feira_id, NOW()),
    ('Frontal Motorola G6', 'MOT-G6-FE', calculate_sale_price(90.00), 90.00, 10, categoria_frontal_motorola_id, true, loja_feira_id, NOW()),
    ('Frontal Motorola G6 com aro', 'MOT-G6-ARO-FE', calculate_sale_price(100.00), 100.00, 10, categoria_frontal_motorola_id, true, loja_feira_id, NOW()),
    ('Frontal Motorola G6 play/E5', 'MOT-G6P-E5-FE', calculate_sale_price(70.00), 70.00, 10, categoria_frontal_motorola_id, true, loja_feira_id, NOW()),
    ('Frontal Motorola G6 play/E5 com aro', 'MOT-G6P-E5-ARO-FE', calculate_sale_price(80.00), 80.00, 10, categoria_frontal_motorola_id, true, loja_feira_id, NOW()),
    ('Frontal Motorola G6 plus', 'MOT-G6PLUS-FE', calculate_sale_price(75.00), 75.00, 10, categoria_frontal_motorola_id, true, loja_feira_id, NOW()),
    ('Frontal Motorola G6 plus com aro Premium', 'MOT-G6PLUS-ARO-PREM-FE', calculate_sale_price(135.00), 135.00, 10, categoria_frontal_motorola_id, true, loja_feira_id, NOW()),
    ('Frontal Motorola G7/G7 plus', 'MOT-G7-G7P-FE', calculate_sale_price(85.00), 85.00, 10, categoria_frontal_motorola_id, true, loja_feira_id, NOW()),
    ('Frontal Motorola G7 play', 'MOT-G7P-FE', calculate_sale_price(65.00), 65.00, 10, categoria_frontal_motorola_id, true, loja_feira_id, NOW()),
    ('Frontal Motorola G7 play com aro', 'MOT-G7P-ARO-FE', calculate_sale_price(95.00), 95.00, 10, categoria_frontal_motorola_id, true, loja_feira_id, NOW()),
    ('Frontal Motorola G7 power', 'MOT-G7POW-FE', calculate_sale_price(75.00), 75.00, 10, categoria_frontal_motorola_id, true, loja_feira_id, NOW()),
    ('Frontal Motorola G7 power com aro', 'MOT-G7POW-ARO-FE', calculate_sale_price(100.00), 100.00, 10, categoria_frontal_motorola_id, true, loja_feira_id, NOW()),
    ('Frontal Motorola G8 play/One Macro', 'MOT-G8P-MACRO-FE', calculate_sale_price(60.00), 60.00, 10, categoria_frontal_motorola_id, true, loja_feira_id, NOW()),
    ('Frontal Motorola G8 play/One Macro com aro', 'MOT-G8P-MACRO-ARO-FE', calculate_sale_price(105.00), 105.00, 10, categoria_frontal_motorola_id, true, loja_feira_id, NOW()),
    ('Frontal Motorola G8 play/One Macro com aro Premium', 'MOT-G8P-MACRO-ARO-PREM-FE', calculate_sale_price(130.00), 130.00, 10, categoria_frontal_motorola_id, true, loja_feira_id, NOW()),
    ('Frontal Motorola G8 plus', 'MOT-G8PLUS-FE', calculate_sale_price(85.00), 85.00, 10, categoria_frontal_motorola_id, true, loja_feira_id, NOW()),
    ('Frontal Motorola G8 plus com aro', 'MOT-G8PLUS-ARO-FE', calculate_sale_price(105.00), 105.00, 10, categoria_frontal_motorola_id, true, loja_feira_id, NOW()),
    ('Frontal Motorola G8 power', 'MOT-G8POW-FE', calculate_sale_price(85.00), 85.00, 10, categoria_frontal_motorola_id, true, loja_feira_id, NOW()),
    ('Frontal Motorola G8 power com aro', 'MOT-G8POW-ARO-FE', calculate_sale_price(125.00), 125.00, 10, categoria_frontal_motorola_id, true, loja_feira_id, NOW()),
    ('Frontal Motorola G8 power lite', 'MOT-G8POW-LITE-FE', calculate_sale_price(70.00), 70.00, 10, categoria_frontal_motorola_id, true, loja_feira_id, NOW()),
    ('Frontal Motorola G8 power lite com aro', 'MOT-G8POW-LITE-ARO-FE', calculate_sale_price(90.00), 90.00, 10, categoria_frontal_motorola_id, true, loja_feira_id, NOW()),
    ('Frontal Motorola G8', 'MOT-G8-FE', calculate_sale_price(75.00), 75.00, 10, categoria_frontal_motorola_id, true, loja_feira_id, NOW()),
    ('Frontal Motorola G8 com aro', 'MOT-G8-ARO-FE', calculate_sale_price(95.00), 95.00, 10, categoria_frontal_motorola_id, true, loja_feira_id, NOW()),
    ('Frontal Motorola G9', 'MOT-G9-FE', calculate_sale_price(150.00), 150.00, 10, categoria_frontal_motorola_id, true, loja_feira_id, NOW()),
    ('Frontal Motorola G9 play/E7 plus', 'MOT-G9P-E7P-FE', calculate_sale_price(60.00), 60.00, 10, categoria_frontal_motorola_id, true, loja_feira_id, NOW()),
    ('Frontal Motorola G9 play/E7 plus com aro', 'MOT-G9P-E7P-ARO-FE', calculate_sale_price(90.00), 90.00, 10, categoria_frontal_motorola_id, true, loja_feira_id, NOW()),
    ('Frontal Motorola G9 play/E7 plus com aro Premium', 'MOT-G9P-E7P-ARO-PREM-FE', calculate_sale_price(110.00), 110.00, 10, categoria_frontal_motorola_id, true, loja_feira_id, NOW()),
    ('Frontal Motorola G9 plus', 'MOT-G9PLUS-FE', calculate_sale_price(105.00), 105.00, 10, categoria_frontal_motorola_id, true, loja_feira_id, NOW()),
    ('Frontal Motorola G9 plus com aro', 'MOT-G9PLUS-ARO-FE', calculate_sale_price(125.00), 125.00, 10, categoria_frontal_motorola_id, true, loja_feira_id, NOW()),
    ('Frontal Motorola G9 power', 'MOT-G9POW-FE', calculate_sale_price(90.00), 90.00, 10, categoria_frontal_motorola_id, true, loja_feira_id, NOW()),
    ('Frontal Motorola G9 power com aro', 'MOT-G9POW-ARO-FE', calculate_sale_price(130.00), 130.00, 10, categoria_frontal_motorola_id, true, loja_feira_id, NOW()),
    ('Frontal Motorola G10/G20/G30', 'MOT-G10-G20-G30-FE', calculate_sale_price(60.00), 60.00, 10, categoria_frontal_motorola_id, true, loja_feira_id, NOW()),
    ('Frontal Motorola G10/G20/G30 com aro', 'MOT-G10-G20-G30-ARO-FE', calculate_sale_price(75.00), 75.00, 10, categoria_frontal_motorola_id, true, loja_feira_id, NOW()),
    ('Frontal Motorola G10/G20/G30 com aro Premium', 'MOT-G10-G20-G30-ARO-PREM-FE', calculate_sale_price(115.00), 115.00, 10, categoria_frontal_motorola_id, true, loja_feira_id, NOW()),
    ('Frontal Motorola G13/G23/G34/G53', 'MOT-G13-G23-G34-G53-FE', calculate_sale_price(85.00), 85.00, 10, categoria_frontal_motorola_id, true, loja_feira_id, NOW()),
    ('Frontal Motorola G13 com aro', 'MOT-G13-ARO-FE', calculate_sale_price(120.00), 120.00, 10, categoria_frontal_motorola_id, true, loja_feira_id, NOW()),
    ('Frontal Motorola G13 com aro Premium', 'MOT-G13-ARO-PREM-FE', calculate_sale_price(120.00), 120.00, 10, categoria_frontal_motorola_id, true, loja_feira_id, NOW()),
    ('Frontal Motorola G14/G54', 'MOT-G14-G54-FE', calculate_sale_price(80.00), 80.00, 10, categoria_frontal_motorola_id, true, loja_feira_id, NOW()),
    ('Frontal Motorola G14 com aro Premium', 'MOT-G14-ARO-PREM-FE', calculate_sale_price(170.00), 170.00, 10, categoria_frontal_motorola_id, true, loja_feira_id, NOW()),
    ('Frontal Motorola G15/G05', 'MOT-G15-G05-FE', calculate_sale_price(105.00), 105.00, 10, categoria_frontal_motorola_id, true, loja_feira_id, NOW()),
    ('Frontal Motorola G15 com aro', 'MOT-G15-ARO-FE', calculate_sale_price(175.00), 175.00, 10, categoria_frontal_motorola_id, true, loja_feira_id, NOW());

    RAISE NOTICE 'Produtos Motorola importados com sucesso!';
END $$;

-- Limpar função temporária
DROP FUNCTION IF EXISTS calculate_sale_price(DECIMAL);

-- Verificação final
SELECT 
    s.name as loja,
    c.name as categoria,
    COUNT(*) as total_produtos,
    ROUND(AVG(p.cost_price), 2) as preco_custo_medio,
    ROUND(AVG(p.price), 2) as preco_venda_medio,
    ROUND(AVG((p.price - p.cost_price) / p.cost_price * 100), 2) as margem_media_pct
FROM products p
JOIN stores s ON p.store_id = s.id
JOIN categories c ON p.category_id = c.id
WHERE c.name LIKE '%Frontal%'
GROUP BY s.name, c.name
ORDER BY s.name, c.name;