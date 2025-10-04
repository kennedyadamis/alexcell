-- =====================================================
-- SCRIPT COMPLETO: IMPORTAÇÃO DE TODOS OS PRODUTOS DA PLANILHA
-- Limpa produtos existentes e importa todos com track_stock = false
-- =====================================================

-- 1. FUNÇÃO PARA CALCULAR PREÇO DE VENDA COM MARGEM ESCALONADA
-- =====================================================
CREATE OR REPLACE FUNCTION calculate_sale_price(cost_price DECIMAL)
RETURNS DECIMAL AS $$
BEGIN
    IF cost_price <= 70 THEN
        RETURN ROUND(cost_price * 2.5, 2);  -- 150% de margem
    ELSIF cost_price <= 150 THEN
        RETURN ROUND(cost_price * 2.2, 2);  -- 120% de margem
    ELSIF cost_price <= 300 THEN
        RETURN ROUND(cost_price * 2.0, 2);  -- 100% de margem
    ELSE
        RETURN ROUND(cost_price * 1.8, 2);  -- 80% de margem
    END IF;
END;
$$ LANGUAGE plpgsql;

-- 2. LIMPEZA E IMPORTAÇÃO DE PRODUTOS
-- =====================================================
DO $$
DECLARE
    loja_paraiso_id UUID;
    loja_feira_id UUID;
    categoria_frontal_motorola_id UUID;
    categoria_frontal_samsung_id UUID;
    categoria_frontal_xiaomi_id UUID;
    categoria_frontal_iphone_id UUID;
    categoria_frontal_tecno_id UUID;
    categoria_frontal_infinix_id UUID;
    categoria_frontal_nokia_id UUID;
    categoria_frontal_lenovo_id UUID;
    categoria_frontal_asus_id UUID;
    categoria_frontal_alcatel_id UUID;
BEGIN
    -- Limpar todos os produtos existentes
    DELETE FROM products WHERE 1=1;
    RAISE NOTICE 'Todos os produtos existentes foram removidos.';
    
    -- Obter IDs das lojas
    SELECT id INTO loja_paraiso_id FROM stores WHERE name = 'Alexxcell Paraíso Sul' LIMIT 1;
    SELECT id INTO loja_feira_id FROM stores WHERE name = 'Alexcell Feira' LIMIT 1;
    
    -- Obter IDs das categorias existentes
    SELECT id INTO categoria_frontal_motorola_id FROM categories WHERE name = 'Frontais Motorola' LIMIT 1;
    SELECT id INTO categoria_frontal_samsung_id FROM categories WHERE name = 'Frontais Samsung' LIMIT 1;
    SELECT id INTO categoria_frontal_xiaomi_id FROM categories WHERE name = 'Frontais Xiaomi' LIMIT 1;
    SELECT id INTO categoria_frontal_iphone_id FROM categories WHERE name = 'Frontais iPhone' LIMIT 1;
    
    -- Criar categorias que não existem
    INSERT INTO categories (id, name, description, created_at, updated_at)
    SELECT gen_random_uuid(), 'Frontais Tecno', 'Frontais para dispositivos Tecno', NOW(), NOW()
    WHERE NOT EXISTS (SELECT 1 FROM categories WHERE name = 'Frontais Tecno')
    RETURNING id INTO categoria_frontal_tecno_id;
    
    IF categoria_frontal_tecno_id IS NULL THEN
        SELECT id INTO categoria_frontal_tecno_id FROM categories WHERE name = 'Frontais Tecno' LIMIT 1;
    END IF;
    
    INSERT INTO categories (id, name, description, created_at, updated_at)
    SELECT gen_random_uuid(), 'Frontais Infinix', 'Frontais para dispositivos Infinix', NOW(), NOW()
    WHERE NOT EXISTS (SELECT 1 FROM categories WHERE name = 'Frontais Infinix')
    RETURNING id INTO categoria_frontal_infinix_id;
    
    IF categoria_frontal_infinix_id IS NULL THEN
        SELECT id INTO categoria_frontal_infinix_id FROM categories WHERE name = 'Frontais Infinix' LIMIT 1;
    END IF;
    
    INSERT INTO categories (id, name, description, created_at, updated_at)
    SELECT gen_random_uuid(), 'Frontais Nokia', 'Frontais para dispositivos Nokia', NOW(), NOW()
    WHERE NOT EXISTS (SELECT 1 FROM categories WHERE name = 'Frontais Nokia')
    RETURNING id INTO categoria_frontal_nokia_id;
    
    IF categoria_frontal_nokia_id IS NULL THEN
        SELECT id INTO categoria_frontal_nokia_id FROM categories WHERE name = 'Frontais Nokia' LIMIT 1;
    END IF;
    
    INSERT INTO categories (id, name, description, created_at, updated_at)
    SELECT gen_random_uuid(), 'Frontais Lenovo', 'Frontais para dispositivos Lenovo', NOW(), NOW()
    WHERE NOT EXISTS (SELECT 1 FROM categories WHERE name = 'Frontais Lenovo')
    RETURNING id INTO categoria_frontal_lenovo_id;
    
    IF categoria_frontal_lenovo_id IS NULL THEN
        SELECT id INTO categoria_frontal_lenovo_id FROM categories WHERE name = 'Frontais Lenovo' LIMIT 1;
    END IF;
    
    INSERT INTO categories (id, name, description, created_at, updated_at)
    SELECT gen_random_uuid(), 'Frontais Asus', 'Frontais para dispositivos Asus', NOW(), NOW()
    WHERE NOT EXISTS (SELECT 1 FROM categories WHERE name = 'Frontais Asus')
    RETURNING id INTO categoria_frontal_asus_id;
    
    IF categoria_frontal_asus_id IS NULL THEN
        SELECT id INTO categoria_frontal_asus_id FROM categories WHERE name = 'Frontais Asus' LIMIT 1;
    END IF;
    
    INSERT INTO categories (id, name, description, created_at, updated_at)
    SELECT gen_random_uuid(), 'Frontais Alcatel', 'Frontais para dispositivos Alcatel', NOW(), NOW()
    WHERE NOT EXISTS (SELECT 1 FROM categories WHERE name = 'Frontais Alcatel')
    RETURNING id INTO categoria_frontal_alcatel_id;
    
    IF categoria_frontal_alcatel_id IS NULL THEN
        SELECT id INTO categoria_frontal_alcatel_id FROM categories WHERE name = 'Frontais Alcatel' LIMIT 1;
    END IF;

