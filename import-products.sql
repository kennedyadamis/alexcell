-- Script SQL para importação de produtos da planilha Tiaguinho Cell
-- Este script deve ser executado diretamente no banco de dados

-- Primeiro, vamos garantir que temos as lojas necessárias
INSERT INTO stores (name) VALUES 
('Alexxcell Paraíso Sul'),
('Alexcell Feira')
ON CONFLICT (name) DO NOTHING;

-- Vamos buscar os IDs das lojas para usar na importação
DO $$
DECLARE
    loja1_id INTEGER;
    loja2_id INTEGER;
    categoria_motorola_id INTEGER;
    categoria_samsung_id INTEGER;
    categoria_xiaomi_id INTEGER;
    categoria_iphone_id INTEGER;
BEGIN
    -- Busca os IDs das lojas
    SELECT id INTO loja1_id FROM stores WHERE name = 'Alexxcell Paraíso Sul' LIMIT 1;
    SELECT id INTO loja2_id FROM stores WHERE name = 'Alexcell Feira' LIMIT 1;
    
    -- Busca os IDs das categorias
    SELECT id INTO categoria_motorola_id FROM categories WHERE name = 'Frontais Motorola' LIMIT 1;
    SELECT id INTO categoria_samsung_id FROM categories WHERE name = 'Frontais Samsung' LIMIT 1;
    SELECT id INTO categoria_xiaomi_id FROM categories WHERE name = 'Frontais Xiaomi' LIMIT 1;
    SELECT id INTO categoria_iphone_id FROM categories WHERE name = 'Frontais iPhone' LIMIT 1;
    
    -- Função para calcular preço de venda
    CREATE OR REPLACE FUNCTION calculate_sale_price(cost_price NUMERIC) RETURNS INTEGER AS $func$
    BEGIN
        IF cost_price < 65 THEN
            RETURN ROUND(cost_price * 1.5);
        ELSIF cost_price >= 66 AND cost_price <= 80 THEN
            RETURN ROUND(cost_price * 1.1);
        ELSIF cost_price >= 80 AND cost_price <= 120 THEN
            RETURN ROUND(cost_price * 1.3);
        ELSE
            RETURN ROUND(cost_price * 1.0);
        END IF;
    END;
    $func$ LANGUAGE plpgsql;
    
    -- Produtos MOTOROLA (baseado na análise da planilha)
    INSERT INTO products (name, cost_price, sale_price, category_id, store_id) VALUES
    ('G1', 70, calculate_sale_price(70), categoria_motorola_id, loja1_id),
    ('G1', 70, calculate_sale_price(70), categoria_motorola_id, loja2_id),
    ('G2', 50, calculate_sale_price(50), categoria_motorola_id, loja1_id),
    ('G2', 50, calculate_sale_price(50), categoria_motorola_id, loja2_id),
    ('G3', 60, calculate_sale_price(60), categoria_motorola_id, loja1_id),
    ('G3', 60, calculate_sale_price(60), categoria_motorola_id, loja2_id),
    ('G4 com aro', 90, calculate_sale_price(90), categoria_motorola_id, loja1_id),
    ('G4 com aro', 90, calculate_sale_price(90), categoria_motorola_id, loja2_id),
    ('G4 play com aro', 80, calculate_sale_price(80), categoria_motorola_id, loja1_id),
    ('G4 play com aro', 80, calculate_sale_price(80), categoria_motorola_id, loja2_id),
    ('G5', 65, calculate_sale_price(65), categoria_motorola_id, loja1_id),
    ('G5', 65, calculate_sale_price(65), categoria_motorola_id, loja2_id),
    ('G5 plus', 60, calculate_sale_price(60), categoria_motorola_id, loja1_id),
    ('G5 plus', 60, calculate_sale_price(60), categoria_motorola_id, loja2_id),
    ('G5s', 60, calculate_sale_price(60), categoria_motorola_id, loja1_id),
    ('G5s', 60, calculate_sale_price(60), categoria_motorola_id, loja2_id),
    ('G5s plus', 65, calculate_sale_price(65), categoria_motorola_id, loja1_id),
    ('G5s plus', 65, calculate_sale_price(65), categoria_motorola_id, loja2_id);
    
    -- Produtos SAMSUNG (baseado na análise da planilha)
    INSERT INTO products (name, cost_price, sale_price, category_id, store_id) VALUES
    ('J120 similar', 40, calculate_sale_price(40), categoria_samsung_id, loja1_id),
    ('J120 similar', 40, calculate_sale_price(40), categoria_samsung_id, loja2_id),
    ('J120 incell', 60, calculate_sale_price(60), categoria_samsung_id, loja1_id),
    ('J120 incell', 60, calculate_sale_price(60), categoria_samsung_id, loja2_id),
    ('J2 similar', 50, calculate_sale_price(50), categoria_samsung_id, loja1_id),
    ('J2 similar', 50, calculate_sale_price(50), categoria_samsung_id, loja2_id),
    ('J2 incell', 60, calculate_sale_price(60), categoria_samsung_id, loja1_id),
    ('J2 incell', 60, calculate_sale_price(60), categoria_samsung_id, loja2_id),
    ('J2 pro similar', 45, calculate_sale_price(45), categoria_samsung_id, loja1_id),
    ('J2 pro similar', 45, calculate_sale_price(45), categoria_samsung_id, loja2_id),
    ('J2 pro incell', 65, calculate_sale_price(65), categoria_samsung_id, loja1_id),
    ('J2 pro incell', 65, calculate_sale_price(65), categoria_samsung_id, loja2_id),
    ('J2 core', 55, calculate_sale_price(55), categoria_samsung_id, loja1_id),
    ('J2 core', 55, calculate_sale_price(55), categoria_samsung_id, loja2_id),
    ('J3 similar', 45, calculate_sale_price(45), categoria_samsung_id, loja1_id),
    ('J3 similar', 45, calculate_sale_price(45), categoria_samsung_id, loja2_id),
    ('J3 incell', 60, calculate_sale_price(60), categoria_samsung_id, loja1_id),
    ('J3 incell', 60, calculate_sale_price(60), categoria_samsung_id, loja2_id);
    
    -- Produtos XIAOMI (baseado na análise da planilha)
    INSERT INTO products (name, cost_price, sale_price, category_id, store_id) VALUES
    ('Mi play', 110, calculate_sale_price(110), categoria_xiaomi_id, loja1_id),
    ('Mi play', 110, calculate_sale_price(110), categoria_xiaomi_id, loja2_id),
    ('Mi go/Mi 5A', 85, calculate_sale_price(85), categoria_xiaomi_id, loja1_id),
    ('Mi go/Mi 5A', 85, calculate_sale_price(85), categoria_xiaomi_id, loja2_id),
    ('Mi 3', 120, calculate_sale_price(120), categoria_xiaomi_id, loja1_id),
    ('Mi 3', 120, calculate_sale_price(120), categoria_xiaomi_id, loja2_id),
    ('Mi 5', 120, calculate_sale_price(120), categoria_xiaomi_id, loja1_id),
    ('Mi 5', 120, calculate_sale_price(120), categoria_xiaomi_id, loja2_id),
    ('Mi a1', 100, calculate_sale_price(100), categoria_xiaomi_id, loja1_id),
    ('Mi a1', 100, calculate_sale_price(100), categoria_xiaomi_id, loja2_id),
    ('Mi a2', 70, calculate_sale_price(70), categoria_xiaomi_id, loja1_id),
    ('Mi a2', 70, calculate_sale_price(70), categoria_xiaomi_id, loja2_id),
    ('Mi a2 lite', 75, calculate_sale_price(75), categoria_xiaomi_id, loja1_id),
    ('Mi a2 lite', 75, calculate_sale_price(75), categoria_xiaomi_id, loja2_id),
    ('Mi a3 incell', 80, calculate_sale_price(80), categoria_xiaomi_id, loja1_id),
    ('Mi a3 incell', 80, calculate_sale_price(80), categoria_xiaomi_id, loja2_id),
    ('Mi a3 oled', 270, calculate_sale_price(270), categoria_xiaomi_id, loja1_id),
    ('Mi a3 oled', 270, calculate_sale_price(270), categoria_xiaomi_id, loja2_id);
    
    -- Produtos IPHONE (baseado na análise da planilha)
    INSERT INTO products (name, cost_price, sale_price, category_id, store_id) VALUES
    ('iPhone SE 2020', 70, calculate_sale_price(70), categoria_iphone_id, loja1_id),
    ('iPhone SE 2020', 70, calculate_sale_price(70), categoria_iphone_id, loja2_id),
    ('iPhone 5G', 60, calculate_sale_price(60), categoria_iphone_id, loja1_id),
    ('iPhone 5G', 60, calculate_sale_price(60), categoria_iphone_id, loja2_id),
    ('iPhone 5C', 60, calculate_sale_price(60), categoria_iphone_id, loja1_id),
    ('iPhone 5C', 60, calculate_sale_price(60), categoria_iphone_id, loja2_id),
    ('iPhone 5S/5SE', 70, calculate_sale_price(70), categoria_iphone_id, loja1_id),
    ('iPhone 5S/5SE', 70, calculate_sale_price(70), categoria_iphone_id, loja2_id),
    ('iPhone 6G', 55, calculate_sale_price(55), categoria_iphone_id, loja1_id),
    ('iPhone 6G', 55, calculate_sale_price(55), categoria_iphone_id, loja2_id),
    ('iPhone 6s', 65, calculate_sale_price(65), categoria_iphone_id, loja1_id),
    ('iPhone 6s', 65, calculate_sale_price(65), categoria_iphone_id, loja2_id),
    ('iPhone 6 Plus', 70, calculate_sale_price(70), categoria_iphone_id, loja1_id),
    ('iPhone 6 Plus', 70, calculate_sale_price(70), categoria_iphone_id, loja2_id),
    ('iPhone 6S Plus', 80, calculate_sale_price(80), categoria_iphone_id, loja1_id),
    ('iPhone 6S Plus', 80, calculate_sale_price(80), categoria_iphone_id, loja2_id),
    ('iPhone 7G', 70, calculate_sale_price(70), categoria_iphone_id, loja1_id),
    ('iPhone 7G', 70, calculate_sale_price(70), categoria_iphone_id, loja2_id);
    
    -- Remove a função temporária
    DROP FUNCTION calculate_sale_price(NUMERIC);
    
    RAISE NOTICE 'Importação concluída com sucesso!';
    RAISE NOTICE 'Produtos importados para as lojas: % e %', loja1_id, loja2_id;
    
END $$;