-- 4. IMPORTAÇÃO PRODUTOS MOTOROLA
-- =====================================================
    -- Loja Paraíso Sul - Motorola
    INSERT INTO products (id, name, description, sku, price, cost_price, stock, track_stock, category_id, store_id, created_at, updated_at) VALUES
    (gen_random_uuid(), 'Frontal E4', 'Frontal para Motorola E4', 'MOT-E4-PS', calculate_sale_price(50.00), 50.00, 0, false, categoria_frontal_motorola_id, loja_paraiso_id, NOW(), NOW()),
    (gen_random_uuid(), 'Frontal E4 com aro', 'Frontal para Motorola E4 com aro', 'MOT-E4-ARO-PS', calculate_sale_price(70.00), 70.00, 0, false, categoria_frontal_motorola_id, loja_paraiso_id, NOW(), NOW()),
    (gen_random_uuid(), 'Frontal E4 Plus', 'Frontal para Motorola E4 Plus', 'MOT-E4P-PS', calculate_sale_price(50.00), 50.00, 0, false, categoria_frontal_motorola_id, loja_paraiso_id, NOW(), NOW()),
    (gen_random_uuid(), 'Frontal E4 Plus com aro', 'Frontal para Motorola E4 Plus com aro', 'MOT-E4P-ARO-PS', calculate_sale_price(70.00), 70.00, 0, false, categoria_frontal_motorola_id, loja_paraiso_id, NOW(), NOW()),
    (gen_random_uuid(), 'Frontal E5', 'Frontal para Motorola E5', 'MOT-E5-PS', calculate_sale_price(50.00), 50.00, 0, false, categoria_frontal_motorola_id, loja_paraiso_id, NOW(), NOW()),
    (gen_random_uuid(), 'Frontal E5 com aro', 'Frontal para Motorola E5 com aro', 'MOT-E5-ARO-PS', calculate_sale_price(70.00), 70.00, 0, false, categoria_frontal_motorola_id, loja_paraiso_id, NOW(), NOW()),
    (gen_random_uuid(), 'Frontal E5 Plus', 'Frontal para Motorola E5 Plus', 'MOT-E5P-PS', calculate_sale_price(50.00), 50.00, 0, false, categoria_frontal_motorola_id, loja_paraiso_id, NOW(), NOW()),
    (gen_random_uuid(), 'Frontal E5 Plus com aro', 'Frontal para Motorola E5 Plus com aro', 'MOT-E5P-ARO-PS', calculate_sale_price(70.00), 70.00, 0, false, categoria_frontal_motorola_id, loja_paraiso_id, NOW(), NOW()),
    (gen_random_uuid(), 'Frontal E5 Play', 'Frontal para Motorola E5 Play', 'MOT-E5PL-PS', calculate_sale_price(50.00), 50.00, 0, false, categoria_frontal_motorola_id, loja_paraiso_id, NOW(), NOW()),
    (gen_random_uuid(), 'Frontal E5 Play com aro', 'Frontal para Motorola E5 Play com aro', 'MOT-E5PL-ARO-PS', calculate_sale_price(70.00), 70.00, 0, false, categoria_frontal_motorola_id, loja_paraiso_id, NOW(), NOW()),
    (gen_random_uuid(), 'Frontal E6', 'Frontal para Motorola E6', 'MOT-E6-PS', calculate_sale_price(50.00), 50.00, 0, false, categoria_frontal_motorola_id, loja_paraiso_id, NOW(), NOW()),
    (gen_random_uuid(), 'Frontal E6 com aro', 'Frontal para Motorola E6 com aro', 'MOT-E6-ARO-PS', calculate_sale_price(70.00), 70.00, 0, false, categoria_frontal_motorola_id, loja_paraiso_id, NOW(), NOW()),
    (gen_random_uuid(), 'Frontal E6 Plus', 'Frontal para Motorola E6 Plus', 'MOT-E6P-PS', calculate_sale_price(50.00), 50.00, 0, false, categoria_frontal_motorola_id, loja_paraiso_id, NOW(), NOW()),
    (gen_random_uuid(), 'Frontal E6 Plus com aro', 'Frontal para Motorola E6 Plus com aro', 'MOT-E6P-ARO-PS', calculate_sale_price(70.00), 70.00, 0, false, categoria_frontal_motorola_id, loja_paraiso_id, NOW(), NOW()),
    (gen_random_uuid(), 'Frontal E6 Play', 'Frontal para Motorola E6 Play', 'MOT-E6PL-PS', calculate_sale_price(50.00), 50.00, 0, false, categoria_frontal_motorola_id, loja_paraiso_id, NOW(), NOW()),
    (gen_random_uuid(), 'Frontal E6 Play com aro', 'Frontal para Motorola E6 Play com aro', 'MOT-E6PL-ARO-PS', calculate_sale_price(70.00), 70.00, 0, false, categoria_frontal_motorola_id, loja_paraiso_id, NOW(), NOW()),
    (gen_random_uuid(), 'Frontal E6s', 'Frontal para Motorola E6s', 'MOT-E6S-PS', calculate_sale_price(50.00), 50.00, 0, false, categoria_frontal_motorola_id, loja_paraiso_id, NOW(), NOW()),
    (gen_random_uuid(), 'Frontal E6s com aro', 'Frontal para Motorola E6s com aro', 'MOT-E6S-ARO-PS', calculate_sale_price(70.00), 70.00, 0, false, categoria_frontal_motorola_id, loja_paraiso_id, NOW(), NOW()),
    (gen_random_uuid(), 'Frontal E7', 'Frontal para Motorola E7', 'MOT-E7-PS', calculate_sale_price(60.00), 60.00, 0, false, categoria_frontal_motorola_id, loja_paraiso_id, NOW(), NOW()),
    (gen_random_uuid(), 'Frontal E7 com aro', 'Frontal para Motorola E7 com aro', 'MOT-E7-ARO-PS', calculate_sale_price(80.00), 80.00, 0, false, categoria_frontal_motorola_id, loja_paraiso_id, NOW(), NOW()),
    (gen_random_uuid(), 'Frontal E7 Plus', 'Frontal para Motorola E7 Plus', 'MOT-E7P-PS', calculate_sale_price(60.00), 60.00, 0, false, categoria_frontal_motorola_id, loja_paraiso_id, NOW(), NOW()),
    (gen_random_uuid(), 'Frontal E7 Plus com aro', 'Frontal para Motorola E7 Plus com aro', 'MOT-E7P-ARO-PS', calculate_sale_price(80.00), 80.00, 0, false, categoria_frontal_motorola_id, loja_paraiso_id, NOW(), NOW()),
    (gen_random_uuid(), 'Frontal E7 Power', 'Frontal para Motorola E7 Power', 'MOT-E7PW-PS', calculate_sale_price(60.00), 60.00, 0, false, categoria_frontal_motorola_id, loja_paraiso_id, NOW(), NOW()),
    (gen_random_uuid(), 'Frontal E7 Power com aro', 'Frontal para Motorola E7 Power com aro', 'MOT-E7PW-ARO-PS', calculate_sale_price(80.00), 80.00, 0, false, categoria_frontal_motorola_id, loja_paraiso_id, NOW(), NOW()),
    (gen_random_uuid(), 'Frontal G4', 'Frontal para Motorola G4', 'MOT-G4-PS', calculate_sale_price(50.00), 50.00, 0, false, categoria_frontal_motorola_id, loja_paraiso_id, NOW(), NOW()),
    (gen_random_uuid(), 'Frontal G4 com aro', 'Frontal para Motorola G4 com aro', 'MOT-G4-ARO-PS', calculate_sale_price(70.00), 70.00, 0, false, categoria_frontal_motorola_id, loja_paraiso_id, NOW(), NOW()),
    (gen_random_uuid(), 'Frontal G4 Plus', 'Frontal para Motorola G4 Plus', 'MOT-G4P-PS', calculate_sale_price(50.00), 50.00, 0, false, categoria_frontal_motorola_id, loja_paraiso_id, NOW(), NOW()),
    (gen_random_uuid(), 'Frontal G4 Plus com aro', 'Frontal para Motorola G4 Plus com aro', 'MOT-G4P-ARO-PS', calculate_sale_price(70.00), 70.00, 0, false, categoria_frontal_motorola_id, loja_paraiso_id, NOW(), NOW()),
    (gen_random_uuid(), 'Frontal G4 Play', 'Frontal para Motorola G4 Play', 'MOT-G4PL-PS', calculate_sale_price(50.00), 50.00, 0, false, categoria_frontal_motorola_id, loja_paraiso_id, NOW(), NOW()),
    (gen_random_uuid(), 'Frontal G4 Play com aro', 'Frontal para Motorola G4 Play com aro', 'MOT-G4PL-ARO-PS', calculate_sale_price(70.00), 70.00, 0, false, categoria_frontal_motorola_id, loja_paraiso_id, NOW(), NOW()),
    (gen_random_uuid(), 'Frontal G5', 'Frontal para Motorola G5', 'MOT-G5-PS', calculate_sale_price(50.00), 50.00, 0, false, categoria_frontal_motorola_id, loja_paraiso_id, NOW(), NOW()),
    (gen_random_uuid(), 'Frontal G5 com aro', 'Frontal para Motorola G5 com aro', 'MOT-G5-ARO-PS', calculate_sale_price(70.00), 70.00, 0, false, categoria_frontal_motorola_id, loja_paraiso_id, NOW(), NOW()),
    (gen_random_uuid(), 'Frontal G5 Plus', 'Frontal para Motorola G5 Plus', 'MOT-G5P-PS', calculate_sale_price(50.00), 50.00, 0, false, categoria_frontal_motorola_id, loja_paraiso_id, NOW(), NOW()),
    (gen_random_uuid(), 'Frontal G5 Plus com aro', 'Frontal para Motorola G5 Plus com aro', 'MOT-G5P-ARO-PS', calculate_sale_price(70.00), 70.00, 0, false, categoria_frontal_motorola_id, loja_paraiso_id, NOW(), NOW()),
    (gen_random_uuid(), 'Frontal G5s', 'Frontal para Motorola G5s', 'MOT-G5S-PS', calculate_sale_price(50.00), 50.00, 0, false, categoria_frontal_motorola_id, loja_paraiso_id, NOW(), NOW()),
    (gen_random_uuid(), 'Frontal G5s com aro', 'Frontal para Motorola G5s com aro', 'MOT-G5S-ARO-PS', calculate_sale_price(70.00), 70.00, 0, false, categoria_frontal_motorola_id, loja_paraiso_id, NOW(), NOW()),
    (gen_random_uuid(), 'Frontal G5s Plus', 'Frontal para Motorola G5s Plus', 'MOT-G5SP-PS', calculate_sale_price(50.00), 50.00, 0, false, categoria_frontal_motorola_id, loja_paraiso_id, NOW(), NOW()),
    (gen_random_uuid(), 'Frontal G5s Plus com aro', 'Frontal para Motorola G5s Plus com aro', 'MOT-G5SP-ARO-PS', calculate_sale_price(70.00), 70.00, 0, false, categoria_frontal_motorola_id, loja_paraiso_id, NOW(), NOW()),
    (gen_random_uuid(), 'Frontal G6', 'Frontal para Motorola G6', 'MOT-G6-PS', calculate_sale_price(60.00), 60.00, 0, false, categoria_frontal_motorola_id, loja_paraiso_id, NOW(), NOW()),
    (gen_random_uuid(), 'Frontal G6 com aro', 'Frontal para Motorola G6 com aro', 'MOT-G6-ARO-PS', calculate_sale_price(80.00), 80.00, 0, false, categoria_frontal_motorola_id, loja_paraiso_id, NOW(), NOW()),
    (gen_random_uuid(), 'Frontal G6 Plus', 'Frontal para Motorola G6 Plus', 'MOT-G6P-PS', calculate_sale_price(60.00), 60.00, 0, false, categoria_frontal_motorola_id, loja_paraiso_id, NOW(), NOW()),
    (gen_random_uuid(), 'Frontal G6 Plus com aro', 'Frontal para Motorola G6 Plus com aro', 'MOT-G6P-ARO-PS', calculate_sale_price(80.00), 80.00, 0, false, categoria_frontal_motorola_id, loja_paraiso_id, NOW(), NOW()),
    (gen_random_uuid(), 'Frontal G6 Play', 'Frontal para Motorola G6 Play', 'MOT-G6PL-PS', calculate_sale_price(60.00), 60.00, 0, false, categoria_frontal_motorola_id, loja_paraiso_id, NOW(), NOW()),
    (gen_random_uuid(), 'Frontal G6 Play com aro', 'Frontal para Motorola G6 Play com aro', 'MOT-G6PL-ARO-FE', calculate_sale_price(80.00), 80.00, 0, false, categoria_frontal_motorola_id, loja_feira_id, NOW(), NOW()),
    (gen_random_uuid(), 'Frontal G7', 'Frontal para Motorola G7', 'MOT-G7-FE', calculate_sale_price(70.00), 70.00, 0, false, categoria_frontal_motorola_id, loja_feira_id, NOW(), NOW()),
    (gen_random_uuid(), 'Frontal G7 com aro', 'Frontal para Motorola G7 com aro', 'MOT-G7-ARO-FE', calculate_sale_price(90.00), 90.00, 0, false, categoria_frontal_motorola_id, loja_feira_id, NOW(), NOW()),
    (gen_random_uuid(), 'Frontal G7 Plus', 'Frontal para Motorola G7 Plus', 'MOT-G7P-FE', calculate_sale_price(70.00), 70.00, 0, false, categoria_frontal_motorola_id, loja_feira_id, NOW(), NOW()),
    (gen_random_uuid(), 'Frontal G7 Plus com aro', 'Frontal para Motorola G7 Plus com aro', 'MOT-G7P-ARO-FE', calculate_sale_price(90.00), 90.00, 0, false, categoria_frontal_motorola_id, loja_feira_id, NOW(), NOW()),
    (gen_random_uuid(), 'Frontal G7 Play', 'Frontal para Motorola G7 Play', 'MOT-G7PL-FE', calculate_sale_price(70.00), 70.00, 0, false, categoria_frontal_motorola_id, loja_feira_id, NOW(), NOW()),
    (gen_random_uuid(), 'Frontal G7 Play com aro', 'Frontal para Motorola G7 Play com aro', 'MOT-G7PL-ARO-FE', calculate_sale_price(90.00), 90.00, 0, false, categoria_frontal_motorola_id, loja_feira_id, NOW(), NOW()),
    (gen_random_uuid(), 'Frontal G7 Power', 'Frontal para Motorola G7 Power', 'MOT-G7PW-FE', calculate_sale_price(70.00), 70.00, 0, false, categoria_frontal_motorola_id, loja_feira_id, NOW(), NOW()),
    (gen_random_uuid(), 'Frontal G7 Power com aro', 'Frontal para Motorola G7 Power com aro', 'MOT-G7PW-ARO-FE', calculate_sale_price(90.00), 90.00, 0, false, categoria_frontal_motorola_id, loja_feira_id, NOW(), NOW()),
    (gen_random_uuid(), 'Frontal G8', 'Frontal para Motorola G8', 'MOT-G8-FE', calculate_sale_price(80.00), 80.00, 0, false, categoria_frontal_motorola_id, loja_feira_id, NOW(), NOW()),
    (gen_random_uuid(), 'Frontal G8 com aro', 'Frontal para Motorola G8 com aro', 'MOT-G8-ARO-FE', calculate_sale_price(100.00), 100.00, 0, false, categoria_frontal_motorola_id, loja_feira_id, NOW(), NOW()),
    (gen_random_uuid(), 'Frontal G8 Plus', 'Frontal para Motorola G8 Plus', 'MOT-G8P-FE', calculate_sale_price(80.00), 80.00, 0, false, categoria_frontal_motorola_id, loja_feira_id, NOW(), NOW()),
    (gen_random_uuid(), 'Frontal G8 Plus com aro', 'Frontal para Motorola G8 Plus com aro', 'MOT-G8P-ARO-FE', calculate_sale_price(100.00), 100.00, 0, false, categoria_frontal_motorola_id, loja_feira_id, NOW(), NOW()),
    (gen_random_uuid(), 'Frontal G8 Play', 'Frontal para Motorola G8 Play', 'MOT-G8PL-FE', calculate_sale_price(80.00), 80.00, 0, false, categoria_frontal_motorola_id, loja_feira_id, NOW(), NOW()),
    (gen_random_uuid(), 'Frontal G8 Play com aro', 'Frontal para Motorola G8 Play com aro', 'MOT-G8PL-ARO-FE', calculate_sale_price(100.00), 100.00, 0, false, categoria_frontal_motorola_id, loja_feira_id, NOW(), NOW()),
    (gen_random_uuid(), 'Frontal G8 Power', 'Frontal para Motorola G8 Power', 'MOT-G8PW-FE', calculate_sale_price(80.00), 80.00, 0, false, categoria_frontal_motorola_id, loja_feira_id, NOW(), NOW()),
    (gen_random_uuid(), 'Frontal G8 Power com aro', 'Frontal para Motorola G8 Power com aro', 'MOT-G8PW-ARO-FE', calculate_sale_price(100.00), 100.00, 0, false, categoria_frontal_motorola_id, loja_feira_id, NOW(), NOW()),
    (gen_random_uuid(), 'Frontal G9', 'Frontal para Motorola G9', 'MOT-G9-FE', calculate_sale_price(70.00), 70.00, 0, false, categoria_frontal_motorola_id, loja_feira_id, NOW(), NOW()),
    (gen_random_uuid(), 'Frontal G9 com aro', 'Frontal para Motorola G9 com aro', 'MOT-G9-ARO-FE', calculate_sale_price(75.00), 75.00, 0, false, categoria_frontal_motorola_id, loja_feira_id, NOW(), NOW()),
    (gen_random_uuid(), 'Frontal G9 Plus', 'Frontal para Motorola G9 Plus', 'MOT-G9P-FE', calculate_sale_price(80.00), 80.00, 0, false, categoria_frontal_motorola_id, loja_feira_id, NOW(), NOW()),
    (gen_random_uuid(), 'Frontal G9 Plus com aro', 'Frontal para Motorola G9 Plus com aro', 'MOT-G9P-ARO-FE', calculate_sale_price(100.00), 100.00, 0, false, categoria_frontal_motorola_id, loja_feira_id, NOW(), NOW()),
    (gen_random_uuid(), 'Frontal G9 Play', 'Frontal para Motorola G9 Play', 'MOT-G9PL-FE', calculate_sale_price(70.00), 70.00, 0, false, categoria_frontal_motorola_id, loja_feira_id, NOW(), NOW()),
    (gen_random_uuid(), 'Frontal G9 Play com aro', 'Frontal para Motorola G9 Play com aro', 'MOT-G9PL-ARO-FE', calculate_sale_price(85.00), 85.00, 0, false, categoria_frontal_motorola_id, loja_feira_id, NOW(), NOW()),
    (gen_random_uuid(), 'Frontal G9 Power', 'Frontal para Motorola G9 Power', 'MOT-G9PW-FE', calculate_sale_price(70.00), 70.00, 0, false, categoria_frontal_motorola_id, loja_feira_id, NOW(), NOW()),
    (gen_random_uuid(), 'Frontal G9 Power com aro', 'Frontal para Motorola G9 Power com aro', 'MOT-G9PW-ARO-FE', calculate_sale_price(85.00), 85.00, 0, false, categoria_frontal_motorola_id, loja_feira_id, NOW(), NOW()),
    (gen_random_uuid(), 'Frontal G10', 'Frontal para Motorola G10', 'MOT-G10-FE', calculate_sale_price(70.00), 70.00, 0, false, categoria_frontal_motorola_id, loja_feira_id, NOW(), NOW()),
    (gen_random_uuid(), 'Frontal G10 com aro', 'Frontal para Motorola G10 com aro', 'MOT-G10-ARO-FE', calculate_sale_price(85.00), 85.00, 0, false, categoria_frontal_motorola_id, loja_feira_id, NOW(), NOW()),
    (gen_random_uuid(), 'Frontal G10 Power', 'Frontal para Motorola G10 Power', 'MOT-G10PW-FE', calculate_sale_price(70.00), 70.00, 0, false, categoria_frontal_motorola_id, loja_feira_id, NOW(), NOW()),
    (gen_random_uuid(), 'Frontal G10 Power com aro', 'Frontal para Motorola G10 Power com aro', 'MOT-G10PW-ARO-FE', calculate_sale_price(85.00), 85.00, 0, false, categoria_frontal_motorola_id, loja_feira_id, NOW(), NOW()),
    (gen_random_uuid(), 'Frontal G20', 'Frontal para Motorola G20', 'MOT-G20-FE', calculate_sale_price(70.00), 70.00, 0, false, categoria_frontal_motorola_id, loja_feira_id, NOW(), NOW()),
    (gen_random_uuid(), 'Frontal G20 com aro', 'Frontal para Motorola G20 com aro', 'MOT-G20-ARO-FE', calculate_sale_price(85.00), 85.00, 0, false, categoria_frontal_motorola_id, loja_feira_id, NOW(), NOW()),
    (gen_random_uuid(), 'Frontal G30', 'Frontal para Motorola G30', 'MOT-G30-FE', calculate_sale_price(70.00), 70.00, 0, false, categoria_frontal_motorola_id, loja_feira_id, NOW(), NOW()),
    (gen_random_uuid(), 'Frontal G30 com aro', 'Frontal para Motorola G30 com aro', 'MOT-G30-ARO-FE', calculate_sale_price(85.00), 85.00, 0, false, categoria_frontal_motorola_id, loja_feira_id, NOW(), NOW()),
    (gen_random_uuid(), 'Frontal G40', 'Frontal para Motorola G40', 'MOT-G40-FE', calculate_sale_price(80.00), 80.00, 0, false, categoria_frontal_motorola_id, loja_feira_id, NOW(), NOW()),
    (gen_random_uuid(), 'Frontal G40 com aro', 'Frontal para Motorola G40 com aro', 'MOT-G40-ARO-FE', calculate_sale_price(100.00), 100.00, 0, false, categoria_frontal_motorola_id, loja_feira_id, NOW(), NOW()),
    (gen_random_uuid(), 'Frontal G50', 'Frontal para Motorola G50', 'MOT-G50-FE', calculate_sale_price(80.00), 80.00, 0, false, categoria_frontal_motorola_id, loja_feira_id, NOW(), NOW()),
    (gen_random_uuid(), 'Frontal G50 com aro', 'Frontal para Motorola G50 com aro', 'MOT-G50-ARO-FE', calculate_sale_price(100.00), 100.00, 0, false, categoria_frontal_motorola_id, loja_feira_id, NOW(), NOW()),
    (gen_random_uuid(), 'Frontal G60', 'Frontal para Motorola G60', 'MOT-G60-FE', calculate_sale_price(90.00), 90.00, 0, false, categoria_frontal_motorola_id, loja_feira_id, NOW(), NOW()),
    (gen_random_uuid(), 'Frontal G60 com aro', 'Frontal para Motorola G60 com aro', 'MOT-G60-ARO-FE', calculate_sale_price(110.00), 110.00, 0, false, categoria_frontal_motorola_id, loja_feira_id, NOW(), NOW()),
    (gen_random_uuid(), 'Frontal G60s', 'Frontal para Motorola G60s', 'MOT-G60S-FE', calculate_sale_price(90.00), 90.00, 0, false, categoria_frontal_motorola_id, loja_feira_id, NOW(), NOW()),
    (gen_random_uuid(), 'Frontal G60s com aro', 'Frontal para Motorola G60s com aro', 'MOT-G60S-ARO-FE', calculate_sale_price(110.00), 110.00, 0, false, categoria_frontal_motorola_id, loja_feira_id, NOW(), NOW()),
    (gen_random_uuid(), 'Frontal G71', 'Frontal para Motorola G71', 'MOT-G71-FE', calculate_sale_price(100.00), 100.00, 0, false, categoria_frontal_motorola_id, loja_feira_id, NOW(), NOW()),
    (gen_random_uuid(), 'Frontal G71 com aro', 'Frontal para Motorola G71 com aro', 'MOT-G71-ARO-FE', calculate_sale_price(120.00), 120.00, 0, false, categoria_frontal_motorola_id, loja_feira_id, NOW(), NOW()),
    (gen_random_uuid(), 'Frontal G100', 'Frontal para Motorola G100', 'MOT-G100-FE', calculate_sale_price(150.00), 150.00, 0, false, categoria_frontal_motorola_id, loja_feira_id, NOW(), NOW()),
    (gen_random_uuid(), 'Frontal G100 com aro', 'Frontal para Motorola G100 com aro', 'MOT-G100-ARO-FE', calculate_sale_price(170.00), 170.00, 0, false, categoria_frontal_motorola_id, loja_feira_id, NOW(), NOW()),
    (gen_random_uuid(), 'Frontal One', 'Frontal para Motorola One', 'MOT-ONE-FE', calculate_sale_price(80.00), 80.00, 0, false, categoria_frontal_motorola_id, loja_feira_id, NOW(), NOW()),
    (gen_random_uuid(), 'Frontal One com aro', 'Frontal para Motorola One com aro', 'MOT-ONE-ARO-FE', calculate_sale_price(100.00), 100.00, 0, false, categoria_frontal_motorola_id, loja_feira_id, NOW(), NOW()),
    (gen_random_uuid(), 'Frontal One Action', 'Frontal para Motorola One Action', 'MOT-ONEACT-FE', calculate_sale_price(80.00), 80.00, 0, false, categoria_frontal_motorola_id, loja_feira_id, NOW(), NOW()),
    (gen_random_uuid(), 'Frontal One Action com aro', 'Frontal para Motorola One Action com aro', 'MOT-ONEACT-ARO-FE', calculate_sale_price(100.00), 100.00, 0, false, categoria_frontal_motorola_id, loja_feira_id, NOW(), NOW()),
    (gen_random_uuid(), 'Frontal One Fusion', 'Frontal para Motorola One Fusion', 'MOT-ONEFUS-FE', calculate_sale_price(90.00), 90.00, 0, false, categoria_frontal_motorola_id, loja_feira_id, NOW(), NOW()),
    (gen_random_uuid(), 'Frontal One Fusion com aro', 'Frontal para Motorola One Fusion com aro', 'MOT-ONEFUS-ARO-FE', calculate_sale_price(110.00), 110.00, 0, false, categoria_frontal_motorola_id, loja_feira_id, NOW(), NOW()),
    (gen_random_uuid(), 'Frontal One Fusion Plus', 'Frontal para Motorola One Fusion Plus', 'MOT-ONEFUSP-FE', calculate_sale_price(90.00), 90.00, 0, false, categoria_frontal_motorola_id, loja_feira_id, NOW(), NOW()),
    (gen_random_uuid(), 'Frontal One Fusion Plus com aro', 'Frontal para Motorola One Fusion Plus com aro', 'MOT-ONEFUSP-ARO-FE', calculate_sale_price(110.00), 110.00, 0, false, categoria_frontal_motorola_id, loja_feira_id, NOW(), NOW()),
    (gen_random_uuid(), 'Frontal One Hyper', 'Frontal para Motorola One Hyper', 'MOT-ONEHYP-FE', calculate_sale_price(100.00), 100.00, 0, false, categoria_frontal_motorola_id, loja_feira_id, NOW(), NOW()),
    (gen_random_uuid(), 'Frontal One Hyper com aro', 'Frontal para Motorola One Hyper com aro', 'MOT-ONEHYP-ARO-FE', calculate_sale_price(120.00), 120.00, 0, false, categoria_frontal_motorola_id, loja_feira_id, NOW(), NOW()),
    (gen_random_uuid(), 'Frontal One Macro', 'Frontal para Motorola One Macro', 'MOT-ONEMAC-FE', calculate_sale_price(80.00), 80.00, 0, false, categoria_frontal_motorola_id, loja_feira_id, NOW(), NOW()),
    (gen_random_uuid(), 'Frontal One Macro com aro', 'Frontal para Motorola One Macro com aro', 'MOT-ONEMAC-ARO-FE', calculate_sale_price(100.00), 100.00, 0, false, categoria_frontal_motorola_id, loja_feira_id, NOW(), NOW()),
    (gen_random_uuid(), 'Frontal One Vision', 'Frontal para Motorola One Vision', 'MOT-ONEVIS-FE', calculate_sale_price(90.00), 90.00, 0, false, categoria_frontal_motorola_id, loja_feira_id, NOW(), NOW()),
    (gen_random_uuid(), 'Frontal One Vision com aro', 'Frontal para Motorola One Vision com aro', 'MOT-ONEVIS-ARO-FE', calculate_sale_price(110.00), 110.00, 0, false, categoria_frontal_motorola_id, loja_feira_id, NOW(), NOW()),
    (gen_random_uuid(), 'Frontal One Zoom', 'Frontal para Motorola One Zoom', 'MOT-ONEZOOM-FE', calculate_sale_price(100.00), 100.00, 0, false, categoria_frontal_motorola_id, loja_feira_id, NOW(), NOW()),
    (gen_random_uuid(), 'Frontal One Zoom com aro', 'Frontal para Motorola One Zoom com aro', 'MOT-ONEZOOM-ARO-FE', calculate_sale_price(120.00), 120.00, 0, false, categoria_frontal_motorola_id, loja_feira_id, NOW(), NOW()),
    (gen_random_uuid(), 'Frontal Edge', 'Frontal para Motorola Edge', 'MOT-EDGE-FE', calculate_sale_price(200.00), 200.00, 0, false, categoria_frontal_motorola_id, loja_feira_id, NOW(), NOW()),
    (gen_random_uuid(), 'Frontal Edge com aro', 'Frontal para Motorola Edge com aro', 'MOT-EDGE-ARO-FE', calculate_sale_price(220.00), 220.00, 0, false, categoria_frontal_motorola_id, loja_feira_id, NOW(), NOW()),
    (gen_random_uuid(), 'Frontal Edge 20', 'Frontal para Motorola Edge 20', 'MOT-EDGE20-FE', calculate_sale_price(180.00), 180.00, 0, false, categoria_frontal_motorola_id, loja_feira_id, NOW(), NOW()),
    (gen_random_uuid(), 'Frontal Edge 20 com aro', 'Frontal para Motorola Edge 20 com aro', 'MOT-EDGE20-ARO-FE', calculate_sale_price(200.00), 200.00, 0, false, categoria_frontal_motorola_id, loja_feira_id, NOW(), NOW()),
    (gen_random_uuid(), 'Frontal Edge 30', 'Frontal para Motorola Edge 30', 'MOT-EDGE30-FE', calculate_sale_price(190.00), 190.00, 0, false, categoria_frontal_motorola_id, loja_feira_id, NOW(), NOW()),
    (gen_random_uuid(), 'Frontal Edge 30 com aro', 'Frontal para Motorola Edge 30 com aro', 'MOT-EDGE30-ARO-FE', calculate_sale_price(210.00), 210.00, 0, false, categoria_frontal_motorola_id, loja_feira_id, NOW(), NOW()),
    (gen_random_uuid(), 'Frontal Edge 40', 'Frontal para Motorola Edge 40', 'MOT-EDGE40-FE', calculate_sale_price(200.00), 200.00, 0, false, categoria_frontal_motorola_id, loja_feira_id, NOW(), NOW()),
    (gen_random_uuid(), 'Frontal Edge 40 com aro', 'Frontal para Motorola Edge 40 com aro', 'MOT-EDGE40-ARO-FE', calculate_sale_price(220.00), 220.00, 0, false, categoria_frontal_motorola_id, loja_feira_id, NOW(), NOW());

    RAISE NOTICE 'Produtos Motorola importados com sucesso para ambas as lojas!';

    -- ========================================
    -- PRODUTOS SAMSUNG
    -- ========================================
    INSERT INTO products (id, name, description, sku, price, cost_price, stock, track_stock, category_id, store_id, created_at, updated_at) VALUES
    -- Samsung para Alexxcell Paraíso Sul
    (gen_random_uuid(), 'Frontal A01', 'Frontal para Samsung A01', 'SAM-A01-PS', calculate_sale_price(50.00), 50.00, 0, false, categoria_frontal_samsung_id, loja_paraiso_id, NOW(), NOW()),
    (gen_random_uuid(), 'Frontal A01 com aro', 'Frontal para Samsung A01 com aro', 'SAM-A01-ARO-PS', calculate_sale_price(70.00), 70.00, 0, false, categoria_frontal_samsung_id, loja_paraiso_id, NOW(), NOW()),
    (gen_random_uuid(), 'Frontal A02', 'Frontal para Samsung A02', 'SAM-A02-PS', calculate_sale_price(50.00), 50.00, 0, false, categoria_frontal_samsung_id, loja_paraiso_id, NOW(), NOW()),
    (gen_random_uuid(), 'Frontal A02 com aro', 'Frontal para Samsung A02 com aro', 'SAM-A02-ARO-PS', calculate_sale_price(70.00), 70.00, 0, false, categoria_frontal_samsung_id, loja_paraiso_id, NOW(), NOW()),
    (gen_random_uuid(), 'Frontal A03', 'Frontal para Samsung A03', 'SAM-A03-PS', calculate_sale_price(50.00), 50.00, 0, false, categoria_frontal_samsung_id, loja_paraiso_id, NOW(), NOW()),
    (gen_random_uuid(), 'Frontal A03 com aro', 'Frontal para Samsung A03 com aro', 'SAM-A03-ARO-PS', calculate_sale_price(70.00), 70.00, 0, false, categoria_frontal_samsung_id, loja_paraiso_id, NOW(), NOW()),
    (gen_random_uuid(), 'Frontal A04', 'Frontal para Samsung A04', 'SAM-A04-PS', calculate_sale_price(55.00), 55.00, 0, false, categoria_frontal_samsung_id, loja_paraiso_id, NOW(), NOW()),
    (gen_random_uuid(), 'Frontal A04 com aro', 'Frontal para Samsung A04 com aro', 'SAM-A04-ARO-PS', calculate_sale_price(75.00), 75.00, 0, false, categoria_frontal_samsung_id, loja_paraiso_id, NOW(), NOW()),
    (gen_random_uuid(), 'Frontal A05', 'Frontal para Samsung A05', 'SAM-A05-PS', calculate_sale_price(55.00), 55.00, 0, false, categoria_frontal_samsung_id, loja_paraiso_id, NOW(), NOW()),
    (gen_random_uuid(), 'Frontal A05 com aro', 'Frontal para Samsung A05 com aro', 'SAM-A05-ARO-PS', calculate_sale_price(75.00), 75.00, 0, false, categoria_frontal_samsung_id, loja_paraiso_id, NOW(), NOW()),
    (gen_random_uuid(), 'Frontal A10', 'Frontal para Samsung A10', 'SAM-A10-PS', calculate_sale_price(60.00), 60.00, 0, false, categoria_frontal_samsung_id, loja_paraiso_id, NOW(), NOW()),
    (gen_random_uuid(), 'Frontal A10 com aro', 'Frontal para Samsung A10 com aro', 'SAM-A10-ARO-PS', calculate_sale_price(80.00), 80.00, 0, false, categoria_frontal_samsung_id, loja_paraiso_id, NOW(), NOW()),
    (gen_random_uuid(), 'Frontal A10s', 'Frontal para Samsung A10s', 'SAM-A10S-PS', calculate_sale_price(60.00), 60.00, 0, false, categoria_frontal_samsung_id, loja_paraiso_id, NOW(), NOW()),
    (gen_random_uuid(), 'Frontal A10s com aro', 'Frontal para Samsung A10s com aro', 'SAM-A10S-ARO-PS', calculate_sale_price(80.00), 80.00, 0, false, categoria_frontal_samsung_id, loja_paraiso_id, NOW(), NOW()),
    (gen_random_uuid(), 'Frontal A11', 'Frontal para Samsung A11', 'SAM-A11-PS', calculate_sale_price(65.00), 65.00, 0, false, categoria_frontal_samsung_id, loja_paraiso_id, NOW(), NOW()),
    (gen_random_uuid(), 'Frontal A11 com aro', 'Frontal para Samsung A11 com aro', 'SAM-A11-ARO-PS', calculate_sale_price(85.00), 85.00, 0, false, categoria_frontal_samsung_id, loja_paraiso_id, NOW(), NOW()),
    (gen_random_uuid(), 'Frontal A12', 'Frontal para Samsung A12', 'SAM-A12-PS', calculate_sale_price(70.00), 70.00, 0, false, categoria_frontal_samsung_id, loja_paraiso_id, NOW(), NOW()),
    (gen_random_uuid(), 'Frontal A12 com aro', 'Frontal para Samsung A12 com aro', 'SAM-A12-ARO-PS', calculate_sale_price(90.00), 90.00, 0, false, categoria_frontal_samsung_id, loja_paraiso_id, NOW(), NOW()),
    (gen_random_uuid(), 'Frontal A13', 'Frontal para Samsung A13', 'SAM-A13-PS', calculate_sale_price(75.00), 75.00, 0, false, categoria_frontal_samsung_id, loja_paraiso_id, NOW(), NOW()),
    (gen_random_uuid(), 'Frontal A13 com aro', 'Frontal para Samsung A13 com aro', 'SAM-A13-ARO-PS', calculate_sale_price(95.00), 95.00, 0, false, categoria_frontal_samsung_id, loja_paraiso_id, NOW(), NOW()),
    (gen_random_uuid(), 'Frontal A14', 'Frontal para Samsung A14', 'SAM-A14-PS', calculate_sale_price(80.00), 80.00, 0, false, categoria_frontal_samsung_id, loja_paraiso_id, NOW(), NOW()),
    (gen_random_uuid(), 'Frontal A14 com aro', 'Frontal para Samsung A14 com aro', 'SAM-A14-ARO-PS', calculate_sale_price(100.00), 100.00, 0, false, categoria_frontal_samsung_id, loja_paraiso_id, NOW(), NOW()),
    (gen_random_uuid(), 'Frontal A15', 'Frontal para Samsung A15', 'SAM-A15-PS', calculate_sale_price(85.00), 85.00, 0, false, categoria_frontal_samsung_id, loja_paraiso_id, NOW(), NOW()),
    (gen_random_uuid(), 'Frontal A15 com aro', 'Frontal para Samsung A15 com aro', 'SAM-A15-ARO-PS', calculate_sale_price(105.00), 105.00, 0, false, categoria_frontal_samsung_id, loja_paraiso_id, NOW(), NOW()),
    (gen_random_uuid(), 'Frontal A20', 'Frontal para Samsung A20', 'SAM-A20-PS', calculate_sale_price(70.00), 70.00, 0, false, categoria_frontal_samsung_id, loja_paraiso_id, NOW(), NOW()),
    (gen_random_uuid(), 'Frontal A20 com aro', 'Frontal para Samsung A20 com aro', 'SAM-A20-ARO-PS', calculate_sale_price(90.00), 90.00, 0, false, categoria_frontal_samsung_id, loja_paraiso_id, NOW(), NOW()),
    (gen_random_uuid(), 'Frontal A20s', 'Frontal para Samsung A20s', 'SAM-A20S-PS', calculate_sale_price(70.00), 70.00, 0, false, categoria_frontal_samsung_id, loja_paraiso_id, NOW(), NOW()),
    (gen_random_uuid(), 'Frontal A20s com aro', 'Frontal para Samsung A20s com aro', 'SAM-A20S-ARO-PS', calculate_sale_price(90.00), 90.00, 0, false, categoria_frontal_samsung_id, loja_paraiso_id, NOW(), NOW()),
    (gen_random_uuid(), 'Frontal A21', 'Frontal para Samsung A21', 'SAM-A21-PS', calculate_sale_price(75.00), 75.00, 0, false, categoria_frontal_samsung_id, loja_paraiso_id, NOW(), NOW()),
    (gen_random_uuid(), 'Frontal A21 com aro', 'Frontal para Samsung A21 com aro', 'SAM-A21-ARO-PS', calculate_sale_price(95.00), 95.00, 0, false, categoria_frontal_samsung_id, loja_paraiso_id, NOW(), NOW()),
    (gen_random_uuid(), 'Frontal A21s', 'Frontal para Samsung A21s', 'SAM-A21S-PS', calculate_sale_price(75.00), 75.00, 0, false, categoria_frontal_samsung_id, loja_paraiso_id, NOW(), NOW()),
    (gen_random_uuid(), 'Frontal A21s com aro', 'Frontal para Samsung A21s com aro', 'SAM-A21S-ARO-PS', calculate_sale_price(95.00), 95.00, 0, false, categoria_frontal_samsung_id, loja_paraiso_id, NOW(), NOW()),
    (gen_random_uuid(), 'Frontal A22', 'Frontal para Samsung A22', 'SAM-A22-PS', calculate_sale_price(80.00), 80.00, 0, false, categoria_frontal_samsung_id, loja_paraiso_id, NOW(), NOW()),
    (gen_random_uuid(), 'Frontal A22 com aro', 'Frontal para Samsung A22 com aro', 'SAM-A22-ARO-PS', calculate_sale_price(100.00), 100.00, 0, false, categoria_frontal_samsung_id, loja_paraiso_id, NOW(), NOW()),
    (gen_random_uuid(), 'Frontal A23', 'Frontal para Samsung A23', 'SAM-A23-PS', calculate_sale_price(85.00), 85.00, 0, false, categoria_frontal_samsung_id, loja_paraiso_id, NOW(), NOW()),
    (gen_random_uuid(), 'Frontal A23 com aro', 'Frontal para Samsung A23 com aro', 'SAM-A23-ARO-PS', calculate_sale_price(105.00), 105.00, 0, false, categoria_frontal_samsung_id, loja_paraiso_id, NOW(), NOW()),
    (gen_random_uuid(), 'Frontal A24', 'Frontal para Samsung A24', 'SAM-A24-PS', calculate_sale_price(90.00), 90.00, 0, false, categoria_frontal_samsung_id, loja_paraiso_id, NOW(), NOW()),
    (gen_random_uuid(), 'Frontal A24 com aro', 'Frontal para Samsung A24 com aro', 'SAM-A24-ARO-PS', calculate_sale_price(110.00), 110.00, 0, false, categoria_frontal_samsung_id, loja_paraiso_id, NOW(), NOW()),
    (gen_random_uuid(), 'Frontal A25', 'Frontal para Samsung A25', 'SAM-A25-PS', calculate_sale_price(95.00), 95.00, 0, false, categoria_frontal_samsung_id, loja_paraiso_id, NOW(), NOW()),
    (gen_random_uuid(), 'Frontal A25 com aro', 'Frontal para Samsung A25 com aro', 'SAM-A25-ARO-PS', calculate_sale_price(115.00), 115.00, 0, false, categoria_frontal_samsung_id, loja_paraiso_id, NOW(), NOW()),
    (gen_random_uuid(), 'Frontal A30', 'Frontal para Samsung A30', 'SAM-A30-PS', calculate_sale_price(80.00), 80.00, 0, false, categoria_frontal_samsung_id, loja_paraiso_id, NOW(), NOW()),
    (gen_random_uuid(), 'Frontal A30 com aro', 'Frontal para Samsung A30 com aro', 'SAM-A30-ARO-PS', calculate_sale_price(100.00), 100.00, 0, false, categoria_frontal_samsung_id, loja_paraiso_id, NOW(), NOW()),
    (gen_random_uuid(), 'Frontal A30s', 'Frontal para Samsung A30s', 'SAM-A30S-PS', calculate_sale_price(80.00), 80.00, 0, false, categoria_frontal_samsung_id, loja_paraiso_id, NOW(), NOW()),
    (gen_random_uuid(), 'Frontal A30s com aro', 'Frontal para Samsung A30s com aro', 'SAM-A30S-ARO-PS', calculate_sale_price(100.00), 100.00, 0, false, categoria_frontal_samsung_id, loja_paraiso_id, NOW(), NOW()),
    (gen_random_uuid(), 'Frontal A31', 'Frontal para Samsung A31', 'SAM-A31-PS', calculate_sale_price(85.00), 85.00, 0, false, categoria_frontal_samsung_id, loja_paraiso_id, NOW(), NOW()),
    (gen_random_uuid(), 'Frontal A31 com aro', 'Frontal para Samsung A31 com aro', 'SAM-A31-ARO-PS', calculate_sale_price(105.00), 105.00, 0, false, categoria_frontal_samsung_id, loja_paraiso_id, NOW(), NOW()),
    (gen_random_uuid(), 'Frontal A32', 'Frontal para Samsung A32', 'SAM-A32-PS', calculate_sale_price(90.00), 90.00, 0, false, categoria_frontal_samsung_id, loja_paraiso_id, NOW(), NOW()),
    (gen_random_uuid(), 'Frontal A32 com aro', 'Frontal para Samsung A32 com aro', 'SAM-A32-ARO-PS', calculate_sale_price(110.00), 110.00, 0, false, categoria_frontal_samsung_id, loja_paraiso_id, NOW(), NOW()),
    (gen_random_uuid(), 'Frontal A33', 'Frontal para Samsung A33', 'SAM-A33-PS', calculate_sale_price(95.00), 95.00, 0, false, categoria_frontal_samsung_id, loja_paraiso_id, NOW(), NOW()),
    (gen_random_uuid(), 'Frontal A33 com aro', 'Frontal para Samsung A33 com aro', 'SAM-A33-ARO-PS', calculate_sale_price(115.00), 115.00, 0, false, categoria_frontal_samsung_id, loja_paraiso_id, NOW(), NOW()),
    (gen_random_uuid(), 'Frontal A34', 'Frontal para Samsung A34', 'SAM-A34-PS', calculate_sale_price(100.00), 100.00, 0, false, categoria_frontal_samsung_id, loja_paraiso_id, NOW(), NOW()),
    (gen_random_uuid(), 'Frontal A34 com aro', 'Frontal para Samsung A34 com aro', 'SAM-A34-ARO-PS', calculate_sale_price(120.00), 120.00, 0, false, categoria_frontal_samsung_id, loja_paraiso_id, NOW(), NOW()),
    (gen_random_uuid(), 'Frontal A50', 'Frontal para Samsung A50', 'SAM-A50-PS', calculate_sale_price(90.00), 90.00, 0, false, categoria_frontal_samsung_id, loja_paraiso_id, NOW(), NOW()),
    (gen_random_uuid(), 'Frontal A50 com aro', 'Frontal para Samsung A50 com aro', 'SAM-A50-ARO-PS', calculate_sale_price(110.00), 110.00, 0, false, categoria_frontal_samsung_id, loja_paraiso_id, NOW(), NOW()),
    (gen_random_uuid(), 'Frontal A51', 'Frontal para Samsung A51', 'SAM-A51-PS', calculate_sale_price(95.00), 95.00, 0, false, categoria_frontal_samsung_id, loja_paraiso_id, NOW(), NOW()),
    (gen_random_uuid(), 'Frontal A51 com aro', 'Frontal para Samsung A51 com aro', 'SAM-A51-ARO-PS', calculate_sale_price(115.00), 115.00, 0, false, categoria_frontal_samsung_id, loja_paraiso_id, NOW(), NOW()),
    (gen_random_uuid(), 'Frontal A52', 'Frontal para Samsung A52', 'SAM-A52-PS', calculate_sale_price(100.00), 100.00, 0, false, categoria_frontal_samsung_id, loja_paraiso_id, NOW(), NOW()),
    (gen_random_uuid(), 'Frontal A52 com aro', 'Frontal para Samsung A52 com aro', 'SAM-A52-ARO-PS', calculate_sale_price(120.00), 120.00, 0, false, categoria_frontal_samsung_id, loja_paraiso_id, NOW(), NOW()),
    (gen_random_uuid(), 'Frontal A53', 'Frontal para Samsung A53', 'SAM-A53-PS', calculate_sale_price(105.00), 105.00, 0, false, categoria_frontal_samsung_id, loja_paraiso_id, NOW(), NOW()),
    (gen_random_uuid(), 'Frontal A53 com aro', 'Frontal para Samsung A53 com aro', 'SAM-A53-ARO-PS', calculate_sale_price(125.00), 125.00, 0, false, categoria_frontal_samsung_id, loja_paraiso_id, NOW(), NOW()),
    (gen_random_uuid(), 'Frontal A54', 'Frontal para Samsung A54', 'SAM-A54-PS', calculate_sale_price(110.00), 110.00, 0, false, categoria_frontal_samsung_id, loja_paraiso_id, NOW(), NOW()),
    (gen_random_uuid(), 'Frontal A54 com aro', 'Frontal para Samsung A54 com aro', 'SAM-A54-ARO-PS', calculate_sale_price(130.00), 130.00, 0, false, categoria_frontal_samsung_id, loja_paraiso_id, NOW(), NOW()),
    (gen_random_uuid(), 'Frontal A55', 'Frontal para Samsung A55', 'SAM-A55-PS', calculate_sale_price(115.00), 115.00, 0, false, categoria_frontal_samsung_id, loja_paraiso_id, NOW(), NOW()),
    (gen_random_uuid(), 'Frontal A55 com aro', 'Frontal para Samsung A55 com aro', 'SAM-A55-ARO-PS', calculate_sale_price(135.00), 135.00, 0, false, categoria_frontal_samsung_id, loja_paraiso_id, NOW(), NOW()),
    (gen_random_uuid(), 'Frontal A70', 'Frontal para Samsung A70', 'SAM-A70-PS', calculate_sale_price(120.00), 120.00, 0, false, categoria_frontal_samsung_id, loja_paraiso_id, NOW(), NOW()),
    (gen_random_uuid(), 'Frontal A70 com aro', 'Frontal para Samsung A70 com aro', 'SAM-A70-ARO-PS', calculate_sale_price(140.00), 140.00, 0, false, categoria_frontal_samsung_id, loja_paraiso_id, NOW(), NOW()),
    (gen_random_uuid(), 'Frontal A71', 'Frontal para Samsung A71', 'SAM-A71-PS', calculate_sale_price(125.00), 125.00, 0, false, categoria_frontal_samsung_id, loja_paraiso_id, NOW(), NOW()),
    (gen_random_uuid(), 'Frontal A71 com aro', 'Frontal para Samsung A71 com aro', 'SAM-A71-ARO-PS', calculate_sale_price(145.00), 145.00, 0, false, categoria_frontal_samsung_id, loja_paraiso_id, NOW(), NOW()),
    (gen_random_uuid(), 'Frontal A72', 'Frontal para Samsung A72', 'SAM-A72-PS', calculate_sale_price(130.00), 130.00, 0, false, categoria_frontal_samsung_id, loja_paraiso_id, NOW(), NOW()),
    (gen_random_uuid(), 'Frontal A72 com aro', 'Frontal para Samsung A72 com aro', 'SAM-A72-ARO-PS', calculate_sale_price(150.00), 150.00, 0, false, categoria_frontal_samsung_id, loja_paraiso_id, NOW(), NOW()),
    (gen_random_uuid(), 'Frontal A73', 'Frontal para Samsung A73', 'SAM-A73-PS', calculate_sale_price(135.00), 135.00, 0, false, categoria_frontal_samsung_id, loja_paraiso_id, NOW(), NOW()),
    (gen_random_uuid(), 'Frontal A73 com aro', 'Frontal para Samsung A73 com aro', 'SAM-A73-ARO-PS', calculate_sale_price(155.00), 155.00, 0, false, categoria_frontal_samsung_id, loja_paraiso_id, NOW(), NOW()),
    (gen_random_uuid(), 'Frontal S20', 'Frontal para Samsung S20', 'SAM-S20-PS', calculate_sale_price(300.00), 300.00, 0, false, categoria_frontal_samsung_id, loja_paraiso_id, NOW(), NOW()),
    (gen_random_uuid(), 'Frontal S20 com aro', 'Frontal para Samsung S20 com aro', 'SAM-S20-ARO-PS', calculate_sale_price(320.00), 320.00, 0, false, categoria_frontal_samsung_id, loja_paraiso_id, NOW(), NOW()),
    (gen_random_uuid(), 'Frontal S21', 'Frontal para Samsung S21', 'SAM-S21-PS', calculate_sale_price(350.00), 350.00, 0, false, categoria_frontal_samsung_id, loja_paraiso_id, NOW(), NOW()),
    (gen_random_uuid(), 'Frontal S21 com aro', 'Frontal para Samsung S21 com aro', 'SAM-S21-ARO-PS', calculate_sale_price(370.00), 370.00, 0, false, categoria_frontal_samsung_id, loja_paraiso_id, NOW(), NOW()),
    (gen_random_uuid(), 'Frontal S22', 'Frontal para Samsung S22', 'SAM-S22-PS', calculate_sale_price(400.00), 400.00, 0, false, categoria_frontal_samsung_id, loja_paraiso_id, NOW(), NOW()),
    (gen_random_uuid(), 'Frontal S22 com aro', 'Frontal para Samsung S22 com aro', 'SAM-S22-ARO-PS', calculate_sale_price(420.00), 420.00, 0, false, categoria_frontal_samsung_id, loja_paraiso_id, NOW(), NOW()),
    (gen_random_uuid(), 'Frontal S23', 'Frontal para Samsung S23', 'SAM-S23-PS', calculate_sale_price(450.00), 450.00, 0, false, categoria_frontal_samsung_id, loja_paraiso_id, NOW(), NOW()),
    (gen_random_uuid(), 'Frontal S23 com aro', 'Frontal para Samsung S23 com aro', 'SAM-S23-ARO-PS', calculate_sale_price(470.00), 470.00, 0, false, categoria_frontal_samsung_id, loja_paraiso_id, NOW(), NOW()),
    (gen_random_uuid(), 'Frontal S24', 'Frontal para Samsung S24', 'SAM-S24-PS', calculate_sale_price(500.00), 500.00, 0, false, categoria_frontal_samsung_id, loja_paraiso_id, NOW(), NOW()),
    (gen_random_uuid(), 'Frontal S24 com aro', 'Frontal para Samsung S24 com aro', 'SAM-S24-ARO-PS', calculate_sale_price(520.00), 520.00, 0, false, categoria_frontal_samsung_id, loja_paraiso_id, NOW(), NOW()),

    -- Samsung para Alexcell Feira
    (gen_random_uuid(), 'Frontal A01', 'Frontal para Samsung A01', 'SAM-A01-FE', calculate_sale_price(50.00), 50.00, 0, false, categoria_frontal_samsung_id, loja_feira_id, NOW(), NOW()),
    (gen_random_uuid(), 'Frontal A01 com aro', 'Frontal para Samsung A01 com aro', 'SAM-A01-ARO-FE', calculate_sale_price(70.00), 70.00, 0, false, categoria_frontal_samsung_id, loja_feira_id, NOW(), NOW()),
    (gen_random_uuid(), 'Frontal A02', 'Frontal para Samsung A02', 'SAM-A02-FE', calculate_sale_price(50.00), 50.00, 0, false, categoria_frontal_samsung_id, loja_feira_id, NOW(), NOW()),
    (gen_random_uuid(), 'Frontal A02 com aro', 'Frontal para Samsung A02 com aro', 'SAM-A02-ARO-FE', calculate_sale_price(70.00), 70.00, 0, false, categoria_frontal_samsung_id, loja_feira_id, NOW(), NOW()),
    (gen_random_uuid(), 'Frontal A03', 'Frontal para Samsung A03', 'SAM-A03-FE', calculate_sale_price(50.00), 50.00, 0, false, categoria_frontal_samsung_id, loja_feira_id, NOW(), NOW()),
    (gen_random_uuid(), 'Frontal A03 com aro', 'Frontal para Samsung A03 com aro', 'SAM-A03-ARO-FE', calculate_sale_price(70.00), 70.00, 0, false, categoria_frontal_samsung_id, loja_feira_id, NOW(), NOW()),
    (gen_random_uuid(), 'Frontal A04', 'Frontal para Samsung A04', 'SAM-A04-FE', calculate_sale_price(55.00), 55.00, 0, false, categoria_frontal_samsung_id, loja_feira_id, NOW(), NOW()),
    (gen_random_uuid(), 'Frontal A04 com aro', 'Frontal para Samsung A04 com aro', 'SAM-A04-ARO-FE', calculate_sale_price(75.00), 75.00, 0, false, categoria_frontal_samsung_id, loja_feira_id, NOW(), NOW()),
    (gen_random_uuid(), 'Frontal A05', 'Frontal para Samsung A05', 'SAM-A05-FE', calculate_sale_price(55.00), 55.00, 0, false, categoria_frontal_samsung_id, loja_feira_id, NOW(), NOW()),
    (gen_random_uuid(), 'Frontal A05 com aro', 'Frontal para Samsung A05 com aro', 'SAM-A05-ARO-FE', calculate_sale_price(75.00), 75.00, 0, false, categoria_frontal_samsung_id, loja_feira_id, NOW(), NOW()),
    (gen_random_uuid(), 'Frontal A10', 'Frontal para Samsung A10', 'SAM-A10-FE', calculate_sale_price(60.00), 60.00, 0, false, categoria_frontal_samsung_id, loja_feira_id, NOW(), NOW()),
    (gen_random_uuid(), 'Frontal A10 com aro', 'Frontal para Samsung A10 com aro', 'SAM-A10-ARO-FE', calculate_sale_price(80.00), 80.00, 0, false, categoria_frontal_samsung_id, loja_feira_id, NOW(), NOW()),
    (gen_random_uuid(), 'Frontal A10s', 'Frontal para Samsung A10s', 'SAM-A10S-FE', calculate_sale_price(60.00), 60.00, 0, false, categoria_frontal_samsung_id, loja_feira_id, NOW(), NOW()),
    (gen_random_uuid(), 'Frontal A10s com aro', 'Frontal para Samsung A10s com aro', 'SAM-A10S-ARO-FE', calculate_sale_price(80.00), 80.00, 0, false, categoria_frontal_samsung_id, loja_feira_id, NOW(), NOW()),
    (gen_random_uuid(), 'Frontal A11', 'Frontal para Samsung A11', 'SAM-A11-FE', calculate_sale_price(65.00), 65.00, 0, false, categoria_frontal_samsung_id, loja_feira_id, NOW(), NOW()),
    (gen_random_uuid(), 'Frontal A11 com aro', 'Frontal para Samsung A11 com aro', 'SAM-A11-ARO-FE', calculate_sale_price(85.00), 85.00, 0, false, categoria_frontal_samsung_id, loja_feira_id, NOW(), NOW()),
    (gen_random_uuid(), 'Frontal A12', 'Frontal para Samsung A12', 'SAM-A12-FE', calculate_sale_price(70.00), 70.00, 0, false, categoria_frontal_samsung_id, loja_feira_id, NOW(), NOW()),
    (gen_random_uuid(), 'Frontal A12 com aro', 'Frontal para Samsung A12 com aro', 'SAM-A12-ARO-FE', calculate_sale_price(90.00), 90.00, 0, false, categoria_frontal_samsung_id, loja_feira_id, NOW(), NOW()),
    (gen_random_uuid(), 'Frontal A13', 'Frontal para Samsung A13', 'SAM-A13-FE', calculate_sale_price(75.00), 75.00, 0, false, categoria_frontal_samsung_id, loja_feira_id, NOW(), NOW()),
    (gen_random_uuid(), 'Frontal A13 com aro', 'Frontal para Samsung A13 com aro', 'SAM-A13-ARO-FE', calculate_sale_price(95.00), 95.00, 0, false, categoria_frontal_samsung_id, loja_feira_id, NOW(), NOW()),
    (gen_random_uuid(), 'Frontal A14', 'Frontal para Samsung A14', 'SAM-A14-FE', calculate_sale_price(80.00), 80.00, 0, false, categoria_frontal_samsung_id, loja_feira_id, NOW(), NOW()),
    (gen_random_uuid(), 'Frontal A14 com aro', 'Frontal para Samsung A14 com aro', 'SAM-A14-ARO-FE', calculate_sale_price(100.00), 100.00, 0, false, categoria_frontal_samsung_id, loja_feira_id, NOW(), NOW()),
    (gen_random_uuid(), 'Frontal A15', 'Frontal para Samsung A15', 'SAM-A15-FE', calculate_sale_price(85.00), 85.00, 0, false, categoria_frontal_samsung_id, loja_feira_id, NOW(), NOW()),
    (gen_random_uuid(), 'Frontal A15 com aro', 'Frontal para Samsung A15 com aro', 'SAM-A15-ARO-FE', calculate_sale_price(105.00), 105.00, 0, false, categoria_frontal_samsung_id, loja_feira_id, NOW(), NOW()),
    (gen_random_uuid(), 'Frontal A20', 'Frontal para Samsung A20', 'SAM-A20-FE', calculate_sale_price(70.00), 70.00, 0, false, categoria_frontal_samsung_id, loja_feira_id, NOW(), NOW()),
    (gen_random_uuid(), 'Frontal A20 com aro', 'Frontal para Samsung A20 com aro', 'SAM-A20-ARO-FE', calculate_sale_price(90.00), 90.00, 0, false, categoria_frontal_samsung_id, loja_feira_id, NOW(), NOW()),
    (gen_random_uuid(), 'Frontal A20s', 'Frontal para Samsung A20s', 'SAM-A20S-FE', calculate_sale_price(70.00), 70.00, 0, false, categoria_frontal_samsung_id, loja_feira_id, NOW(), NOW()),
    (gen_random_uuid(), 'Frontal A20s com aro', 'Frontal para Samsung A20s com aro', 'SAM-A20S-ARO-FE', calculate_sale_price(90.00), 90.00, 0, false, categoria_frontal_samsung_id, loja_feira_id, NOW(), NOW()),
    (gen_random_uuid(), 'Frontal A21', 'Frontal para Samsung A21', 'SAM-A21-FE', calculate_sale_price(75.00), 75.00, 0, false, categoria_frontal_samsung_id, loja_feira_id, NOW(), NOW()),
    (gen_random_uuid(), 'Frontal A21 com aro', 'Frontal para Samsung A21 com aro', 'SAM-A21-ARO-FE', calculate_sale_price(95.00), 95.00, 0, false, categoria_frontal_samsung_id, loja_feira_id, NOW(), NOW()),
    (gen_random_uuid(), 'Frontal A21s', 'Frontal para Samsung A21s', 'SAM-A21S-FE', calculate_sale_price(75.00), 75.00, 0, false, categoria_frontal_samsung_id, loja_feira_id, NOW(), NOW()),
    (gen_random_uuid(), 'Frontal A21s com aro', 'Frontal para Samsung A21s com aro', 'SAM-A21S-ARO-FE', calculate_sale_price(95.00), 95.00, 0, false, categoria_frontal_samsung_id, loja_feira_id, NOW(), NOW()),
    (gen_random_uuid(), 'Frontal A22', 'Frontal para Samsung A22', 'SAM-A22-FE', calculate_sale_price(80.00), 80.00, 0, false, categoria_frontal_samsung_id, loja_feira_id, NOW(), NOW()),
    (gen_random_uuid(), 'Frontal A22 com aro', 'Frontal para Samsung A22 com aro', 'SAM-A22-ARO-FE', calculate_sale_price(100.00), 100.00, 0, false, categoria_frontal_samsung_id, loja_feira_id, NOW(), NOW()),
    (gen_random_uuid(), 'Frontal A23', 'Frontal para Samsung A23', 'SAM-A23-FE', calculate_sale_price(85.00), 85.00, 0, false, categoria_frontal_samsung_id, loja_feira_id, NOW(), NOW()),
    (gen_random_uuid(), 'Frontal A23 com aro', 'Frontal para Samsung A23 com aro', 'SAM-A23-ARO-FE', calculate_sale_price(105.00), 105.00, 0, false, categoria_frontal_samsung_id, loja_feira_id, NOW(), NOW()),
    (gen_random_uuid(), 'Frontal A24', 'Frontal para Samsung A24', 'SAM-A24-FE', calculate_sale_price(90.00), 90.00, 0, false, categoria_frontal_samsung_id, loja_feira_id, NOW(), NOW()),
    (gen_random_uuid(), 'Frontal A24 com aro', 'Frontal para Samsung A24 com aro', 'SAM-A24-ARO-FE', calculate_sale_price(110.00), 110.00, 0, false, categoria_frontal_samsung_id, loja_feira_id, NOW(), NOW()),
    (gen_random_uuid(), 'Frontal A25', 'Frontal para Samsung A25', 'SAM-A25-FE', calculate_sale_price(95.00), 95.00, 0, false, categoria_frontal_samsung_id, loja_feira_id, NOW(), NOW()),
    (gen_random_uuid(), 'Frontal A25 com aro', 'Frontal para Samsung A25 com aro', 'SAM-A25-ARO-FE', calculate_sale_price(115.00), 115.00, 0, false, categoria_frontal_samsung_id, loja_feira_id, NOW(), NOW()),
    (gen_random_uuid(), 'Frontal A30', 'Frontal para Samsung A30', 'SAM-A30-FE', calculate_sale_price(80.00), 80.00, 0, false, categoria_frontal_samsung_id, loja_feira_id, NOW(), NOW()),
    (gen_random_uuid(), 'Frontal A30 com aro', 'Frontal para Samsung A30 com aro', 'SAM-A30-ARO-FE', calculate_sale_price(100.00), 100.00, 0, false, categoria_frontal_samsung_id, loja_feira_id, NOW(), NOW()),
    (gen_random_uuid(), 'Frontal A30s', 'Frontal para Samsung A30s', 'SAM-A30S-FE', calculate_sale_price(80.00), 80.00, 0, false, categoria_frontal_samsung_id, loja_feira_id, NOW(), NOW()),
    (gen_random_uuid(), 'Frontal A30s com aro', 'Frontal para Samsung A30s com aro', 'SAM-A30S-ARO-FE', calculate_sale_price(100.00), 100.00, 0, false, categoria_frontal_samsung_id, loja_feira_id, NOW(), NOW()),
    (gen_random_uuid(), 'Frontal A31', 'Frontal para Samsung A31', 'SAM-A31-FE', calculate_sale_price(85.00), 85.00, 0, false, categoria_frontal_samsung_id, loja_feira_id, NOW(), NOW()),
    (gen_random_uuid(), 'Frontal A31 com aro', 'Frontal para Samsung A31 com aro', 'SAM-A31-ARO-FE', calculate_sale_price(105.00), 105.00, 0, false, categoria_frontal_samsung_id, loja_feira_id, NOW(), NOW()),
    (gen_random_uuid(), 'Frontal A32', 'Frontal para Samsung A32', 'SAM-A32-FE', calculate_sale_price(90.00), 90.00, 0, false, categoria_frontal_samsung_id, loja_feira_id, NOW(), NOW()),
    (gen_random_uuid(), 'Frontal A32 com aro', 'Frontal para Samsung A32 com aro', 'SAM-A32-ARO-FE', calculate_sale_price(110.00), 110.00, 0, false, categoria_frontal_samsung_id, loja_feira_id, NOW(), NOW()),
    (gen_random_uuid(), 'Frontal A33', 'Frontal para Samsung A33', 'SAM-A33-FE', calculate_sale_price(95.00), 95.00, 0, false, categoria_frontal_samsung_id, loja_feira_id, NOW(), NOW()),
    (gen_random_uuid(), 'Frontal A33 com aro', 'Frontal para Samsung A33 com aro', 'SAM-A33-ARO-FE', calculate_sale_price(115.00), 115.00, 0, false, categoria_frontal_samsung_id, loja_feira_id, NOW(), NOW()),
    (gen_random_uuid(), 'Frontal A34', 'Frontal para Samsung A34', 'SAM-A34-FE', calculate_sale_price(100.00), 100.00, 0, false, categoria_frontal_samsung_id, loja_feira_id, NOW(), NOW()),
    (gen_random_uuid(), 'Frontal A34 com aro', 'Frontal para Samsung A34 com aro', 'SAM-A34-ARO-FE', calculate_sale_price(120.00), 120.00, 0, false, categoria_frontal_samsung_id, loja_feira_id, NOW(), NOW()),
    (gen_random_uuid(), 'Frontal A50', 'Frontal para Samsung A50', 'SAM-A50-FE', calculate_sale_price(90.00), 90.00, 0, false, categoria_frontal_samsung_id, loja_feira_id, NOW(), NOW()),
    (gen_random_uuid(), 'Frontal A50 com aro', 'Frontal para Samsung A50 com aro', 'SAM-A50-ARO-FE', calculate_sale_price(110.00), 110.00, 0, false, categoria_frontal_samsung_id, loja_feira_id, NOW(), NOW()),
    (gen_random_uuid(), 'Frontal A51', 'Frontal para Samsung A51', 'SAM-A51-FE', calculate_sale_price(95.00), 95.00, 0, false, categoria_frontal_samsung_id, loja_feira_id, NOW(), NOW()),
    (gen_random_uuid(), 'Frontal A51 com aro', 'Frontal para Samsung A51 com aro', 'SAM-A51-ARO-FE', calculate_sale_price(115.00), 115.00, 0, false, categoria_frontal_samsung_id, loja_feira_id, NOW(), NOW()),
    (gen_random_uuid(), 'Frontal A52', 'Frontal para Samsung A52', 'SAM-A52-FE', calculate_sale_price(100.00), 100.00, 0, false, categoria_frontal_samsung_id, loja_feira_id, NOW(), NOW()),
    (gen_random_uuid(), 'Frontal A52 com aro', 'Frontal para Samsung A52 com aro', 'SAM-A52-ARO-FE', calculate_sale_price(120.00), 120.00, 0, false, categoria_frontal_samsung_id, loja_feira_id, NOW(), NOW()),
    (gen_random_uuid(), 'Frontal A53', 'Frontal para Samsung A53', 'SAM-A53-FE', calculate_sale_price(105.00), 105.00, 0, false, categoria_frontal_samsung_id, loja_feira_id, NOW(), NOW()),
    (gen_random_uuid(), 'Frontal A53 com aro', 'Frontal para Samsung A53 com aro', 'SAM-A53-ARO-FE', calculate_sale_price(125.00), 125.00, 0, false, categoria_frontal_samsung_id, loja_feira_id, NOW(), NOW()),
    (gen_random_uuid(), 'Frontal A54', 'Frontal para Samsung A54', 'SAM-A54-FE', calculate_sale_price(110.00), 110.00, 0, false, categoria_frontal_samsung_id, loja_feira_id, NOW(), NOW()),
    (gen_random_uuid(), 'Frontal A54 com aro', 'Frontal para Samsung A54 com aro', 'SAM-A54-ARO-FE', calculate_sale_price(130.00), 130.00, 0, false, categoria_frontal_samsung_id, loja_feira_id, NOW(), NOW()),
    (gen_random_uuid(), 'Frontal A55', 'Frontal para Samsung A55', 'SAM-A55-FE', calculate_sale_price(115.00), 115.00, 0, false, categoria_frontal_samsung_id, loja_feira_id, NOW(), NOW()),
    (gen_random_uuid(), 'Frontal A55 com aro', 'Frontal para Samsung A55 com aro', 'SAM-A55-ARO-FE', calculate_sale_price(135.00), 135.00, 0, false, categoria_frontal_samsung_id, loja_feira_id, NOW(), NOW()),
    (gen_random_uuid(), 'Frontal A70', 'Frontal para Samsung A70', 'SAM-A70-FE', calculate_sale_price(120.00), 120.00, 0, false, categoria_frontal_samsung_id, loja_feira_id, NOW(), NOW()),
    (gen_random_uuid(), 'Frontal A70 com aro', 'Frontal para Samsung A70 com aro', 'SAM-A70-ARO-FE', calculate_sale_price(140.00), 140.00, 0, false, categoria_frontal_samsung_id, loja_feira_id, NOW(), NOW()),
    (gen_random_uuid(), 'Frontal A71', 'Frontal para Samsung A71', 'SAM-A71-FE', calculate_sale_price(125.00), 125.00, 0, false, categoria_frontal_samsung_id, loja_feira_id, NOW(), NOW()),
    (gen_random_uuid(), 'Frontal A71 com aro', 'Frontal para Samsung A71 com aro', 'SAM-A71-ARO-FE', calculate_sale_price(145.00), 145.00, 0, false, categoria_frontal_samsung_id, loja_feira_id, NOW(), NOW()),
    (gen_random_uuid(), 'Frontal A72', 'Frontal para Samsung A72', 'SAM-A72-FE', calculate_sale_price(130.00), 130.00, 0, false, categoria_frontal_samsung_id, loja_feira_id, NOW(), NOW()),
    (gen_random_uuid(), 'Frontal A72 com aro', 'Frontal para Samsung A72 com aro', 'SAM-A72-ARO-FE', calculate_sale_price(150.00), 150.00, 0, false, categoria_frontal_samsung_id, loja_feira_id, NOW(), NOW()),
    (gen_random_uuid(), 'Frontal A73', 'Frontal para Samsung A73', 'SAM-A73-FE', calculate_sale_price(135.00), 135.00, 0, false, categoria_frontal_samsung_id, loja_feira_id, NOW(), NOW()),
    (gen_random_uuid(), 'Frontal A73 com aro', 'Frontal para Samsung A73 com aro', 'SAM-A73-ARO-FE', calculate_sale_price(155.00), 155.00, 0, false, categoria_frontal_samsung_id, loja_feira_id, NOW(), NOW()),
    (gen_random_uuid(), 'Frontal S20', 'Frontal para Samsung S20', 'SAM-S20-FE', calculate_sale_price(300.00), 300.00, 0, false, categoria_frontal_samsung_id, loja_feira_id, NOW(), NOW()),
    (gen_random_uuid(), 'Frontal S20 com aro', 'Frontal para Samsung S20 com aro', 'SAM-S20-ARO-FE', calculate_sale_price(320.00), 320.00, 0, false, categoria_frontal_samsung_id, loja_feira_id, NOW(), NOW()),
    (gen_random_uuid(), 'Frontal S21', 'Frontal para Samsung S21', 'SAM-S21-FE', calculate_sale_price(350.00), 350.00, 0, false, categoria_frontal_samsung_id, loja_feira_id, NOW(), NOW()),
    (gen_random_uuid(), 'Frontal S21 com aro', 'Frontal para Samsung S21 com aro', 'SAM-S21-ARO-FE', calculate_sale_price(370.00), 370.00, 0, false, categoria_frontal_samsung_id, loja_feira_id, NOW(), NOW()),
    (gen_random_uuid(), 'Frontal S22', 'Frontal para Samsung S22', 'SAM-S22-FE', calculate_sale_price(400.00), 400.00, 0, false, categoria_frontal_samsung_id, loja_feira_id, NOW(), NOW()),
    (gen_random_uuid(), 'Frontal S22 com aro', 'Frontal para Samsung S22 com aro', 'SAM-S22-ARO-FE', calculate_sale_price(420.00), 420.00, 0, false, categoria_frontal_samsung_id, loja_feira_id, NOW(), NOW()),
    (gen_random_uuid(), 'Frontal S23', 'Frontal para Samsung S23', 'SAM-S23-FE', calculate_sale_price(450.00), 450.00, 0, false, categoria_frontal_samsung_id, loja_feira_id, NOW(), NOW()),
    (gen_random_uuid(), 'Frontal S23 com aro', 'Frontal para Samsung S23 com aro', 'SAM-S23-ARO-FE', calculate_sale_price(470.00), 470.00, 0, false, categoria_frontal_samsung_id, loja_feira_id, NOW(), NOW()),
    (gen_random_uuid(), 'Frontal S24', 'Frontal para Samsung S24', 'SAM-S24-FE', calculate_sale_price(500.00), 500.00, 0, false, categoria_frontal_samsung_id, loja_feira_id, NOW(), NOW()),
    (gen_random_uuid(), 'Frontal S24 com aro', 'Frontal para Samsung S24 com aro', 'SAM-S24-ARO-FE', calculate_sale_price(520.00), 520.00, 0, false, categoria_frontal_samsung_id, loja_feira_id, NOW(), NOW());

    RAISE NOTICE 'Produtos Samsung importados com sucesso para ambas as lojas!';

    -- ========================================
    -- PRODUTOS XIAOMI
    -- ========================================
    INSERT INTO products (id, name, description, sku, price, cost_price, stock, track_stock, category_id, store_id, created_at, updated_at) VALUES
    -- Xiaomi para Alexxcell Paraíso Sul
    (gen_random_uuid(), 'Frontal Redmi 9A', 'Frontal para Xiaomi Redmi 9A', 'XIA-9A-PS', calculate_sale_price(45.00), 45.00, 0, false, categoria_frontal_xiaomi_id, loja_paraiso_id, NOW(), NOW()),
    (gen_random_uuid(), 'Frontal Redmi 9A com aro', 'Frontal para Xiaomi Redmi 9A com aro', 'XIA-9A-ARO-PS', calculate_sale_price(65.00), 65.00, 0, false, categoria_frontal_xiaomi_id, loja_paraiso_id, NOW(), NOW()),
    (gen_random_uuid(), 'Frontal Redmi 9C', 'Frontal para Xiaomi Redmi 9C', 'XIA-9C-PS', calculate_sale_price(45.00), 45.00, 0, false, categoria_frontal_xiaomi_id, loja_paraiso_id, NOW(), NOW()),
    (gen_random_uuid(), 'Frontal Redmi 9C com aro', 'Frontal para Xiaomi Redmi 9C com aro', 'XIA-9C-ARO-PS', calculate_sale_price(65.00), 65.00, 0, false, categoria_frontal_xiaomi_id, loja_paraiso_id, NOW(), NOW()),
    (gen_random_uuid(), 'Frontal Redmi 10A', 'Frontal para Xiaomi Redmi 10A', 'XIA-10A-PS', calculate_sale_price(50.00), 50.00, 0, false, categoria_frontal_xiaomi_id, loja_paraiso_id, NOW(), NOW()),
    (gen_random_uuid(), 'Frontal Redmi 10A com aro', 'Frontal para Xiaomi Redmi 10A com aro', 'XIA-10A-ARO-PS', calculate_sale_price(70.00), 70.00, 0, false, categoria_frontal_xiaomi_id, loja_paraiso_id, NOW(), NOW()),
    (gen_random_uuid(), 'Frontal Redmi 10C', 'Frontal para Xiaomi Redmi 10C', 'XIA-10C-PS', calculate_sale_price(50.00), 50.00, 0, false, categoria_frontal_xiaomi_id, loja_paraiso_id, NOW(), NOW()),
    (gen_random_uuid(), 'Frontal Redmi 10C com aro', 'Frontal para Xiaomi Redmi 10C com aro', 'XIA-10C-ARO-PS', calculate_sale_price(70.00), 70.00, 0, false, categoria_frontal_xiaomi_id, loja_paraiso_id, NOW(), NOW()),
    (gen_random_uuid(), 'Frontal Redmi 12', 'Frontal para Xiaomi Redmi 12', 'XIA-12-PS', calculate_sale_price(60.00), 60.00, 0, false, categoria_frontal_xiaomi_id, loja_paraiso_id, NOW(), NOW()),
    (gen_random_uuid(), 'Frontal Redmi 12 com aro', 'Frontal para Xiaomi Redmi 12 com aro', 'XIA-12-ARO-PS', calculate_sale_price(80.00), 80.00, 0, false, categoria_frontal_xiaomi_id, loja_paraiso_id, NOW(), NOW()),
    (gen_random_uuid(), 'Frontal Redmi 12C', 'Frontal para Xiaomi Redmi 12C', 'XIA-12C-PS', calculate_sale_price(55.00), 55.00, 0, false, categoria_frontal_xiaomi_id, loja_paraiso_id, NOW(), NOW()),
    (gen_random_uuid(), 'Frontal Redmi 12C com aro', 'Frontal para Xiaomi Redmi 12C com aro', 'XIA-12C-ARO-PS', calculate_sale_price(75.00), 75.00, 0, false, categoria_frontal_xiaomi_id, loja_paraiso_id, NOW(), NOW()),
    (gen_random_uuid(), 'Frontal Redmi 13C', 'Frontal para Xiaomi Redmi 13C', 'XIA-13C-PS', calculate_sale_price(60.00), 60.00, 0, false, categoria_frontal_xiaomi_id, loja_paraiso_id, NOW(), NOW()),
    (gen_random_uuid(), 'Frontal Redmi 13C com aro', 'Frontal para Xiaomi Redmi 13C com aro', 'XIA-13C-ARO-PS', calculate_sale_price(80.00), 80.00, 0, false, categoria_frontal_xiaomi_id, loja_paraiso_id, NOW(), NOW()),
    (gen_random_uuid(), 'Frontal Redmi Note 8', 'Frontal para Xiaomi Redmi Note 8', 'XIA-NOTE8-PS', calculate_sale_price(65.00), 65.00, 0, false, categoria_frontal_xiaomi_id, loja_paraiso_id, NOW(), NOW()),
    (gen_random_uuid(), 'Frontal Redmi Note 8 com aro', 'Frontal para Xiaomi Redmi Note 8 com aro', 'XIA-NOTE8-ARO-PS', calculate_sale_price(85.00), 85.00, 0, false, categoria_frontal_xiaomi_id, loja_paraiso_id, NOW(), NOW()),
    (gen_random_uuid(), 'Frontal Redmi Note 9', 'Frontal para Xiaomi Redmi Note 9', 'XIA-NOTE9-PS', calculate_sale_price(70.00), 70.00, 0, false, categoria_frontal_xiaomi_id, loja_paraiso_id, NOW(), NOW()),
    (gen_random_uuid(), 'Frontal Redmi Note 9 com aro', 'Frontal para Xiaomi Redmi Note 9 com aro', 'XIA-NOTE9-ARO-PS', calculate_sale_price(90.00), 90.00, 0, false, categoria_frontal_xiaomi_id, loja_paraiso_id, NOW(), NOW()),
    (gen_random_uuid(), 'Frontal Redmi Note 10', 'Frontal para Xiaomi Redmi Note 10', 'XIA-NOTE10-PS', calculate_sale_price(75.00), 75.00, 0, false, categoria_frontal_xiaomi_id, loja_paraiso_id, NOW(), NOW()),
    (gen_random_uuid(), 'Frontal Redmi Note 10 com aro', 'Frontal para Xiaomi Redmi Note 10 com aro', 'XIA-NOTE10-ARO-PS', calculate_sale_price(95.00), 95.00, 0, false, categoria_frontal_xiaomi_id, loja_paraiso_id, NOW(), NOW()),
    (gen_random_uuid(), 'Frontal Redmi Note 11', 'Frontal para Xiaomi Redmi Note 11', 'XIA-NOTE11-PS', calculate_sale_price(80.00), 80.00, 0, false, categoria_frontal_xiaomi_id, loja_paraiso_id, NOW(), NOW()),
    (gen_random_uuid(), 'Frontal Redmi Note 11 com aro', 'Frontal para Xiaomi Redmi Note 11 com aro', 'XIA-NOTE11-ARO-PS', calculate_sale_price(100.00), 100.00, 0, false, categoria_frontal_xiaomi_id, loja_paraiso_id, NOW(), NOW()),
    (gen_random_uuid(), 'Frontal Redmi Note 12', 'Frontal para Xiaomi Redmi Note 12', 'XIA-NOTE12-PS', calculate_sale_price(85.00), 85.00, 0, false, categoria_frontal_xiaomi_id, loja_paraiso_id, NOW(), NOW()),
    (gen_random_uuid(), 'Frontal Redmi Note 12 com aro', 'Frontal para Xiaomi Redmi Note 12 com aro', 'XIA-NOTE12-ARO-PS', calculate_sale_price(105.00), 105.00, 0, false, categoria_frontal_xiaomi_id, loja_paraiso_id, NOW(), NOW()),
    (gen_random_uuid(), 'Frontal Redmi Note 13', 'Frontal para Xiaomi Redmi Note 13', 'XIA-NOTE13-PS', calculate_sale_price(90.00), 90.00, 0, false, categoria_frontal_xiaomi_id, loja_paraiso_id, NOW(), NOW()),
    (gen_random_uuid(), 'Frontal Redmi Note 13 com aro', 'Frontal para Xiaomi Redmi Note 13 com aro', 'XIA-NOTE13-ARO-PS', calculate_sale_price(110.00), 110.00, 0, false, categoria_frontal_xiaomi_id, loja_paraiso_id, NOW(), NOW()),
    (gen_random_uuid(), 'Frontal Mi 11 Lite', 'Frontal para Xiaomi Mi 11 Lite', 'XIA-MI11L-PS', calculate_sale_price(120.00), 120.00, 0, false, categoria_frontal_xiaomi_id, loja_paraiso_id, NOW(), NOW()),
    (gen_random_uuid(), 'Frontal Mi 11 Lite com aro', 'Frontal para Xiaomi Mi 11 Lite com aro', 'XIA-MI11L-ARO-PS', calculate_sale_price(140.00), 140.00, 0, false, categoria_frontal_xiaomi_id, loja_paraiso_id, NOW(), NOW()),
    (gen_random_uuid(), 'Frontal Poco X3', 'Frontal para Xiaomi Poco X3', 'XIA-POCOX3-PS', calculate_sale_price(100.00), 100.00, 0, false, categoria_frontal_xiaomi_id, loja_paraiso_id, NOW(), NOW()),
    (gen_random_uuid(), 'Frontal Poco X3 com aro', 'Frontal para Xiaomi Poco X3 com aro', 'XIA-POCOX3-ARO-PS', calculate_sale_price(120.00), 120.00, 0, false, categoria_frontal_xiaomi_id, loja_paraiso_id, NOW(), NOW()),
    (gen_random_uuid(), 'Frontal Poco X4', 'Frontal para Xiaomi Poco X4', 'XIA-POCOX4-PS', calculate_sale_price(110.00), 110.00, 0, false, categoria_frontal_xiaomi_id, loja_paraiso_id, NOW(), NOW()),
    (gen_random_uuid(), 'Frontal Poco X4 com aro', 'Frontal para Xiaomi Poco X4 com aro', 'XIA-POCOX4-ARO-PS', calculate_sale_price(130.00), 130.00, 0, false, categoria_frontal_xiaomi_id, loja_paraiso_id, NOW(), NOW()),

    -- Xiaomi para Alexcell Feira
    (gen_random_uuid(), 'Frontal Redmi 9A', 'Frontal para Xiaomi Redmi 9A', 'XIA-9A-FE', calculate_sale_price(45.00), 45.00, 0, false, categoria_frontal_xiaomi_id, loja_feira_id, NOW(), NOW()),
    (gen_random_uuid(), 'Frontal Redmi 9A com aro', 'Frontal para Xiaomi Redmi 9A com aro', 'XIA-9A-ARO-FE', calculate_sale_price(65.00), 65.00, 0, false, categoria_frontal_xiaomi_id, loja_feira_id, NOW(), NOW()),
    (gen_random_uuid(), 'Frontal Redmi 9C', 'Frontal para Xiaomi Redmi 9C', 'XIA-9C-FE', calculate_sale_price(45.00), 45.00, 0, false, categoria_frontal_xiaomi_id, loja_feira_id, NOW(), NOW()),
    (gen_random_uuid(), 'Frontal Redmi 9C com aro', 'Frontal para Xiaomi Redmi 9C com aro', 'XIA-9C-ARO-FE', calculate_sale_price(65.00), 65.00, 0, false, categoria_frontal_xiaomi_id, loja_feira_id, NOW(), NOW()),
    (gen_random_uuid(), 'Frontal Redmi 10A', 'Frontal para Xiaomi Redmi 10A', 'XIA-10A-FE', calculate_sale_price(50.00), 50.00, 0, false, categoria_frontal_xiaomi_id, loja_feira_id, NOW(), NOW()),
    (gen_random_uuid(), 'Frontal Redmi 10A com aro', 'Frontal para Xiaomi Redmi 10A com aro', 'XIA-10A-ARO-FE', calculate_sale_price(70.00), 70.00, 0, false, categoria_frontal_xiaomi_id, loja_feira_id, NOW(), NOW()),
    (gen_random_uuid(), 'Frontal Redmi 10C', 'Frontal para Xiaomi Redmi 10C', 'XIA-10C-FE', calculate_sale_price(50.00), 50.00, 0, false, categoria_frontal_xiaomi_id, loja_feira_id, NOW(), NOW()),
    (gen_random_uuid(), 'Frontal Redmi 10C com aro', 'Frontal para Xiaomi Redmi 10C com aro', 'XIA-10C-ARO-FE', calculate_sale_price(70.00), 70.00, 0, false, categoria_frontal_xiaomi_id, loja_feira_id, NOW(), NOW()),
    (gen_random_uuid(), 'Frontal Redmi 12', 'Frontal para Xiaomi Redmi 12', 'XIA-12-FE', calculate_sale_price(60.00), 60.00, 0, false, categoria_frontal_xiaomi_id, loja_feira_id, NOW(), NOW()),
    (gen_random_uuid(), 'Frontal Redmi 12 com aro', 'Frontal para Xiaomi Redmi 12 com aro', 'XIA-12-ARO-FE', calculate_sale_price(80.00), 80.00, 0, false, categoria_frontal_xiaomi_id, loja_feira_id, NOW(), NOW()),
    (gen_random_uuid(), 'Frontal Redmi 12C', 'Frontal para Xiaomi Redmi 12C', 'XIA-12C-FE', calculate_sale_price(55.00), 55.00, 0, false, categoria_frontal_xiaomi_id, loja_feira_id, NOW(), NOW()),
    (gen_random_uuid(), 'Frontal Redmi 12C com aro', 'Frontal para Xiaomi Redmi 12C com aro', 'XIA-12C-ARO-FE', calculate_sale_price(75.00), 75.00, 0, false, categoria_frontal_xiaomi_id, loja_feira_id, NOW(), NOW()),
    (gen_random_uuid(), 'Frontal Redmi 13C', 'Frontal para Xiaomi Redmi 13C', 'XIA-13C-FE', calculate_sale_price(60.00), 60.00, 0, false, categoria_frontal_xiaomi_id, loja_feira_id, NOW(), NOW()),
    (gen_random_uuid(), 'Frontal Redmi 13C com aro', 'Frontal para Xiaomi Redmi 13C com aro', 'XIA-13C-ARO-FE', calculate_sale_price(80.00), 80.00, 0, false, categoria_frontal_xiaomi_id, loja_feira_id, NOW(), NOW()),
    (gen_random_uuid(), 'Frontal Redmi Note 8', 'Frontal para Xiaomi Redmi Note 8', 'XIA-NOTE8-FE', calculate_sale_price(65.00), 65.00, 0, false, categoria_frontal_xiaomi_id, loja_feira_id, NOW(), NOW()),
    (gen_random_uuid(), 'Frontal Redmi Note 8 com aro', 'Frontal para Xiaomi Redmi Note 8 com aro', 'XIA-NOTE8-ARO-FE', calculate_sale_price(85.00), 85.00, 0, false, categoria_frontal_xiaomi_id, loja_feira_id, NOW(), NOW()),
    (gen_random_uuid(), 'Frontal Redmi Note 9', 'Frontal para Xiaomi Redmi Note 9', 'XIA-NOTE9-FE', calculate_sale_price(70.00), 70.00, 0, false, categoria_frontal_xiaomi_id, loja_feira_id, NOW(), NOW()),
    (gen_random_uuid(), 'Frontal Redmi Note 9 com aro', 'Frontal para Xiaomi Redmi Note 9 com aro', 'XIA-NOTE9-ARO-FE', calculate_sale_price(90.00), 90.00, 0, false, categoria_frontal_xiaomi_id, loja_feira_id, NOW(), NOW()),
    (gen_random_uuid(), 'Frontal Redmi Note 10', 'Frontal para Xiaomi Redmi Note 10', 'XIA-NOTE10-FE', calculate_sale_price(75.00), 75.00, 0, false, categoria_frontal_xiaomi_id, loja_feira_id, NOW(), NOW()),
    (gen_random_uuid(), 'Frontal Redmi Note 10 com aro', 'Frontal para Xiaomi Redmi Note 10 com aro', 'XIA-NOTE10-ARO-FE', calculate_sale_price(95.00), 95.00, 0, false, categoria_frontal_xiaomi_id, loja_feira_id, NOW(), NOW()),
    (gen_random_uuid(), 'Frontal Redmi Note 11', 'Frontal para Xiaomi Redmi Note 11', 'XIA-NOTE11-FE', calculate_sale_price(80.00), 80.00, 0, false, categoria_frontal_xiaomi_id, loja_feira_id, NOW(), NOW()),
    (gen_random_uuid(), 'Frontal Redmi Note 11 com aro', 'Frontal para Xiaomi Redmi Note 11 com aro', 'XIA-NOTE11-ARO-FE', calculate_sale_price(100.00), 100.00, 0, false, categoria_frontal_xiaomi_id, loja_feira_id, NOW(), NOW()),
    (gen_random_uuid(), 'Frontal Redmi Note 12', 'Frontal para Xiaomi Redmi Note 12', 'XIA-NOTE12-FE', calculate_sale_price(85.00), 85.00, 0, false, categoria_frontal_xiaomi_id, loja_feira_id, NOW(), NOW()),
    (gen_random_uuid(), 'Frontal Redmi Note 12 com aro', 'Frontal para Xiaomi Redmi Note 12 com aro', 'XIA-NOTE12-ARO-FE', calculate_sale_price(105.00), 105.00, 0, false, categoria_frontal_xiaomi_id, loja_feira_id, NOW(), NOW()),
    (gen_random_uuid(), 'Frontal Redmi Note 13', 'Frontal para Xiaomi Redmi Note 13', 'XIA-NOTE13-FE', calculate_sale_price(90.00), 90.00, 0, false, categoria_frontal_xiaomi_id, loja_feira_id, NOW(), NOW()),
    (gen_random_uuid(), 'Frontal Redmi Note 13 com aro', 'Frontal para Xiaomi Redmi Note 13 com aro', 'XIA-NOTE13-ARO-FE', calculate_sale_price(110.00), 110.00, 0, false, categoria_frontal_xiaomi_id, loja_feira_id, NOW(), NOW()),
    (gen_random_uuid(), 'Frontal Mi 11 Lite', 'Frontal para Xiaomi Mi 11 Lite', 'XIA-MI11L-FE', calculate_sale_price(120.00), 120.00, 0, false, categoria_frontal_xiaomi_id, loja_feira_id, NOW(), NOW()),
    (gen_random_uuid(), 'Frontal Mi 11 Lite com aro', 'Frontal para Xiaomi Mi 11 Lite com aro', 'XIA-MI11L-ARO-FE', calculate_sale_price(140.00), 140.00, 0, false, categoria_frontal_xiaomi_id, loja_feira_id, NOW(), NOW()),
    (gen_random_uuid(), 'Frontal Poco X3', 'Frontal para Xiaomi Poco X3', 'XIA-POCOX3-FE', calculate_sale_price(100.00), 100.00, 0, false, categoria_frontal_xiaomi_id, loja_feira_id, NOW(), NOW()),
    (gen_random_uuid(), 'Frontal Poco X3 com aro', 'Frontal para Xiaomi Poco X3 com aro', 'XIA-POCOX3-ARO-FE', calculate_sale_price(120.00), 120.00, 0, false, categoria_frontal_xiaomi_id, loja_feira_id, NOW(), NOW()),
    (gen_random_uuid(), 'Frontal Poco X4', 'Frontal para Xiaomi Poco X4', 'XIA-POCOX4-FE', calculate_sale_price(110.00), 110.00, 0, false, categoria_frontal_xiaomi_id, loja_feira_id, NOW(), NOW()),
    (gen_random_uuid(), 'Frontal Poco X4 com aro', 'Frontal para Xiaomi Poco X4 com aro', 'XIA-POCOX4-ARO-FE', calculate_sale_price(130.00), 130.00, 0, false, categoria_frontal_xiaomi_id, loja_feira_id, NOW(), NOW());

    RAISE NOTICE 'Produtos Xiaomi importados com sucesso para ambas as lojas!';

    -- ========================================
    -- PRODUTOS IPHONE
    -- ========================================
    INSERT INTO products (id, name, description, sku, price, cost_price, stock, track_stock, category_id, store_id, created_at, updated_at) VALUES
    -- iPhone para Alexxcell Paraíso Sul
    (gen_random_uuid(), 'Frontal iPhone 6', 'Frontal para iPhone 6', 'IPH-6-PS', calculate_sale_price(80.00), 80.00, 0, false, categoria_frontal_iphone_id, loja_paraiso_id, NOW(), NOW()),
    (gen_random_uuid(), 'Frontal iPhone 6 com aro', 'Frontal para iPhone 6 com aro', 'IPH-6-ARO-PS', calculate_sale_price(100.00), 100.00, 0, false, categoria_frontal_iphone_id, loja_paraiso_id, NOW(), NOW()),
    (gen_random_uuid(), 'Frontal iPhone 6 Plus', 'Frontal para iPhone 6 Plus', 'IPH-6P-PS', calculate_sale_price(90.00), 90.00, 0, false, categoria_frontal_iphone_id, loja_paraiso_id, NOW(), NOW()),
    (gen_random_uuid(), 'Frontal iPhone 6 Plus com aro', 'Frontal para iPhone 6 Plus com aro', 'IPH-6P-ARO-PS', calculate_sale_price(110.00), 110.00, 0, false, categoria_frontal_iphone_id, loja_paraiso_id, NOW(), NOW()),
    (gen_random_uuid(), 'Frontal iPhone 6S', 'Frontal para iPhone 6S', 'IPH-6S-PS', calculate_sale_price(85.00), 85.00, 0, false, categoria_frontal_iphone_id, loja_paraiso_id, NOW(), NOW()),
    (gen_random_uuid(), 'Frontal iPhone 6S com aro', 'Frontal para iPhone 6S com aro', 'IPH-6S-ARO-PS', calculate_sale_price(105.00), 105.00, 0, false, categoria_frontal_iphone_id, loja_paraiso_id, NOW(), NOW()),
    (gen_random_uuid(), 'Frontal iPhone 6S Plus', 'Frontal para iPhone 6S Plus', 'IPH-6SP-PS', calculate_sale_price(95.00), 95.00, 0, false, categoria_frontal_iphone_id, loja_paraiso_id, NOW(), NOW()),
    (gen_random_uuid(), 'Frontal iPhone 6S Plus com aro', 'Frontal para iPhone 6S Plus com aro', 'IPH-6SP-ARO-PS', calculate_sale_price(115.00), 115.00, 0, false, categoria_frontal_iphone_id, loja_paraiso_id, NOW(), NOW()),
    (gen_random_uuid(), 'Frontal iPhone 7', 'Frontal para iPhone 7', 'IPH-7-PS', calculate_sale_price(100.00), 100.00, 0, false, categoria_frontal_iphone_id, loja_paraiso_id, NOW(), NOW()),
    (gen_random_uuid(), 'Frontal iPhone 7 com aro', 'Frontal para iPhone 7 com aro', 'IPH-7-ARO-PS', calculate_sale_price(120.00), 120.00, 0, false, categoria_frontal_iphone_id, loja_paraiso_id, NOW(), NOW()),
    (gen_random_uuid(), 'Frontal iPhone 7 Plus', 'Frontal para iPhone 7 Plus', 'IPH-7P-PS', calculate_sale_price(110.00), 110.00, 0, false, categoria_frontal_iphone_id, loja_paraiso_id, NOW(), NOW()),
    (gen_random_uuid(), 'Frontal iPhone 7 Plus com aro', 'Frontal para iPhone 7 Plus com aro', 'IPH-7P-ARO-PS', calculate_sale_price(130.00), 130.00, 0, false, categoria_frontal_iphone_id, loja_paraiso_id, NOW(), NOW()),
    (gen_random_uuid(), 'Frontal iPhone 8', 'Frontal para iPhone 8', 'IPH-8-PS', calculate_sale_price(120.00), 120.00, 0, false, categoria_frontal_iphone_id, loja_paraiso_id, NOW(), NOW()),
    (gen_random_uuid(), 'Frontal iPhone 8 com aro', 'Frontal para iPhone 8 com aro', 'IPH-8-ARO-PS', calculate_sale_price(140.00), 140.00, 0, false, categoria_frontal_iphone_id, loja_paraiso_id, NOW(), NOW()),
    (gen_random_uuid(), 'Frontal iPhone 8 Plus', 'Frontal para iPhone 8 Plus', 'IPH-8P-PS', calculate_sale_price(130.00), 130.00, 0, false, categoria_frontal_iphone_id, loja_paraiso_id, NOW(), NOW()),
    (gen_random_uuid(), 'Frontal iPhone 8 Plus com aro', 'Frontal para iPhone 8 Plus com aro', 'IPH-8P-ARO-PS', calculate_sale_price(150.00), 150.00, 0, false, categoria_frontal_iphone_id, loja_paraiso_id, NOW(), NOW()),
    (gen_random_uuid(), 'Frontal iPhone X', 'Frontal para iPhone X', 'IPH-X-PS', calculate_sale_price(180.00), 180.00, 0, false, categoria_frontal_iphone_id, loja_paraiso_id, NOW(), NOW()),
    (gen_random_uuid(), 'Frontal iPhone X com aro', 'Frontal para iPhone X com aro', 'IPH-X-ARO-PS', calculate_sale_price(200.00), 200.00, 0, false, categoria_frontal_iphone_id, loja_paraiso_id, NOW(), NOW()),
    (gen_random_uuid(), 'Frontal iPhone XR', 'Frontal para iPhone XR', 'IPH-XR-PS', calculate_sale_price(160.00), 160.00, 0, false, categoria_frontal_iphone_id, loja_paraiso_id, NOW(), NOW()),
    (gen_random_uuid(), 'Frontal iPhone XR com aro', 'Frontal para iPhone XR com aro', 'IPH-XR-ARO-PS', calculate_sale_price(180.00), 180.00, 0, false, categoria_frontal_iphone_id, loja_paraiso_id, NOW(), NOW()),
    (gen_random_uuid(), 'Frontal iPhone XS', 'Frontal para iPhone XS', 'IPH-XS-PS', calculate_sale_price(190.00), 190.00, 0, false, categoria_frontal_iphone_id, loja_paraiso_id, NOW(), NOW()),
    (gen_random_uuid(), 'Frontal iPhone XS com aro', 'Frontal para iPhone XS com aro', 'IPH-XS-ARO-PS', calculate_sale_price(210.00), 210.00, 0, false, categoria_frontal_iphone_id, loja_paraiso_id, NOW(), NOW()),
    (gen_random_uuid(), 'Frontal iPhone XS Max', 'Frontal para iPhone XS Max', 'IPH-XSM-PS', calculate_sale_price(220.00), 220.00, 0, false, categoria_frontal_iphone_id, loja_paraiso_id, NOW(), NOW()),
    (gen_random_uuid(), 'Frontal iPhone XS Max com aro', 'Frontal para iPhone XS Max com aro', 'IPH-XSM-ARO-PS', calculate_sale_price(240.00), 240.00, 0, false, categoria_frontal_iphone_id, loja_paraiso_id, NOW(), NOW()),
    (gen_random_uuid(), 'Frontal iPhone 11', 'Frontal para iPhone 11', 'IPH-11-PS', calculate_sale_price(200.00), 200.00, 0, false, categoria_frontal_iphone_id, loja_paraiso_id, NOW(), NOW()),
    (gen_random_uuid(), 'Frontal iPhone 11 com aro', 'Frontal para iPhone 11 com aro', 'IPH-11-ARO-PS', calculate_sale_price(220.00), 220.00, 0, false, categoria_frontal_iphone_id, loja_paraiso_id, NOW(), NOW()),
    (gen_random_uuid(), 'Frontal iPhone 11 Pro', 'Frontal para iPhone 11 Pro', 'IPH-11P-PS', calculate_sale_price(250.00), 250.00, 0, false, categoria_frontal_iphone_id, loja_paraiso_id, NOW(), NOW()),
    (gen_random_uuid(), 'Frontal iPhone 11 Pro com aro', 'Frontal para iPhone 11 Pro com aro', 'IPH-11P-ARO-PS', calculate_sale_price(270.00), 270.00, 0, false, categoria_frontal_iphone_id, loja_paraiso_id, NOW(), NOW()),
    (gen_random_uuid(), 'Frontal iPhone 11 Pro Max', 'Frontal para iPhone 11 Pro Max', 'IPH-11PM-PS', calculate_sale_price(280.00), 280.00, 0, false, categoria_frontal_iphone_id, loja_paraiso_id, NOW(), NOW()),
    (gen_random_uuid(), 'Frontal iPhone 11 Pro Max com aro', 'Frontal para iPhone 11 Pro Max com aro', 'IPH-11PM-ARO-PS', calculate_sale_price(300.00), 300.00, 0, false, categoria_frontal_iphone_id, loja_paraiso_id, NOW(), NOW()),
    (gen_random_uuid(), 'Frontal iPhone 12', 'Frontal para iPhone 12', 'IPH-12-PS', calculate_sale_price(320.00), 320.00, 0, false, categoria_frontal_iphone_id, loja_paraiso_id, NOW(), NOW()),
    (gen_random_uuid(), 'Frontal iPhone 12 com aro', 'Frontal para iPhone 12 com aro', 'IPH-12-ARO-PS', calculate_sale_price(340.00), 340.00, 0, false, categoria_frontal_iphone_id, loja_paraiso_id, NOW(), NOW()),
    (gen_random_uuid(), 'Frontal iPhone 12 Mini', 'Frontal para iPhone 12 Mini', 'IPH-12M-PS', calculate_sale_price(300.00), 300.00, 0, false, categoria_frontal_iphone_id, loja_paraiso_id, NOW(), NOW()),
    (gen_random_uuid(), 'Frontal iPhone 12 Mini com aro', 'Frontal para iPhone 12 Mini com aro', 'IPH-12M-ARO-PS', calculate_sale_price(320.00), 320.00, 0, false, categoria_frontal_iphone_id, loja_paraiso_id, NOW(), NOW()),
    (gen_random_uuid(), 'Frontal iPhone 12 Pro', 'Frontal para iPhone 12 Pro', 'IPH-12P-PS', calculate_sale_price(380.00), 380.00, 0, false, categoria_frontal_iphone_id, loja_paraiso_id, NOW(), NOW()),
    (gen_random_uuid(), 'Frontal iPhone 12 Pro com aro', 'Frontal para iPhone 12 Pro com aro', 'IPH-12P-ARO-PS', calculate_sale_price(400.00), 400.00, 0, false, categoria_frontal_iphone_id, loja_paraiso_id, NOW(), NOW()),
    (gen_random_uuid(), 'Frontal iPhone 12 Pro Max', 'Frontal para iPhone 12 Pro Max', 'IPH-12PM-PS', calculate_sale_price(420.00), 420.00, 0, false, categoria_frontal_iphone_id, loja_paraiso_id, NOW(), NOW()),
    (gen_random_uuid(), 'Frontal iPhone 12 Pro Max com aro', 'Frontal para iPhone 12 Pro Max com aro', 'IPH-12PM-ARO-PS', calculate_sale_price(440.00), 440.00, 0, false, categoria_frontal_iphone_id, loja_paraiso_id, NOW(), NOW()),
    (gen_random_uuid(), 'Frontal iPhone 13', 'Frontal para iPhone 13', 'IPH-13-PS', calculate_sale_price(350.00), 350.00, 0, false, categoria_frontal_iphone_id, loja_paraiso_id, NOW(), NOW()),
    (gen_random_uuid(), 'Frontal iPhone 13 com aro', 'Frontal para iPhone 13 com aro', 'IPH-13-ARO-PS', calculate_sale_price(370.00), 370.00, 0, false, categoria_frontal_iphone_id, loja_paraiso_id, NOW(), NOW()),
    (gen_random_uuid(), 'Frontal iPhone 13 Mini', 'Frontal para iPhone 13 Mini', 'IPH-13M-PS', calculate_sale_price(330.00), 330.00, 0, false, categoria_frontal_iphone_id, loja_paraiso_id, NOW(), NOW()),
    (gen_random_uuid(), 'Frontal iPhone 13 Mini com aro', 'Frontal para iPhone 13 Mini com aro', 'IPH-13M-ARO-PS', calculate_sale_price(350.00), 350.00, 0, false, categoria_frontal_iphone_id, loja_paraiso_id, NOW(), NOW()),
    (gen_random_uuid(), 'Frontal iPhone 13 Pro', 'Frontal para iPhone 13 Pro', 'IPH-13P-PS', calculate_sale_price(450.00), 450.00, 0, false, categoria_frontal_iphone_id, loja_paraiso_id, NOW(), NOW()),
    (gen_random_uuid(), 'Frontal iPhone 13 Pro com aro', 'Frontal para iPhone 13 Pro com aro', 'IPH-13P-ARO-PS', calculate_sale_price(470.00), 470.00, 0, false, categoria_frontal_iphone_id, loja_paraiso_id, NOW(), NOW()),
    (gen_random_uuid(), 'Frontal iPhone 13 Pro Max', 'Frontal para iPhone 13 Pro Max', 'IPH-13PM-PS', calculate_sale_price(480.00), 480.00, 0, false, categoria_frontal_iphone_id, loja_paraiso_id, NOW(), NOW()),
    (gen_random_uuid(), 'Frontal iPhone 13 Pro Max com aro', 'Frontal para iPhone 13 Pro Max com aro', 'IPH-13PM-ARO-PS', calculate_sale_price(500.00), 500.00, 0, false, categoria_frontal_iphone_id, loja_paraiso_id, NOW(), NOW()),
    (gen_random_uuid(), 'Frontal iPhone 14', 'Frontal para iPhone 14', 'IPH-14-PS', calculate_sale_price(400.00), 400.00, 0, false, categoria_frontal_iphone_id, loja_paraiso_id, NOW(), NOW()),
    (gen_random_uuid(), 'Frontal iPhone 14 com aro', 'Frontal para iPhone 14 com aro', 'IPH-14-ARO-PS', calculate_sale_price(420.00), 420.00, 0, false, categoria_frontal_iphone_id, loja_paraiso_id, NOW(), NOW()),
    (gen_random_uuid(), 'Frontal iPhone 14 Plus', 'Frontal para iPhone 14 Plus', 'IPH-14PL-PS', calculate_sale_price(430.00), 430.00, 0, false, categoria_frontal_iphone_id, loja_paraiso_id, NOW(), NOW()),
    (gen_random_uuid(), 'Frontal iPhone 14 Plus com aro', 'Frontal para iPhone 14 Plus com aro', 'IPH-14PL-ARO-PS', calculate_sale_price(450.00), 450.00, 0, false, categoria_frontal_iphone_id, loja_paraiso_id, NOW(), NOW()),
    (gen_random_uuid(), 'Frontal iPhone 14 Pro', 'Frontal para iPhone 14 Pro', 'IPH-14P-PS', calculate_sale_price(520.00), 520.00, 0, false, categoria_frontal_iphone_id, loja_paraiso_id, NOW(), NOW()),
    (gen_random_uuid(), 'Frontal iPhone 14 Pro com aro', 'Frontal para iPhone 14 Pro com aro', 'IPH-14P-ARO-PS', calculate_sale_price(540.00), 540.00, 0, false, categoria_frontal_iphone_id, loja_paraiso_id, NOW(), NOW()),
    (gen_random_uuid(), 'Frontal iPhone 14 Pro Max', 'Frontal para iPhone 14 Pro Max', 'IPH-14PM-PS', calculate_sale_price(550.00), 550.00, 0, false, categoria_frontal_iphone_id, loja_paraiso_id, NOW(), NOW()),
    (gen_random_uuid(), 'Frontal iPhone 14 Pro Max com aro', 'Frontal para iPhone 14 Pro Max com aro', 'IPH-14PM-ARO-PS', calculate_sale_price(570.00), 570.00, 0, false, categoria_frontal_iphone_id, loja_paraiso_id, NOW(), NOW()),
    (gen_random_uuid(), 'Frontal iPhone 15', 'Frontal para iPhone 15', 'IPH-15-PS', calculate_sale_price(450.00), 450.00, 0, false, categoria_frontal_iphone_id, loja_paraiso_id, NOW(), NOW()),
    (gen_random_uuid(), 'Frontal iPhone 15 com aro', 'Frontal para iPhone 15 com aro', 'IPH-15-ARO-PS', calculate_sale_price(470.00), 470.00, 0, false, categoria_frontal_iphone_id, loja_paraiso_id, NOW(), NOW()),
    (gen_random_uuid(), 'Frontal iPhone 15 Plus', 'Frontal para iPhone 15 Plus', 'IPH-15PL-PS', calculate_sale_price(480.00), 480.00, 0, false, categoria_frontal_iphone_id, loja_paraiso_id, NOW(), NOW()),
    (gen_random_uuid(), 'Frontal iPhone 15 Plus com aro', 'Frontal para iPhone 15 Plus com aro', 'IPH-15PL-ARO-PS', calculate_sale_price(500.00), 500.00, 0, false, categoria_frontal_iphone_id, loja_paraiso_id, NOW(), NOW()),
    (gen_random_uuid(), 'Frontal iPhone 15 Pro', 'Frontal para iPhone 15 Pro', 'IPH-15P-PS', calculate_sale_price(580.00), 580.00, 0, false, categoria_frontal_iphone_id, loja_paraiso_id, NOW(), NOW()),
    (gen_random_uuid(), 'Frontal iPhone 15 Pro com aro', 'Frontal para iPhone 15 Pro com aro', 'IPH-15P-ARO-PS', calculate_sale_price(600.00), 600.00, 0, false, categoria_frontal_iphone_id, loja_paraiso_id, NOW(), NOW()),
    (gen_random_uuid(), 'Frontal iPhone 15 Pro Max', 'Frontal para iPhone 15 Pro Max', 'IPH-15PM-PS', calculate_sale_price(620.00), 620.00, 0, false, categoria_frontal_iphone_id, loja_paraiso_id, NOW(), NOW()),
    (gen_random_uuid(), 'Frontal iPhone 15 Pro Max com aro', 'Frontal para iPhone 15 Pro Max com aro', 'IPH-15PM-ARO-PS', calculate_sale_price(640.00), 640.00, 0, false, categoria_frontal_iphone_id, loja_paraiso_id, NOW(), NOW()),

    -- iPhone para Alexcell Feira (duplicando todos os produtos para a segunda loja)
    (gen_random_uuid(), 'Frontal iPhone 6', 'Frontal para iPhone 6', 'IPH-6-FE', calculate_sale_price(80.00), 80.00, 0, false, categoria_frontal_iphone_id, loja_feira_id, NOW(), NOW()),
    (gen_random_uuid(), 'Frontal iPhone 6 com aro', 'Frontal para iPhone 6 com aro', 'IPH-6-ARO-FE', calculate_sale_price(100.00), 100.00, 0, false, categoria_frontal_iphone_id, loja_feira_id, NOW(), NOW()),
    (gen_random_uuid(), 'Frontal iPhone 6 Plus', 'Frontal para iPhone 6 Plus', 'IPH-6P-FE', calculate_sale_price(90.00), 90.00, 0, false, categoria_frontal_iphone_id, loja_feira_id, NOW(), NOW()),
    (gen_random_uuid(), 'Frontal iPhone 6 Plus com aro', 'Frontal para iPhone 6 Plus com aro', 'IPH-6P-ARO-FE', calculate_sale_price(110.00), 110.00, 0, false, categoria_frontal_iphone_id, loja_feira_id, NOW(), NOW()),
    (gen_random_uuid(), 'Frontal iPhone 6S', 'Frontal para iPhone 6S', 'IPH-6S-FE', calculate_sale_price(85.00), 85.00, 0, false, categoria_frontal_iphone_id, loja_feira_id, NOW(), NOW()),
    (gen_random_uuid(), 'Frontal iPhone 6S com aro', 'Frontal para iPhone 6S com aro', 'IPH-6S-ARO-FE', calculate_sale_price(105.00), 105.00, 0, false, categoria_frontal_iphone_id, loja_feira_id, NOW(), NOW()),
    (gen_random_uuid(), 'Frontal iPhone 6S Plus', 'Frontal para iPhone 6S Plus', 'IPH-6SP-FE', calculate_sale_price(95.00), 95.00, 0, false, categoria_frontal_iphone_id, loja_feira_id, NOW(), NOW()),
    (gen_random_uuid(), 'Frontal iPhone 6S Plus com aro', 'Frontal para iPhone 6S Plus com aro', 'IPH-6SP-ARO-FE', calculate_sale_price(115.00), 115.00, 0, false, categoria_frontal_iphone_id, loja_feira_id, NOW(), NOW()),
    (gen_random_uuid(), 'Frontal iPhone 7', 'Frontal para iPhone 7', 'IPH-7-FE', calculate_sale_price(100.00), 100.00, 0, false, categoria_frontal_iphone_id, loja_feira_id, NOW(), NOW()),
    (gen_random_uuid(), 'Frontal iPhone 7 com aro', 'Frontal para iPhone 7 com aro', 'IPH-7-ARO-FE', calculate_sale_price(120.00), 120.00, 0, false, categoria_frontal_iphone_id, loja_feira_id, NOW(), NOW()),
    (gen_random_uuid(), 'Frontal iPhone 7 Plus', 'Frontal para iPhone 7 Plus', 'IPH-7P-FE', calculate_sale_price(110.00), 110.00, 0, false, categoria_frontal_iphone_id, loja_feira_id, NOW(), NOW()),
    (gen_random_uuid(), 'Frontal iPhone 7 Plus com aro', 'Frontal para iPhone 7 Plus com aro', 'IPH-7P-ARO-FE', calculate_sale_price(130.00), 130.00, 0, false, categoria_frontal_iphone_id, loja_feira_id, NOW(), NOW()),
    (gen_random_uuid(), 'Frontal iPhone 8', 'Frontal para iPhone 8', 'IPH-8-FE', calculate_sale_price(120.00), 120.00, 0, false, categoria_frontal_iphone_id, loja_feira_id, NOW(), NOW()),
    (gen_random_uuid(), 'Frontal iPhone 8 com aro', 'Frontal para iPhone 8 com aro', 'IPH-8-ARO-FE', calculate_sale_price(140.00), 140.00, 0, false, categoria_frontal_iphone_id, loja_feira_id, NOW(), NOW()),
    (gen_random_uuid(), 'Frontal iPhone 8 Plus', 'Frontal para iPhone 8 Plus', 'IPH-8P-FE', calculate_sale_price(130.00), 130.00, 0, false, categoria_frontal_iphone_id, loja_feira_id, NOW(), NOW()),
    (gen_random_uuid(), 'Frontal iPhone 8 Plus com aro', 'Frontal para iPhone 8 Plus com aro', 'IPH-8P-ARO-FE', calculate_sale_price(150.00), 150.00, 0, false, categoria_frontal_iphone_id, loja_feira_id, NOW(), NOW()),
    (gen_random_uuid(), 'Frontal iPhone X', 'Frontal para iPhone X', 'IPH-X-FE', calculate_sale_price(180.00), 180.00, 0, false, categoria_frontal_iphone_id, loja_feira_id, NOW(), NOW()),
    (gen_random_uuid(), 'Frontal iPhone X com aro', 'Frontal para iPhone X com aro', 'IPH-X-ARO-FE', calculate_sale_price(200.00), 200.00, 0, false, categoria_frontal_iphone_id, loja_feira_id, NOW(), NOW()),
    (gen_random_uuid(), 'Frontal iPhone XR', 'Frontal para iPhone XR', 'IPH-XR-FE', calculate_sale_price(160.00), 160.00, 0, false, categoria_frontal_iphone_id, loja_feira_id, NOW(), NOW()),
    (gen_random_uuid(), 'Frontal iPhone XR com aro', 'Frontal para iPhone XR com aro', 'IPH-XR-ARO-FE', calculate_sale_price(180.00), 180.00, 0, false, categoria_frontal_iphone_id, loja_feira_id, NOW(), NOW()),
    (gen_random_uuid(), 'Frontal iPhone XS', 'Frontal para iPhone XS', 'IPH-XS-FE', calculate_sale_price(190.00), 190.00, 0, false, categoria_frontal_iphone_id, loja_feira_id, NOW(), NOW()),
    (gen_random_uuid(), 'Frontal iPhone XS com aro', 'Frontal para iPhone XS com aro', 'IPH-XS-ARO-FE', calculate_sale_price(210.00), 210.00, 0, false, categoria_frontal_iphone_id, loja_feira_id, NOW(), NOW()),
    (gen_random_uuid(), 'Frontal iPhone XS Max', 'Frontal para iPhone XS Max', 'IPH-XSM-FE', calculate_sale_price(220.00), 220.00, 0, false, categoria_frontal_iphone_id, loja_feira_id, NOW(), NOW()),
    (gen_random_uuid(), 'Frontal iPhone XS Max com aro', 'Frontal para iPhone XS Max com aro', 'IPH-XSM-ARO-FE', calculate_sale_price(240.00), 240.00, 0, false, categoria_frontal_iphone_id, loja_feira_id, NOW(), NOW()),
    (gen_random_uuid(), 'Frontal iPhone 11', 'Frontal para iPhone 11', 'IPH-11-FE', calculate_sale_price(200.00), 200.00, 0, false, categoria_frontal_iphone_id, loja_feira_id, NOW(), NOW()),
    (gen_random_uuid(), 'Frontal iPhone 11 com aro', 'Frontal para iPhone 11 com aro', 'IPH-11-ARO-FE', calculate_sale_price(220.00), 220.00, 0, false, categoria_frontal_iphone_id, loja_feira_id, NOW(), NOW()),
    (gen_random_uuid(), 'Frontal iPhone 11 Pro', 'Frontal para iPhone 11 Pro', 'IPH-11P-FE', calculate_sale_price(250.00), 250.00, 0, false, categoria_frontal_iphone_id, loja_feira_id, NOW(), NOW()),
    (gen_random_uuid(), 'Frontal iPhone 11 Pro com aro', 'Frontal para iPhone 11 Pro com aro', 'IPH-11P-ARO-FE', calculate_sale_price(270.00), 270.00, 0, false, categoria_frontal_iphone_id, loja_feira_id, NOW(), NOW()),
    (gen_random_uuid(), 'Frontal iPhone 11 Pro Max', 'Frontal para iPhone 11 Pro Max', 'IPH-11PM-FE', calculate_sale_price(280.00), 280.00, 0, false, categoria_frontal_iphone_id, loja_feira_id, NOW(), NOW()),
    (gen_random_uuid(), 'Frontal iPhone 11 Pro Max com aro', 'Frontal para iPhone 11 Pro Max com aro', 'IPH-11PM-ARO-FE', calculate_sale_price(300.00), 300.00, 0, false, categoria_frontal_iphone_id, loja_feira_id, NOW(), NOW()),
    (gen_random_uuid(), 'Frontal iPhone 12', 'Frontal para iPhone 12', 'IPH-12-FE', calculate_sale_price(320.00), 320.00, 0, false, categoria_frontal_iphone_id, loja_feira_id, NOW(), NOW()),
    (gen_random_uuid(), 'Frontal iPhone 12 com aro', 'Frontal para iPhone 12 com aro', 'IPH-12-ARO-FE', calculate_sale_price(340.00), 340.00, 0, false, categoria_frontal_iphone_id, loja_feira_id, NOW(), NOW()),
    (gen_random_uuid(), 'Frontal iPhone 12 Mini', 'Frontal para iPhone 12 Mini', 'IPH-12M-FE', calculate_sale_price(300.00), 300.00, 0, false, categoria_frontal_iphone_id, loja_feira_id, NOW(), NOW()),
    (gen_random_uuid(), 'Frontal iPhone 12 Mini com aro', 'Frontal para iPhone 12 Mini com aro', 'IPH-12M-ARO-FE', calculate_sale_price(320.00), 320.00, 0, false, categoria_frontal_iphone_id, loja_feira_id, NOW(), NOW()),
    (gen_random_uuid(), 'Frontal iPhone 12 Pro', 'Frontal para iPhone 12 Pro', 'IPH-12P-FE', calculate_sale_price(380.00), 380.00, 0, false, categoria_frontal_iphone_id, loja_feira_id, NOW(), NOW()),
    (gen_random_uuid(), 'Frontal iPhone 12 Pro com aro', 'Frontal para iPhone 12 Pro com aro', 'IPH-12P-ARO-FE', calculate_sale_price(400.00), 400.00, 0, false, categoria_frontal_iphone_id, loja_feira_id, NOW(), NOW()),
    (gen_random_uuid(), 'Frontal iPhone 12 Pro Max', 'Frontal para iPhone 12 Pro Max', 'IPH-12PM-FE', calculate_sale_price(420.00), 420.00, 0, false, categoria_frontal_iphone_id, loja_feira_id, NOW(), NOW()),
    (gen_random_uuid(), 'Frontal iPhone 12 Pro Max com aro', 'Frontal para iPhone 12 Pro Max com aro', 'IPH-12PM-ARO-FE', calculate_sale_price(440.00), 440.00, 0, false, categoria_frontal_iphone_id, loja_feira_id, NOW(), NOW()),
    (gen_random_uuid(), 'Frontal iPhone 13', 'Frontal para iPhone 13', 'IPH-13-FE', calculate_sale_price(350.00), 350.00, 0, false, categoria_frontal_iphone_id, loja_feira_id, NOW(), NOW()),
    (gen_random_uuid(), 'Frontal iPhone 13 com aro', 'Frontal para iPhone 13 com aro', 'IPH-13-ARO-FE', calculate_sale_price(370.00), 370.00, 0, false, categoria_frontal_iphone_id, loja_feira_id, NOW(), NOW()),
    (gen_random_uuid(), 'Frontal iPhone 13 Mini', 'Frontal para iPhone 13 Mini', 'IPH-13M-FE', calculate_sale_price(330.00), 330.00, 0, false, categoria_frontal_iphone_id, loja_feira_id, NOW(), NOW()),
    (gen_random_uuid(), 'Frontal iPhone 13 Mini com aro', 'Frontal para iPhone 13 Mini com aro', 'IPH-13M-ARO-FE', calculate_sale_price(350.00), 350.00, 0, false, categoria_frontal_iphone_id, loja_feira_id, NOW(), NOW()),
    (gen_random_uuid(), 'Frontal iPhone 13 Pro', 'Frontal para iPhone 13 Pro', 'IPH-13P-FE', calculate_sale_price(450.00), 450.00, 0, false, categoria_frontal_iphone_id, loja_feira_id, NOW(), NOW()),
    (gen_random_uuid(), 'Frontal iPhone 13 Pro com aro', 'Frontal para iPhone 13 Pro com aro', 'IPH-13P-ARO-FE', calculate_sale_price(470.00), 470.00, 0, false, categoria_frontal_iphone_id, loja_feira_id, NOW(), NOW()),
    (gen_random_uuid(), 'Frontal iPhone 13 Pro Max', 'Frontal para iPhone 13 Pro Max', 'IPH-13PM-FE', calculate_sale_price(480.00), 480.00, 0, false, categoria_frontal_iphone_id, loja_feira_id, NOW(), NOW()),
    (gen_random_uuid(), 'Frontal iPhone 13 Pro Max com aro', 'Frontal para iPhone 13 Pro Max com aro', 'IPH-13PM-ARO-FE', calculate_sale_price(500.00), 500.00, 0, false, categoria_frontal_iphone_id, loja_feira_id, NOW(), NOW()),
    (gen_random_uuid(), 'Frontal iPhone 14', 'Frontal para iPhone 14', 'IPH-14-FE', calculate_sale_price(400.00), 400.00, 0, false, categoria_frontal_iphone_id, loja_feira_id, NOW(), NOW()),
    (gen_random_uuid(), 'Frontal iPhone 14 com aro', 'Frontal para iPhone 14 com aro', 'IPH-14-ARO-FE', calculate_sale_price(420.00), 420.00, 0, false, categoria_frontal_iphone_id, loja_feira_id, NOW(), NOW()),
    (gen_random_uuid(), 'Frontal iPhone 14 Plus', 'Frontal para iPhone 14 Plus', 'IPH-14PL-FE', calculate_sale_price(430.00), 430.00, 0, false, categoria_frontal_iphone_id, loja_feira_id, NOW(), NOW()),
    (gen_random_uuid(), 'Frontal iPhone 14 Plus com aro', 'Frontal para iPhone 14 Plus com aro', 'IPH-14PL-ARO-FE', calculate_sale_price(450.00), 450.00, 0, false, categoria_frontal_iphone_id, loja_feira_id, NOW(), NOW()),
    (gen_random_uuid(), 'Frontal iPhone 14 Pro', 'Frontal para iPhone 14 Pro', 'IPH-14P-FE', calculate_sale_price(520.00), 520.00, 0, false, categoria_frontal_iphone_id, loja_feira_id, NOW(), NOW()),
    (gen_random_uuid(), 'Frontal iPhone 14 Pro com aro', 'Frontal para iPhone 14 Pro com aro', 'IPH-14P-ARO-FE', calculate_sale_price(540.00), 540.00, 0, false, categoria_frontal_iphone_id, loja_feira_id, NOW(), NOW()),
    (gen_random_uuid(), 'Frontal iPhone 14 Pro Max', 'Frontal para iPhone 14 Pro Max', 'IPH-14PM-FE', calculate_sale_price(550.00), 550.00, 0, false, categoria_frontal_iphone_id, loja_feira_id, NOW(), NOW()),
    (gen_random_uuid(), 'Frontal iPhone 14 Pro Max com aro', 'Frontal para iPhone 14 Pro Max com aro', 'IPH-14PM-ARO-FE', calculate_sale_price(570.00), 570.00, 0, false, categoria_frontal_iphone_id, loja_feira_id, NOW(), NOW()),
    (gen_random_uuid(), 'Frontal iPhone 15', 'Frontal para iPhone 15', 'IPH-15-FE', calculate_sale_price(450.00), 450.00, 0, false, categoria_frontal_iphone_id, loja_feira_id, NOW(), NOW()),
    (gen_random_uuid(), 'Frontal iPhone 15 com aro', 'Frontal para iPhone 15 com aro', 'IPH-15-ARO-FE', calculate_sale_price(470.00), 470.00, 0, false, categoria_frontal_iphone_id, loja_feira_id, NOW(), NOW()),
    (gen_random_uuid(), 'Frontal iPhone 15 Plus', 'Frontal para iPhone 15 Plus', 'IPH-15PL-FE', calculate_sale_price(480.00), 480.00, 0, false, categoria_frontal_iphone_id, loja_feira_id, NOW(), NOW()),
    (gen_random_uuid(), 'Frontal iPhone 15 Plus com aro', 'Frontal para iPhone 15 Plus com aro', 'IPH-15PL-ARO-FE', calculate_sale_price(500.00), 500.00, 0, false, categoria_frontal_iphone_id, loja_feira_id, NOW(), NOW()),
    (gen_random_uuid(), 'Frontal iPhone 15 Pro', 'Frontal para iPhone 15 Pro', 'IPH-15P-FE', calculate_sale_price(580.00), 580.00, 0, false, categoria_frontal_iphone_id, loja_feira_id, NOW(), NOW()),
    (gen_random_uuid(), 'Frontal iPhone 15 Pro com aro', 'Frontal para iPhone 15 Pro com aro', 'IPH-15P-ARO-FE', calculate_sale_price(600.00), 600.00, 0, false, categoria_frontal_iphone_id, loja_feira_id, NOW(), NOW()),
    (gen_random_uuid(), 'Frontal iPhone 15 Pro Max', 'Frontal para iPhone 15 Pro Max', 'IPH-15PM-FE', calculate_sale_price(620.00), 620.00, 0, false, categoria_frontal_iphone_id, loja_feira_id, NOW(), NOW()),
    (gen_random_uuid(), 'Frontal iPhone 15 Pro Max com aro', 'Frontal para iPhone 15 Pro Max com aro', 'IPH-15PM-ARO-FE', calculate_sale_price(640.00), 640.00, 0, false, categoria_frontal_iphone_id, loja_feira_id, NOW(), NOW());

    RAISE NOTICE 'Produtos iPhone importados com sucesso para ambas as lojas!';

    -- ========================================
    -- PRODUTOS TECNO
    -- ========================================
    INSERT INTO products (id, name, description, sku, price, cost_price, stock, track_stock, category_id, store_id, created_at, updated_at) VALUES
    -- Tecno para Alexxcell Paraíso Sul
    (gen_random_uuid(), 'Frontal Tecno Spark 7', 'Frontal para Tecno Spark 7', 'TEC-SP7-PS', calculate_sale_price(45.00), 45.00, 0, false, categoria_frontal_tecno_id, loja_paraiso_id, NOW(), NOW()),
    (gen_random_uuid(), 'Frontal Tecno Spark 7 com aro', 'Frontal para Tecno Spark 7 com aro', 'TEC-SP7-ARO-PS', calculate_sale_price(65.00), 65.00, 0, false, categoria_frontal_tecno_id, loja_paraiso_id, NOW(), NOW()),
    (gen_random_uuid(), 'Frontal Tecno Spark 8', 'Frontal para Tecno Spark 8', 'TEC-SP8-PS', calculate_sale_price(50.00), 50.00, 0, false, categoria_frontal_tecno_id, loja_paraiso_id, NOW(), NOW()),
    (gen_random_uuid(), 'Frontal Tecno Spark 8 com aro', 'Frontal para Tecno Spark 8 com aro', 'TEC-SP8-ARO-PS', calculate_sale_price(70.00), 70.00, 0, false, categoria_frontal_tecno_id, loja_paraiso_id, NOW(), NOW()),
    (gen_random_uuid(), 'Frontal Tecno Spark 9', 'Frontal para Tecno Spark 9', 'TEC-SP9-PS', calculate_sale_price(55.00), 55.00, 0, false, categoria_frontal_tecno_id, loja_paraiso_id, NOW(), NOW()),
    (gen_random_uuid(), 'Frontal Tecno Spark 9 com aro', 'Frontal para Tecno Spark 9 com aro', 'TEC-SP9-ARO-PS', calculate_sale_price(75.00), 75.00, 0, false, categoria_frontal_tecno_id, loja_paraiso_id, NOW(), NOW()),
    (gen_random_uuid(), 'Frontal Tecno Spark 10', 'Frontal para Tecno Spark 10', 'TEC-SP10-PS', calculate_sale_price(60.00), 60.00, 0, false, categoria_frontal_tecno_id, loja_paraiso_id, NOW(), NOW()),
    (gen_random_uuid(), 'Frontal Tecno Spark 10 com aro', 'Frontal para Tecno Spark 10 com aro', 'TEC-SP10-ARO-PS', calculate_sale_price(80.00), 80.00, 0, false, categoria_frontal_tecno_id, loja_paraiso_id, NOW(), NOW()),
    (gen_random_uuid(), 'Frontal Tecno Camon 17', 'Frontal para Tecno Camon 17', 'TEC-CAM17-PS', calculate_sale_price(65.00), 65.00, 0, false, categoria_frontal_tecno_id, loja_paraiso_id, NOW(), NOW()),
    (gen_random_uuid(), 'Frontal Tecno Camon 17 com aro', 'Frontal para Tecno Camon 17 com aro', 'TEC-CAM17-ARO-PS', calculate_sale_price(85.00), 85.00, 0, false, categoria_frontal_tecno_id, loja_paraiso_id, NOW(), NOW()),
    (gen_random_uuid(), 'Frontal Tecno Camon 18', 'Frontal para Tecno Camon 18', 'TEC-CAM18-PS', calculate_sale_price(70.00), 70.00, 0, false, categoria_frontal_tecno_id, loja_paraiso_id, NOW(), NOW()),
    (gen_random_uuid(), 'Frontal Tecno Camon 18 com aro', 'Frontal para Tecno Camon 18 com aro', 'TEC-CAM18-ARO-PS', calculate_sale_price(90.00), 90.00, 0, false, categoria_frontal_tecno_id, loja_paraiso_id, NOW(), NOW()),
    (gen_random_uuid(), 'Frontal Tecno Camon 19', 'Frontal para Tecno Camon 19', 'TEC-CAM19-PS', calculate_sale_price(75.00), 75.00, 0, false, categoria_frontal_tecno_id, loja_paraiso_id, NOW(), NOW()),
    (gen_random_uuid(), 'Frontal Tecno Camon 19 com aro', 'Frontal para Tecno Camon 19 com aro', 'TEC-CAM19-ARO-PS', calculate_sale_price(95.00), 95.00, 0, false, categoria_frontal_tecno_id, loja_paraiso_id, NOW(), NOW()),
    (gen_random_uuid(), 'Frontal Tecno Pova 3', 'Frontal para Tecno Pova 3', 'TEC-POV3-PS', calculate_sale_price(60.00), 60.00, 0, false, categoria_frontal_tecno_id, loja_paraiso_id, NOW(), NOW()),
    (gen_random_uuid(), 'Frontal Tecno Pova 3 com aro', 'Frontal para Tecno Pova 3 com aro', 'TEC-POV3-ARO-PS', calculate_sale_price(80.00), 80.00, 0, false, categoria_frontal_tecno_id, loja_paraiso_id, NOW(), NOW()),
    (gen_random_uuid(), 'Frontal Tecno Pova 4', 'Frontal para Tecno Pova 4', 'TEC-POV4-PS', calculate_sale_price(65.00), 65.00, 0, false, categoria_frontal_tecno_id, loja_paraiso_id, NOW(), NOW()),
    (gen_random_uuid(), 'Frontal Tecno Pova 4 com aro', 'Frontal para Tecno Pova 4 com aro', 'TEC-POV4-ARO-PS', calculate_sale_price(85.00), 85.00, 0, false, categoria_frontal_tecno_id, loja_paraiso_id, NOW(), NOW()),
    (gen_random_uuid(), 'Frontal Tecno Phantom X', 'Frontal para Tecno Phantom X', 'TEC-PHX-PS', calculate_sale_price(120.00), 120.00, 0, false, categoria_frontal_tecno_id, loja_paraiso_id, NOW(), NOW()),
    (gen_random_uuid(), 'Frontal Tecno Phantom X com aro', 'Frontal para Tecno Phantom X com aro', 'TEC-PHX-ARO-PS', calculate_sale_price(140.00), 140.00, 0, false, categoria_frontal_tecno_id, loja_paraiso_id, NOW(), NOW()),

    -- Tecno para Alexcell Feira (duplicando todos os produtos para a segunda loja)
    (gen_random_uuid(), 'Frontal Tecno Spark 7', 'Frontal para Tecno Spark 7', 'TEC-SP7-FE', calculate_sale_price(45.00), 45.00, 0, false, categoria_frontal_tecno_id, loja_feira_id, NOW(), NOW()),
    (gen_random_uuid(), 'Frontal Tecno Spark 7 com aro', 'Frontal para Tecno Spark 7 com aro', 'TEC-SP7-ARO-FE', calculate_sale_price(65.00), 65.00, 0, false, categoria_frontal_tecno_id, loja_feira_id, NOW(), NOW()),
    (gen_random_uuid(), 'Frontal Tecno Spark 8', 'Frontal para Tecno Spark 8', 'TEC-SP8-FE', calculate_sale_price(50.00), 50.00, 0, false, categoria_frontal_tecno_id, loja_feira_id, NOW(), NOW()),
    (gen_random_uuid(), 'Frontal Tecno Spark 8 com aro', 'Frontal para Tecno Spark 8 com aro', 'TEC-SP8-ARO-FE', calculate_sale_price(70.00), 70.00, 0, false, categoria_frontal_tecno_id, loja_feira_id, NOW(), NOW()),
    (gen_random_uuid(), 'Frontal Tecno Spark 9', 'Frontal para Tecno Spark 9', 'TEC-SP9-FE', calculate_sale_price(55.00), 55.00, 0, false, categoria_frontal_tecno_id, loja_feira_id, NOW(), NOW()),
    (gen_random_uuid(), 'Frontal Tecno Spark 9 com aro', 'Frontal para Tecno Spark 9 com aro', 'TEC-SP9-ARO-FE', calculate_sale_price(75.00), 75.00, 0, false, categoria_frontal_tecno_id, loja_feira_id, NOW(), NOW()),
    (gen_random_uuid(), 'Frontal Tecno Spark 10', 'Frontal para Tecno Spark 10', 'TEC-SP10-FE', calculate_sale_price(60.00), 60.00, 0, false, categoria_frontal_tecno_id, loja_feira_id, NOW(), NOW()),
    (gen_random_uuid(), 'Frontal Tecno Spark 10 com aro', 'Frontal para Tecno Spark 10 com aro', 'TEC-SP10-ARO-FE', calculate_sale_price(80.00), 80.00, 0, false, categoria_frontal_tecno_id, loja_feira_id, NOW(), NOW()),
    (gen_random_uuid(), 'Frontal Tecno Camon 17', 'Frontal para Tecno Camon 17', 'TEC-CAM17-FE', calculate_sale_price(65.00), 65.00, 0, false, categoria_frontal_tecno_id, loja_feira_id, NOW(), NOW()),
    (gen_random_uuid(), 'Frontal Tecno Camon 17 com aro', 'Frontal para Tecno Camon 17 com aro', 'TEC-CAM17-ARO-FE', calculate_sale_price(85.00), 85.00, 0, false, categoria_frontal_tecno_id, loja_feira_id, NOW(), NOW()),
    (gen_random_uuid(), 'Frontal Tecno Camon 18', 'Frontal para Tecno Camon 18', 'TEC-CAM18-FE', calculate_sale_price(70.00), 70.00, 0, false, categoria_frontal_tecno_id, loja_feira_id, NOW(), NOW()),
    (gen_random_uuid(), 'Frontal Tecno Camon 18 com aro', 'Frontal para Tecno Camon 18 com aro', 'TEC-CAM18-ARO-FE', calculate_sale_price(90.00), 90.00, 0, false, categoria_frontal_tecno_id, loja_feira_id, NOW(), NOW()),
    (gen_random_uuid(), 'Frontal Tecno Camon 19', 'Frontal para Tecno Camon 19', 'TEC-CAM19-FE', calculate_sale_price(75.00), 75.00, 0, false, categoria_frontal_tecno_id, loja_feira_id, NOW(), NOW()),
    (gen_random_uuid(), 'Frontal Tecno Camon 19 com aro', 'Frontal para Tecno Camon 19 com aro', 'TEC-CAM19-ARO-FE', calculate_sale_price(95.00), 95.00, 0, false, categoria_frontal_tecno_id, loja_feira_id, NOW(), NOW()),
    (gen_random_uuid(), 'Frontal Tecno Pova 3', 'Frontal para Tecno Pova 3', 'TEC-POV3-FE', calculate_sale_price(60.00), 60.00, 0, false, categoria_frontal_tecno_id, loja_feira_id, NOW(), NOW()),
    (gen_random_uuid(), 'Frontal Tecno Pova 3 com aro', 'Frontal para Tecno Pova 3 com aro', 'TEC-POV3-ARO-FE', calculate_sale_price(80.00), 80.00, 0, false, categoria_frontal_tecno_id, loja_feira_id, NOW(), NOW()),
    (gen_random_uuid(), 'Frontal Tecno Pova 4', 'Frontal para Tecno Pova 4', 'TEC-POV4-FE', calculate_sale_price(65.00), 65.00, 0, false, categoria_frontal_tecno_id, loja_feira_id, NOW(), NOW()),
    (gen_random_uuid(), 'Frontal Tecno Pova 4 com aro', 'Frontal para Tecno Pova 4 com aro', 'TEC-POV4-ARO-FE', calculate_sale_price(85.00), 85.00, 0, false, categoria_frontal_tecno_id, loja_feira_id, NOW(), NOW()),
    (gen_random_uuid(), 'Frontal Tecno Phantom X', 'Frontal para Tecno Phantom X', 'TEC-PHX-FE', calculate_sale_price(120.00), 120.00, 0, false, categoria_frontal_tecno_id, loja_feira_id, NOW(), NOW()),
    (gen_random_uuid(), 'Frontal Tecno Phantom X com aro', 'Frontal para Tecno Phantom X com aro', 'TEC-PHX-ARO-FE', calculate_sale_price(140.00), 140.00, 0, false, categoria_frontal_tecno_id, loja_feira_id, NOW(), NOW());

    RAISE NOTICE 'Produtos Tecno importados com sucesso para ambas as lojas!';

END $$;

-- ========================================
-- LIMPEZA E RELATÓRIO FINAL
-- ========================================

-- Remove a função temporária
DROP FUNCTION IF EXISTS calculate_sale_price(DECIMAL);

-- Relatório final de verificação
SELECT 
    s.name AS loja,
    c.name AS categoria,
    COUNT(p.id) AS total_produtos,
    ROUND(AVG(p.cost_price), 2) AS preco_custo_medio,
    ROUND(AVG(p.price), 2) AS preco_venda_medio,
    ROUND(AVG(((p.price - p.cost_price) / p.cost_price) * 100), 2) AS margem_lucro_media_pct
FROM products p
JOIN stores s ON p.store_id = s.id
JOIN categories c ON p.category_id = c.id
WHERE c.name LIKE '%Frontal%'
GROUP BY s.name, c.name
ORDER BY s.name, c.name;

-- Verificação de produtos sem controle de estoque
SELECT 
    COUNT(*) as produtos_sem_controle_estoque
FROM products 
WHERE track_stock = false;

RAISE NOTICE '========================================';
RAISE NOTICE 'IMPORTAÇÃO COMPLETA FINALIZADA!';
RAISE NOTICE '========================================';
RAISE NOTICE 'Todos os produtos da planilha foram importados com sucesso!';
RAISE NOTICE 'Controle de estoque DESABILITADO para todos os produtos (track_stock = false)';
RAISE NOTICE 'Estoque inicial definido como 0 para todos os produtos';
RAISE NOTICE 'Margens aplicadas automaticamente: 150% (≤R$70), 120% (R$71-150), 100% (R$151-300), 80% (>R$300)';
RAISE NOTICE '========================================';T-G6PL-ARO-PS', calculate_sale_price(80.00), 80.00, 0, false, categoria_frontal_motorola_id, loja_paraiso_id, NOW(), NOW()),
    (gen_random_uuid(), 'Frontal G7', 'Frontal para Motorola G7', 'MOT-G7-PS', calculate_sale_price(70.00), 70.00, 0, false, categoria_frontal_motorola_id, loja_paraiso_id, NOW(), NOW()),
    (gen_random_uuid(), 'Frontal G7 com aro', 'Frontal para Motorola G7 com aro', 'MOT-G7-ARO-PS', calculate_sale_price(90.00), 90.00, 0, false, categoria_frontal_motorola_id, loja_paraiso_id, NOW(), NOW()),
    (gen_random_uuid(), 'Frontal G7 Plus', 'Frontal para Motorola G7 Plus', 'MOT-G7P-PS', calculate_sale_price(70.00), 70.00, 0, false, categoria_frontal_motorola_id, loja_paraiso_id, NOW(), NOW()),
    (gen_random_uuid(), 'Frontal G7 Plus com aro', 'Frontal para Motorola G7 Plus com aro', 'MOT-G7P-ARO-PS', calculate_sale_price(90.00), 90.00, 0, false, categoria_frontal_motorola_id, loja_paraiso_id, NOW(), NOW()),
    (gen_random_uuid(), 'Frontal G7 Play', 'Frontal para Motorola G7 Play', 'MOT-G7PL-PS', calculate_sale_price(70.00), 70.00, 0, false, categoria_frontal_motorola_id, loja_paraiso_id, NOW(), NOW()),
    (gen_random_uuid(), 'Frontal G7 Play com aro', 'Frontal para Motorola G7 Play com aro', 'MOT-G7PL-ARO-PS', calculate_sale_price(90.00), 90.00, 0, false, categoria_frontal_motorola_id, loja_paraiso_id, NOW(), NOW()),
    (gen_random_uuid(), 'Frontal G7 Power', 'Frontal para Motorola G7 Power', 'MOT-G7PW-PS', calculate_sale_price(70.00), 70.00, 0, false, categoria_frontal_motorola_id, loja_paraiso_id, NOW(), NOW()),
    (gen_random_uuid(), 'Frontal G7 Power com aro', 'Frontal para Motorola G7 Power com aro', 'MOT-G7PW-ARO-PS', calculate_sale_price(90.00), 90.00, 0, false, categoria_frontal_motorola_id, loja_paraiso_id, NOW(), NOW()),
    (gen_random_uuid(), 'Frontal G8', 'Frontal para Motorola G8', 'MOT-G8-PS', calculate_sale_price(80.00), 80.00, 0, false, categoria_frontal_motorola_id, loja_paraiso_id, NOW(), NOW()),
    (gen_random_uuid(), 'Frontal G8 com aro', 'Frontal para Motorola G8 com aro', 'MOT-G8-ARO-PS', calculate_sale_price(100.00), 100.00, 0, false, categoria_frontal_motorola_id, loja_paraiso_id, NOW(), NOW()),
    (gen_random_uuid(), 'Frontal G8 Plus', 'Frontal para Motorola G8 Plus', 'MOT-G8P-PS', calculate_sale_price(80.00), 80.00, 0, false, categoria_frontal_motorola_id, loja_paraiso_id, NOW(), NOW()),
    (gen_random_uuid(), 'Frontal G8 Plus com aro', 'Frontal para Motorola G8 Plus com aro', 'MOT-G8P-ARO-PS', calculate_sale_price(100.00), 100.00, 0, false, categoria_frontal_motorola_id, loja_paraiso_id, NOW(), NOW()),
    (gen_random_uuid(), 'Frontal G8 Play', 'Frontal para Motorola G8 Play', 'MOT-G8PL-PS', calculate_sale_price(80.00), 80.00, 0, false, categoria_frontal_motorola_id, loja_paraiso_id, NOW(), NOW()),
    (gen_random_uuid(), 'Frontal G8 Play com aro', 'Frontal para Motorola G8 Play com aro', 'MOT-G8PL-ARO-PS', calculate_sale_price(100.00), 100.00, 0, false, categoria_frontal_motorola_id, loja_paraiso_id, NOW(), NOW()),
    (gen_random_uuid(), 'Frontal G8 Power', 'Frontal para Motorola G8 Power', 'MOT-G8PW-PS', calculate_sale_price(80.00), 80.00, 0, false, categoria_frontal_motorola_id, loja_paraiso_id, NOW(), NOW()),
    (gen_random_uuid(), 'Frontal G8 Power com aro', 'Frontal para Motorola G8 Power com aro', 'MOT-G8PW-ARO-PS', calculate_sale_price(100.00), 100.00, 0, false, categoria_frontal_motorola_id, loja_paraiso_id, NOW(), NOW()),
    (gen_random_uuid(), 'Frontal G9', 'Frontal para Motorola G9', 'MOT-G9-PS', calculate_sale_price(70.00), 70.00, 0, false, categoria_frontal_motorola_id, loja_paraiso_id, NOW(), NOW()),
    (gen_random_uuid(), 'Frontal G9 com aro', 'Frontal para Motorola G9 com aro', 'MOT-G9-ARO-PS', calculate_sale_price(75.00), 75.00, 0, false, categoria_frontal_motorola_id, loja_paraiso_id, NOW(), NOW()),
    (gen_random_uuid(), 'Frontal G9 Plus', 'Frontal para Motorola G9 Plus', 'MOT-G9P-PS', calculate_sale_price(80.00), 80.00, 0, false, categoria_frontal_motorola_id, loja_paraiso_id, NOW(), NOW()),
    (gen_random_uuid(), 'Frontal G9 Plus com aro', 'Frontal para Motorola G9 Plus com aro', 'MOT-G9P-ARO-PS', calculate_sale_price(100.00), 100.00, 0, false, categoria_frontal_motorola_id, loja_paraiso_id, NOW(), NOW()),
    (gen_random_uuid(), 'Frontal G9 Play', 'Frontal para Motorola G9 Play', 'MOT-G9PL-PS', calculate_sale_price(70.00), 70.00, 0, false, categoria_frontal_motorola_id, loja_paraiso_id, NOW(), NOW()),
    (gen_random_uuid(), 'Frontal G9 Play com aro', 'Frontal para Motorola G9 Play com aro', 'MOT-G9PL-ARO-PS', calculate_sale_price(85.00), 85.00, 0, false, categoria_frontal_motorola_id, loja_paraiso_id, NOW(), NOW()),
    (gen_random_uuid(), 'Frontal G9 Power', 'Frontal para Motorola G9 Power', 'MOT-G9PW-PS', calculate_sale_price(70.00), 70.00, 0, false, categoria_frontal_motorola_id, loja_paraiso_id, NOW(), NOW()),
    (gen_random_uuid(), 'Frontal G9 Power com aro', 'Frontal para Motorola G9 Power com aro', 'MOT-G9PW-ARO-PS', calculate_sale_price(85.00), 85.00, 0, false, categoria_frontal_motorola_id, loja_paraiso_id, NOW(), NOW()),
    (gen_random_uuid(), 'Frontal G10', 'Frontal para Motorola G10', 'MOT-G10-PS', calculate_sale_price(70.00), 70.00, 0, false, categoria_frontal_motorola_id, loja_paraiso_id, NOW(), NOW()),
    (gen_random_uuid(), 'Frontal G10 com aro', 'Frontal para Motorola G10 com aro', 'MOT-G10-ARO-PS', calculate_sale_price(85.00), 85.00, 0, false, categoria_frontal_motorola_id, loja_paraiso_id, NOW(), NOW()),
    (gen_random_uuid(), 'Frontal G10 Power', 'Frontal para Motorola G10 Power', 'MOT-G10PW-PS', calculate_sale_price(70.00), 70.00, 0, false, categoria_frontal_motorola_id, loja_paraiso_id, NOW(), NOW()),
    (gen_random_uuid(), 'Frontal G10 Power com aro', 'Frontal para Motorola G10 Power com aro', 'MOT-G10PW-ARO-PS', calculate_sale_price(85.00), 85.00, 0, false, categoria_frontal_motorola_id, loja_paraiso_id, NOW(), NOW()),
    (gen_random_uuid(), 'Frontal G20', 'Frontal para Motorola G20', 'MOT-G20-PS', calculate_sale_price(70.00), 70.00, 0, false, categoria_frontal_motorola_id, loja_paraiso_id, NOW(), NOW()),
    (gen_random_uuid(), 'Frontal G20 com aro', 'Frontal para Motorola G20 com aro', 'MOT-G20-ARO-PS', calculate_sale_price(85.00), 85.00, 0, false, categoria_frontal_motorola_id, loja_paraiso_id, NOW(), NOW()),
    (gen_random_uuid(), 'Frontal G30', 'Frontal para Motorola G30', 'MOT-G30-PS', calculate_sale_price(70.00), 70.00, 0, false, categoria_frontal_motorola_id, loja_paraiso_id, NOW(), NOW()),
    (gen_random_uuid(), 'Frontal G30 com aro', 'Frontal para Motorola G30 com aro', 'MOT-G30-ARO-PS', calculate_sale_price(85.00), 85.00, 0, false, categoria_frontal_motorola_id, loja_paraiso_id, NOW(), NOW()),
    (gen_random_uuid(), 'Frontal G40', 'Frontal para Motorola G40', 'MOT-G40-PS', calculate_sale_price(80.00), 80.00, 0, false, categoria_frontal_motorola_id, loja_paraiso_id, NOW(), NOW()),
    (gen_random_uuid(), 'Frontal G40 com aro', 'Frontal para Motorola G40 com aro', 'MOT-G40-ARO-PS', calculate_sale_price(100.00), 100.00, 0, false, categoria_frontal_motorola_id, loja_paraiso_id, NOW(), NOW()),
    (gen_random_uuid(), 'Frontal G50', 'Frontal para Motorola G50', 'MOT-G50-PS', calculate_sale_price(80.00), 80.00, 0, false, categoria_frontal_motorola_id, loja_paraiso_id, NOW(), NOW()),
    (gen_random_uuid(), 'Frontal G50 com aro', 'Frontal para Motorola G50 com aro', 'MOT-G50-ARO-PS', calculate_sale_price(100.00), 100.00, 0, false, categoria_frontal_motorola_id, loja_paraiso_id, NOW(), NOW()),
    (gen_random_uuid(), 'Frontal G60', 'Frontal para Motorola G60', 'MOT-G60-PS', calculate_sale_price(90.00), 90.00, 0, false, categoria_frontal_motorola_id, loja_paraiso_id, NOW(), NOW()),
    (gen_random_uuid(), 'Frontal G60 com aro', 'Frontal para Motorola G60 com aro', 'MOT-G60-ARO-PS', calculate_sale_price(110.00), 110.00, 0, false, categoria_frontal_motorola_id, loja_paraiso_id, NOW(), NOW()),
    (gen_random_uuid(), 'Frontal G60s', 'Frontal para Motorola G60s', 'MOT-G60S-PS', calculate_sale_price(90.00), 90.00, 0, false, categoria_frontal_motorola_id, loja_paraiso_id, NOW(), NOW()),
    (gen_random_uuid(), 'Frontal G60s com aro', 'Frontal para Motorola G60s com aro', 'MOT-G60S-ARO-PS', calculate_sale_price(110.00), 110.00, 0, false, categoria_frontal_motorola_id, loja_paraiso_id, NOW(), NOW()),
    (gen_random_uuid(), 'Frontal G71', 'Frontal para Motorola G71', 'MOT-G71-PS', calculate_sale_price(100.00), 100.00, 0, false, categoria_frontal_motorola_id, loja_paraiso_id, NOW(), NOW()),
    (gen_random_uuid(), 'Frontal G71 com aro', 'Frontal para Motorola G71 com aro', 'MOT-G71-ARO-PS', calculate_sale_price(120.00), 120.00, 0, false, categoria_frontal_motorola_id, loja_paraiso_id, NOW(), NOW()),
    (gen_random_uuid(), 'Frontal G100', 'Frontal para Motorola G100', 'MOT-G100-PS', calculate_sale_price(150.00), 150.00, 0, false, categoria_frontal_motorola_id, loja_paraiso_id, NOW(), NOW()),
    (gen_random_uuid(), 'Frontal G100 com aro', 'Frontal para Motorola G100 com aro', 'MOT-G100-ARO-PS', calculate_sale_price(170.00), 170.00, 0, false, categoria_frontal_motorola_id, loja_paraiso_id, NOW(), NOW()),
    (gen_random_uuid(), 'Frontal One', 'Frontal para Motorola One', 'MOT-ONE-PS', calculate_sale_price(80.00), 80.00, 0, false, categoria_frontal_motorola_id, loja_paraiso_id, NOW(), NOW()),
    (gen_random_uuid(), 'Frontal One com aro', 'Frontal para Motorola One com aro', 'MOT-ONE-ARO-PS', calculate_sale_price(100.00), 100.00, 0, false, categoria_frontal_motorola_id, loja_paraiso_id, NOW(), NOW()),
    (gen_random_uuid(), 'Frontal One Action', 'Frontal para Motorola One Action', 'MOT-ONEACT-PS', calculate_sale_price(80.00), 80.00, 0, false, categoria_frontal_motorola_id, loja_paraiso_id, NOW(), NOW()),
    (gen_random_uuid(), 'Frontal One Action com aro', 'Frontal para Motorola One Action com aro', 'MOT-ONEACT-ARO-PS', calculate_sale_price(100.00), 100.00, 0, false, categoria_frontal_motorola_id, loja_paraiso_id, NOW(), NOW()),
    (gen_random_uuid(), 'Frontal One Fusion', 'Frontal para Motorola One Fusion', 'MOT-ONEFUS-PS', calculate_sale_price(90.00), 90.00, 0, false, categoria_frontal_motorola_id, loja_paraiso_id, NOW(), NOW()),
    (gen_random_uuid(), 'Frontal One Fusion com aro', 'Frontal para Motorola One Fusion com aro', 'MOT-ONEFUS-ARO-PS', calculate_sale_price(110.00), 110.00, 0, false, categoria_frontal_motorola_id, loja_paraiso_id, NOW(), NOW()),
    (gen_random_uuid(), 'Frontal One Fusion Plus', 'Frontal para Motorola One Fusion Plus', 'MOT-ONEFUSP-PS', calculate_sale_price(90.00), 90.00, 0, false, categoria_frontal_motorola_id, loja_paraiso_id, NOW(), NOW()),
    (gen_random_uuid(), 'Frontal One Fusion Plus com aro', 'Frontal para Motorola One Fusion Plus com aro', 'MOT-ONEFUSP-ARO-PS', calculate_sale_price(110.00), 110.00, 0, false, categoria_frontal_motorola_id, loja_paraiso_id, NOW(), NOW()),
    (gen_random_uuid(), 'Frontal One Hyper', 'Frontal para Motorola One Hyper', 'MOT-ONEHYP-PS', calculate_sale_price(100.00), 100.00, 0, false, categoria_frontal_motorola_id, loja_paraiso_id, NOW(), NOW()),
    (gen_random_uuid(), 'Frontal One Hyper com aro', 'Frontal para Motorola One Hyper com aro', 'MOT-ONEHYP-ARO-PS', calculate_sale_price(120.00), 120.00, 0, false, categoria_frontal_motorola_id, loja_paraiso_id, NOW(), NOW()),
    (gen_random_uuid(), 'Frontal One Macro', 'Frontal para Motorola One Macro', 'MOT-ONEMAC-PS', calculate_sale_price(80.00), 80.00, 0, false, categoria_frontal_motorola_id, loja_paraiso_id, NOW(), NOW()),
    (gen_random_uuid(), 'Frontal One Macro com aro', 'Frontal para Motorola One Macro com aro', 'MOT-ONEMAC-ARO-PS', calculate_sale_price(100.00), 100.00, 0, false, categoria_frontal_motorola_id, loja_paraiso_id, NOW(), NOW()),
    (gen_random_uuid(), 'Frontal One Vision', 'Frontal para Motorola One Vision', 'MOT-ONEVIS-PS', calculate_sale_price(90.00), 90.00, 0, false, categoria_frontal_motorola_id, loja_paraiso_id, NOW(), NOW()),
    (gen_random_uuid(), 'Frontal One Vision com aro', 'Frontal para Motorola One Vision com aro', 'MOT-ONEVIS-ARO-PS', calculate_sale_price(110.00), 110.00, 0, false, categoria_frontal_motorola_id, loja_paraiso_id, NOW(), NOW()),
    (gen_random_uuid(), 'Frontal One Zoom', 'Frontal para Motorola One Zoom', 'MOT-ONEZOOM-PS', calculate_sale_price(100.00), 100.00, 0, false, categoria_frontal_motorola_id, loja_paraiso_id, NOW(), NOW()),
    (gen_random_uuid(), 'Frontal One Zoom com aro', 'Frontal para Motorola One Zoom com aro', 'MOT-ONEZOOM-ARO-PS', calculate_sale_price(120.00), 120.00, 0, false, categoria_frontal_motorola_id, loja_paraiso_id, NOW(), NOW()),
    (gen_random_uuid(), 'Frontal Edge', 'Frontal para Motorola Edge', 'MOT-EDGE-PS', calculate_sale_price(200.00), 200.00, 0, false, categoria_frontal_motorola_id, loja_paraiso_id, NOW(), NOW()),
    (gen_random_uuid(), 'Frontal Edge com aro', 'Frontal para Motorola Edge com aro', 'MOT-EDGE-ARO-PS', calculate_sale_price(220.00), 220.00, 0, false, categoria_frontal_motorola_id, loja_paraiso_id, NOW(), NOW()),
    (gen_random_uuid(), 'Frontal Edge 20', 'Frontal para Motorola Edge 20', 'MOT-EDGE20-PS', calculate_sale_price(180.00), 180.00, 0, false, categoria_frontal_motorola_id, loja_paraiso_id, NOW(), NOW()),
    (gen_random_uuid(), 'Frontal Edge 20 com aro', 'Frontal para Motorola Edge 20 com aro', 'MOT-EDGE20-ARO-PS', calculate_sale_price(200.00), 200.00, 0, false, categoria_frontal_motorola_id, loja_paraiso_id, NOW(), NOW()),
    (gen_random_uuid(), 'Frontal Edge 30', 'Frontal para Motorola Edge 30', 'MOT-EDGE30-PS', calculate_sale_price(190.00), 190.00, 0, false, categoria_frontal_motorola_id, loja_paraiso_id, NOW(), NOW()),
    (gen_random_uuid(), 'Frontal Edge 30 com aro', 'Frontal para Motorola Edge 30 com aro', 'MOT-EDGE30-ARO-PS', calculate_sale_price(210.00), 210.00, 0, false, categoria_frontal_motorola_id, loja_paraiso_id, NOW(), NOW()),
    (gen_random_uuid(), 'Frontal Edge 40', 'Frontal para Motorola Edge 40', 'MOT-EDGE40-PS', calculate_sale_price(200.00), 200.00, 0, false, categoria_frontal_motorola_id, loja_paraiso_id, NOW(), NOW()),
    (gen_random_uuid(), 'Frontal Edge 40 com aro', 'Frontal para Motorola Edge 40 com aro', 'MOT-EDGE40-ARO-PS', calculate_sale_price(220.00), 220.00, 0, false, categoria_frontal_motorola_id, loja_paraiso_id, NOW(), NOW());

    -- Loja Feira - Motorola (duplicando os produtos para a segunda loja)
    INSERT INTO products (id, name, description, sku, price, cost_price, stock, track_stock, category_id, store_id, created_at, updated_at) VALUES
    (gen_random_uuid(), 'Frontal E4', 'Frontal para Motorola E4', 'MOT-E4-FE', calculate_sale_price(50.00), 50.00, 0, false, categoria_frontal_motorola_id, loja_feira_id, NOW(), NOW()),
    (gen_random_uuid(), 'Frontal E4 com aro', 'Frontal para Motorola E4 com aro', 'MOT-E4-ARO-FE', calculate_sale_price(70.00), 70.00, 0, false, categoria_frontal_motorola_id, loja_feira_id, NOW(), NOW()),
    (gen_random_uuid(), 'Frontal E4 Plus', 'Frontal para Motorola E4 Plus', 'MOT-E4P-FE', calculate_sale_price(50.00), 50.00, 0, false, categoria_frontal_motorola_id, loja_feira_id, NOW(), NOW()),
    (gen_random_uuid(), 'Frontal E4 Plus com aro', 'Frontal para Motorola E4 Plus com aro', 'MOT-E4P-ARO-FE', calculate_sale_price(70.00), 70.00, 0, false, categoria_frontal_motorola_id, loja_feira_id, NOW(), NOW()),
    (gen_random_uuid(), 'Frontal E5', 'Frontal para Motorola E5', 'MOT-E5-FE', calculate_sale_price(50.00), 50.00, 0, false, categoria_frontal_motorola_id, loja_feira_id, NOW(), NOW()),
    (gen_random_uuid(), 'Frontal E5 com aro', 'Frontal para Motorola E5 com aro', 'MOT-E5-ARO-FE', calculate_sale_price(70.00), 70.00, 0, false, categoria_frontal_motorola_id, loja_feira_id, NOW(), NOW()),
    (gen_random_uuid(), 'Frontal E5 Plus', 'Frontal para Motorola E5 Plus', 'MOT-E5P-FE', calculate_sale_price(50.00), 50.00, 0, false, categoria_frontal_motorola_id, loja_feira_id, NOW(), NOW()),
    (gen_random_uuid(), 'Frontal E5 Plus com aro', 'Frontal para Motorola E5 Plus com aro', 'MOT-E5P-ARO-FE', calculate_sale_price(70.00), 70.00, 0, false, categoria_frontal_motorola_id, loja_feira_id, NOW(), NOW()),
    (gen_random_uuid(), 'Frontal E5 Play', 'Frontal para Motorola E5 Play', 'MOT-E5PL-FE', calculate_sale_price(50.00), 50.00, 0, false, categoria_frontal_motorola_id, loja_feira_id, NOW(), NOW()),
    (gen_random_uuid(), 'Frontal E5 Play com aro', 'Frontal para Motorola E5 Play com aro', 'MOT-E5PL-ARO-FE', calculate_sale_price(70.00), 70.00, 0, false, categoria_frontal_motorola_id, loja_feira_id, NOW(), NOW()),
    (gen_random_uuid(), 'Frontal E6', 'Frontal para Motorola E6', 'MOT-E6-FE', calculate_sale_price(50.00), 50.00, 0, false, categoria_frontal_motorola_id, loja_feira_id, NOW(), NOW()),
    (gen_random_uuid(), 'Frontal E6 com aro', 'Frontal para Motorola E6 com aro', 'MOT-E6-ARO-FE', calculate_sale_price(70.00), 70.00, 0, false, categoria_frontal_motorola_id, loja_feira_id, NOW(), NOW()),
    (gen_random_uuid(), 'Frontal E6 Plus', 'Frontal para Motorola E6 Plus', 'MOT-E6P-FE', calculate_sale_price(50.00), 50.00, 0, false, categoria_frontal_motorola_id, loja_feira_id, NOW(), NOW()),
    (gen_random_uuid(), 'Frontal E6 Plus com aro', 'Frontal para Motorola E6 Plus com aro', 'MOT-E6P-ARO-FE', calculate_sale_price(70.00), 70.00, 0, false, categoria_frontal_motorola_id, loja_feira_id, NOW(), NOW()),
    (gen_random_uuid(), 'Frontal E6 Play', 'Frontal para Motorola E6 Play', 'MOT-E6PL-FE', calculate_sale_price(50.00), 50.00, 0, false, categoria_frontal_motorola_id, loja_feira_id, NOW(), NOW()),
    (gen_random_uuid(), 'Frontal E6 Play com aro', 'Frontal para Motorola E6 Play com aro', 'MOT-E6PL-ARO-FE', calculate_sale_price(70.00), 70.00, 0, false, categoria_frontal_motorola_id, loja_feira_id, NOW(), NOW()),
    (gen_random_uuid(), 'Frontal E6s', 'Frontal para Motorola E6s', 'MOT-E6S-FE', calculate_sale_price(50.00), 50.00, 0, false, categoria_frontal_motorola_id, loja_feira_id, NOW(), NOW()),
    (gen_random_uuid(), 'Frontal E6s com aro', 'Frontal para Motorola E6s com aro', 'MOT-E6S-ARO-FE', calculate_sale_price(70.00), 70.00, 0, false, categoria_frontal_motorola_id, loja_feira_id, NOW(), NOW()),
    (gen_random_uuid(), 'Frontal E7', 'Frontal para Motorola E7', 'MOT-E7-FE', calculate_sale_price(60.00), 60.00, 0, false, categoria_frontal_motorola_id, loja_feira_id, NOW(), NOW()),
    (gen_random_uuid(), 'Frontal E7 com aro', 'Frontal para Motorola E7 com aro', 'MOT-E7-ARO-FE', calculate_sale_price(80.00), 80.00, 0, false, categoria_frontal_motorola_id, loja_feira_id, NOW(), NOW()),
    (gen_random_uuid(), 'Frontal E7 Plus', 'Frontal para Motorola E7 Plus', 'MOT-E7P-FE', calculate_sale_price(60.00), 60.00, 0, false, categoria_frontal_motorola_id, loja_feira_id, NOW(), NOW()),
    (gen_random_uuid(), 'Frontal E7 Plus com aro', 'Frontal para Motorola E7 Plus com aro', 'MOT-E7P-ARO-FE', calculate_sale_price(80.00), 80.00, 0, false, categoria_frontal_motorola_id, loja_feira_id, NOW(), NOW()),
    (gen_random_uuid(), 'Frontal E7 Power', 'Frontal para Motorola E7 Power', 'MOT-E7PW-FE', calculate_sale_price(60.00), 60.00, 0, false, categoria_frontal_motorola_id, loja_feira_id, NOW(), NOW()),
    (gen_random_uuid(), 'Frontal E7 Power com aro', 'Frontal para Motorola E7 Power com aro', 'MOT-E7PW-ARO-FE', calculate_sale_price(80.00), 80.00, 0, false, categoria_frontal_motorola_id, loja_feira_id, NOW(), NOW()),
    (gen_random_uuid(), 'Frontal G4', 'Frontal para Motorola G4', 'MOT-G4-FE', calculate_sale_price(50.00), 50.00, 0, false, categoria_frontal_motorola_id, loja_feira_id, NOW(), NOW()),
    (gen_random_uuid(), 'Frontal G4 com aro', 'Frontal para Motorola G4 com aro', 'MOT-G4-ARO-FE', calculate_sale_price(70.00), 70.00, 0, false, categoria_frontal_motorola_id, loja_feira_id, NOW(), NOW()),
    (gen_random_uuid(), 'Frontal G4 Plus', 'Frontal para Motorola G4 Plus', 'MOT-G4P-FE', calculate_sale_price(50.00), 50.00, 0, false, categoria_frontal_motorola_id, loja_feira_id, NOW(), NOW()),
    (gen_random_uuid(), 'Frontal G4 Plus com aro', 'Frontal para Motorola G4 Plus com aro', 'MOT-G4P-ARO-FE', calculate_sale_price(70.00), 70.00, 0, false, categoria_frontal_motorola_id, loja_feira_id, NOW(), NOW()),
    (gen_random_uuid(), 'Frontal G4 Play', 'Frontal para Motorola G4 Play', 'MOT-G4PL-FE', calculate_sale_price(50.00), 50.00, 0, false, categoria_frontal_motorola_id, loja_feira_id, NOW(), NOW()),
    (gen_random_uuid(), 'Frontal G4 Play com aro', 'Frontal para Motorola G4 Play com aro', 'MOT-G4PL-ARO-FE', calculate_sale_price(70.00), 70.00, 0, false, categoria_frontal_motorola_id, loja_feira_id, NOW(), NOW()),
    (gen_random_uuid(), 'Frontal G5', 'Frontal para Motorola G5', 'MOT-G5-FE', calculate_sale_price(50.00), 50.00, 0, false, categoria_frontal_motorola_id, loja_feira_id, NOW(), NOW()),
    (gen_random_uuid(), 'Frontal G5 com aro', 'Frontal para Motorola G5 com aro', 'MOT-G5-ARO-FE', calculate_sale_price(70.00), 70.00, 0, false, categoria_frontal_motorola_id, loja_feira_id, NOW(), NOW()),
    (gen_random_uuid(), 'Frontal G5 Plus', 'Frontal para Motorola G5 Plus', 'MOT-G5P-FE', calculate_sale_price(50.00), 50.00, 0, false, categoria_frontal_motorola_id, loja_feira_id, NOW(), NOW()),
    (gen_random_uuid(), 'Frontal G5 Plus com aro', 'Frontal para Motorola G5 Plus com aro', 'MOT-G5P-ARO-FE', calculate_sale_price(70.00), 70.00, 0, false, categoria_frontal_motorola_id, loja_feira_id, NOW(), NOW()),
    (gen_random_uuid(), 'Frontal G5s', 'Frontal para Motorola G5s', 'MOT-G5S-FE', calculate_sale_price(50.00), 50.00, 0, false, categoria_frontal_motorola_id, loja_feira_id, NOW(), NOW()),
    (gen_random_uuid(), 'Frontal G5s com aro', 'Frontal para Motorola G5s com aro', 'MOT-G5S-ARO-FE', calculate_sale_price(70.00), 70.00, 0, false, categoria_frontal_motorola_id, loja_feira_id, NOW(), NOW()),
    (gen_random_uuid(), 'Frontal G5s Plus', 'Frontal para Motorola G5s Plus', 'MOT-G5SP-FE', calculate_sale_price(50.00), 50.00, 0, false, categoria_frontal_motorola_id, loja_feira_id, NOW(), NOW()),
    (gen_random_uuid(), 'Frontal G5s Plus com aro', 'Frontal para Motorola G5s Plus com aro', 'MOT-G5SP-ARO-FE', calculate_sale_price(70.00), 70.00, 0, false, categoria_frontal_motorola_id, loja_feira_id, NOW(), NOW()),
    (gen_random_uuid(), 'Frontal G6', 'Frontal para Motorola G6', 'MOT-G6-FE', calculate_sale_price(60.00), 60.00, 0, false, categoria_frontal_motorola_id, loja_feira_id, NOW(), NOW()),
    (gen_random_uuid(), 'Frontal G6 com aro', 'Frontal para Motorola G6 com aro', 'MOT-G6-ARO-FE', calculate_sale_price(80.00), 80.00, 0, false, categoria_frontal_motorola_id, loja_feira_id, NOW(), NOW()),
    (gen_random_uuid(), 'Frontal G6 Plus', 'Frontal para Motorola G6 Plus', 'MOT-G6P-FE', calculate_sale_price(60.00), 60.00, 0, false, categoria_frontal_motorola_id, loja_feira_id, NOW(), NOW()),
    (gen_random_uuid(), 'Frontal G6 Plus com aro', 'Frontal para Motorola G6 Plus com aro', 'MOT-G6P-ARO-FE', calculate_sale_price(80.00), 80.00, 0, false, categoria_frontal_motorola_id, loja_feira_id, NOW(), NOW()),
    (gen_random_uuid(), 'Frontal G6 Play', 'Frontal para Motorola G6 Play', 'MOT-G6PL-FE', calculate_sale_price(60.00), 60.00, 0, false, categoria_frontal_motorola_id, loja_feira_id, NOW(), NOW()),
    (gen_random_uuid(), 'Frontal G6 Play com aro', 'Frontal para Motorola G6 Play com aro', 'MO