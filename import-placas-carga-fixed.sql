-- Importação de Placas de Carga
-- Baseado na planilha Tabela Tiaguinho cell.xlsx
-- Regras de preço: até R$25 = R$70, 26-50 = 120%, acima 50 = 130%

-- Primeiro, criar a categoria se não existir
INSERT INTO categories (name) 
VALUES ('Placas de Carga')
ON CONFLICT (name) DO NOTHING;

-- Inserir as placas de carga

INSERT INTO products (name, sku, category_id, cost_price, price, stock, store_id)
VALUES (
  'Placa Sub G1',
  'PLC-0001',
  (SELECT id FROM categories WHERE name = 'Placas de Carga'),
  54.6,
  91,
  3,
  1
);
INSERT INTO products (name, sku, category_id, cost_price, price, stock, store_id)
VALUES (
  'Placa Sub Mi play',
  'PLC-0002',
  (SELECT id FROM categories WHERE name = 'Placas de Carga'),
  85.8,
  143,
  6,
  2
);
INSERT INTO products (name, sku, category_id, cost_price, price, stock, store_id)
VALUES (
  'Placa Sub G2',
  'PLC-0003',
  (SELECT id FROM categories WHERE name = 'Placas de Carga'),
  36,
  60,
  8,
  1
);
INSERT INTO products (name, sku, category_id, cost_price, price, stock, store_id)
VALUES (
  'Placa Sub Mi go/Mi 5A',
  'PLC-0004',
  (SELECT id FROM categories WHERE name = 'Placas de Carga'),
  66.3,
  110.5,
  4,
  2
);
INSERT INTO products (name, sku, category_id, cost_price, price, stock, store_id)
VALUES (
  'Placa Sub G3',
  'PLC-0005',
  (SELECT id FROM categories WHERE name = 'Placas de Carga'),
  46.8,
  78,
  5,
  1
);
INSERT INTO products (name, sku, category_id, cost_price, price, stock, store_id)
VALUES (
  'Placa Sub Mi 3',
  'PLC-0006',
  (SELECT id FROM categories WHERE name = 'Placas de Carga'),
  93.6,
  156,
  10,
  2
);
INSERT INTO products (name, sku, category_id, cost_price, price, stock, store_id)
VALUES (
  'Placa Sub G4 com aro',
  'PLC-0007',
  (SELECT id FROM categories WHERE name = 'Placas de Carga'),
  70.2,
  117,
  9,
  1
);
INSERT INTO products (name, sku, category_id, cost_price, price, stock, store_id)
VALUES (
  'Placa Sub Mi 5',
  'PLC-0008',
  (SELECT id FROM categories WHERE name = 'Placas de Carga'),
  93.6,
  156,
  10,
  2
);
INSERT INTO products (name, sku, category_id, cost_price, price, stock, store_id)
VALUES (
  'Placa Sub G4 play com aro',
  'PLC-0009',
  (SELECT id FROM categories WHERE name = 'Placas de Carga'),
  62.4,
  104,
  1,
  1
);
INSERT INTO products (name, sku, category_id, cost_price, price, stock, store_id)
VALUES (
  'Placa Sub Mi a1',
  'PLC-0010',
  (SELECT id FROM categories WHERE name = 'Placas de Carga'),
  78,
  130,
  4,
  2
);
INSERT INTO products (name, sku, category_id, cost_price, price, stock, store_id)
VALUES (
  'Placa Sub G5',
  'PLC-0011',
  (SELECT id FROM categories WHERE name = 'Placas de Carga'),
  50.7,
  84.5,
  10,
  1
);
INSERT INTO products (name, sku, category_id, cost_price, price, stock, store_id)
VALUES (
  'Placa Sub Mi a2',
  'PLC-0012',
  (SELECT id FROM categories WHERE name = 'Placas de Carga'),
  54.6,
  91,
  9,
  2
);
INSERT INTO products (name, sku, category_id, cost_price, price, stock, store_id)
VALUES (
  'Placa Sub G5 plus',
  'PLC-0013',
  (SELECT id FROM categories WHERE name = 'Placas de Carga'),
  46.8,
  78,
  5,
  1
);
INSERT INTO products (name, sku, category_id, cost_price, price, stock, store_id)
VALUES (
  'Placa Sub Mi a2 lite',
  'PLC-0014',
  (SELECT id FROM categories WHERE name = 'Placas de Carga'),
  58.5,
  97.5,
  4,
  2
);
INSERT INTO products (name, sku, category_id, cost_price, price, stock, store_id)
VALUES (
  'Placa Sub G5s',
  'PLC-0015',
  (SELECT id FROM categories WHERE name = 'Placas de Carga'),
  46.8,
  78,
  4,
  1
);
INSERT INTO products (name, sku, category_id, cost_price, price, stock, store_id)
VALUES (
  'Placa Sub Mi a3 incell',
  'PLC-0016',
  (SELECT id FROM categories WHERE name = 'Placas de Carga'),
  62.4,
  104,
  3,
  2
);
INSERT INTO products (name, sku, category_id, cost_price, price, stock, store_id)
VALUES (
  'Placa Sub G5s plus',
  'PLC-0017',
  (SELECT id FROM categories WHERE name = 'Placas de Carga'),
  50.7,
  84.5,
  6,
  1
);
INSERT INTO products (name, sku, category_id, cost_price, price, stock, store_id)
VALUES (
  'Placa Sub Mi a3 oled',
  'PLC-0018',
  (SELECT id FROM categories WHERE name = 'Placas de Carga'),
  210.6,
  351,
  2,
  2
);
INSERT INTO products (name, sku, category_id, cost_price, price, stock, store_id)
VALUES (
  'Placa Sub G5g com aro',
  'PLC-0019',
  (SELECT id FROM categories WHERE name = 'Placas de Carga'),
  148.2,
  247,
  9,
  1
);
INSERT INTO products (name, sku, category_id, cost_price, price, stock, store_id)
VALUES (
  'Placa Sub Mi a3 oled com aro',
  'PLC-0020',
  (SELECT id FROM categories WHERE name = 'Placas de Carga'),
  198.9,
  331.5,
  3,
  2
);
INSERT INTO products (name, sku, category_id, cost_price, price, stock, store_id)
VALUES (
  'Placa Sub G5g plus/ G100',
  'PLC-0021',
  (SELECT id FROM categories WHERE name = 'Placas de Carga'),
  89.7,
  149.5,
  8,
  1
);
INSERT INTO products (name, sku, category_id, cost_price, price, stock, store_id)
VALUES (
  'Placa Sub Mi a3 oled com aro (Premium)',
  'PLC-0022',
  (SELECT id FROM categories WHERE name = 'Placas de Carga'),
  210.6,
  351,
  4,
  2
);
INSERT INTO products (name, sku, category_id, cost_price, price, stock, store_id)
VALUES (
  'Placa Sub G5g plus com aro',
  'PLC-0023',
  (SELECT id FROM categories WHERE name = 'Placas de Carga'),
  171.6,
  286,
  7,
  1
);
INSERT INTO products (name, sku, category_id, cost_price, price, stock, store_id)
VALUES (
  'Placa Sub Mi 8 incell',
  'PLC-0024',
  (SELECT id FROM categories WHERE name = 'Placas de Carga'),
  81.9,
  136.5,
  1,
  2
);
INSERT INTO products (name, sku, category_id, cost_price, price, stock, store_id)
VALUES (
  'Placa Sub G6',
  'PLC-0025',
  (SELECT id FROM categories WHERE name = 'Placas de Carga'),
  70.2,
  117,
  2,
  1
);
INSERT INTO products (name, sku, category_id, cost_price, price, stock, store_id)
VALUES (
  'Placa Sub Mi 8 oled',
  'PLC-0026',
  (SELECT id FROM categories WHERE name = 'Placas de Carga'),
  117,
  195,
  4,
  2
);
INSERT INTO products (name, sku, category_id, cost_price, price, stock, store_id)
VALUES (
  'Placa Sub G6 com aro',
  'PLC-0027',
  (SELECT id FROM categories WHERE name = 'Placas de Carga'),
  78,
  130,
  7,
  1
);
INSERT INTO products (name, sku, category_id, cost_price, price, stock, store_id)
VALUES (
  'Placa Sub Mi 8 lite',
  'PLC-0028',
  (SELECT id FROM categories WHERE name = 'Placas de Carga'),
  58.5,
  97.5,
  4,
  2
);
INSERT INTO products (name, sku, category_id, cost_price, price, stock, store_id)
VALUES (
  'Placa Sub G6 play/E5',
  'PLC-0029',
  (SELECT id FROM categories WHERE name = 'Placas de Carga'),
  54.6,
  91,
  10,
  1
);
INSERT INTO products (name, sku, category_id, cost_price, price, stock, store_id)
VALUES (
  'Placa Sub Mi 8 lite com aro',
  'PLC-0030',
  (SELECT id FROM categories WHERE name = 'Placas de Carga'),
  85.8,
  143,
  6,
  2
);
INSERT INTO products (name, sku, category_id, cost_price, price, stock, store_id)
VALUES (
  'Placa Sub G6 play/E5 com aro',
  'PLC-0031',
  (SELECT id FROM categories WHERE name = 'Placas de Carga'),
  62.4,
  104,
  1,
  1
);
INSERT INTO products (name, sku, category_id, cost_price, price, stock, store_id)
VALUES (
  'Placa Sub Mi 9 oled',
  'PLC-0032',
  (SELECT id FROM categories WHERE name = 'Placas de Carga'),
  144.3,
  240.5,
  9,
  2
);
INSERT INTO products (name, sku, category_id, cost_price, price, stock, store_id)
VALUES (
  'Placa Sub G6 plus',
  'PLC-0033',
  (SELECT id FROM categories WHERE name = 'Placas de Carga'),
  58.5,
  97.5,
  9,
  1
);
INSERT INTO products (name, sku, category_id, cost_price, price, stock, store_id)
VALUES (
  'Placa Sub Mi 9 oled com aro',
  'PLC-0034',
  (SELECT id FROM categories WHERE name = 'Placas de Carga'),
  187.2,
  312,
  5,
  2
);
INSERT INTO products (name, sku, category_id, cost_price, price, stock, store_id)
VALUES (
  'Placa Sub G6 plus com aro (Premium)',
  'PLC-0035',
  (SELECT id FROM categories WHERE name = 'Placas de Carga'),
  105.3,
  175.5,
  8,
  1
);
INSERT INTO products (name, sku, category_id, cost_price, price, stock, store_id)
VALUES (
  'Placa Sub Mi 9 incell',
  'PLC-0036',
  (SELECT id FROM categories WHERE name = 'Placas de Carga'),
  78,
  130,
  10,
  2
);
INSERT INTO products (name, sku, category_id, cost_price, price, stock, store_id)
VALUES (
  'Placa Sub G7/g7 plus',
  'PLC-0037',
  (SELECT id FROM categories WHERE name = 'Placas de Carga'),
  66.3,
  110.5,
  6,
  1
);
INSERT INTO products (name, sku, category_id, cost_price, price, stock, store_id)
VALUES (
  'Placa Sub Mi 9 se incell',
  'PLC-0038',
  (SELECT id FROM categories WHERE name = 'Placas de Carga'),
  101.4,
  169,
  3,
  2
);
INSERT INTO products (name, sku, category_id, cost_price, price, stock, store_id)
VALUES (
  'Placa Sub G7 play',
  'PLC-0039',
  (SELECT id FROM categories WHERE name = 'Placas de Carga'),
  50.7,
  84.5,
  7,
  1
);
INSERT INTO products (name, sku, category_id, cost_price, price, stock, store_id)
VALUES (
  'Placa Sub Mi 9 lite incell',
  'PLC-0040',
  (SELECT id FROM categories WHERE name = 'Placas de Carga'),
  78,
  130,
  7,
  2
);
INSERT INTO products (name, sku, category_id, cost_price, price, stock, store_id)
VALUES (
  'Placa Sub G7 play com aro',
  'PLC-0041',
  (SELECT id FROM categories WHERE name = 'Placas de Carga'),
  74.1,
  123.5,
  1,
  1
);
INSERT INTO products (name, sku, category_id, cost_price, price, stock, store_id)
VALUES (
  'Placa Sub Mi 9 lite oled',
  'PLC-0042',
  (SELECT id FROM categories WHERE name = 'Placas de Carga'),
  124.8,
  208,
  2,
  2
);
INSERT INTO products (name, sku, category_id, cost_price, price, stock, store_id)
VALUES (
  'Placa Sub G7 power',
  'PLC-0043',
  (SELECT id FROM categories WHERE name = 'Placas de Carga'),
  58.5,
  97.5,
  6,
  1
);
INSERT INTO products (name, sku, category_id, cost_price, price, stock, store_id)
VALUES (
  'Placa Sub Mi 9t incell',
  'PLC-0044',
  (SELECT id FROM categories WHERE name = 'Placas de Carga'),
  70.2,
  117,
  7,
  2
);
INSERT INTO products (name, sku, category_id, cost_price, price, stock, store_id)
VALUES (
  'Placa Sub G7 power com aro',
  'PLC-0045',
  (SELECT id FROM categories WHERE name = 'Placas de Carga'),
  78,
  130,
  7,
  1
);
INSERT INTO products (name, sku, category_id, cost_price, price, stock, store_id)
VALUES (
  'Placa Sub Mi 9t oled',
  'PLC-0046',
  (SELECT id FROM categories WHERE name = 'Placas de Carga'),
  206.7,
  344.5,
  9,
  2
);
INSERT INTO products (name, sku, category_id, cost_price, price, stock, store_id)
VALUES (
  'Placa Sub G8 play/One Macro',
  'PLC-0047',
  (SELECT id FROM categories WHERE name = 'Placas de Carga'),
  46.8,
  78,
  5,
  1
);
INSERT INTO products (name, sku, category_id, cost_price, price, stock, store_id)
VALUES (
  'Placa Sub Mi 9t oled com aro',
  'PLC-0048',
  (SELECT id FROM categories WHERE name = 'Placas de Carga'),
  234,
  390,
  5,
  2
);
INSERT INTO products (name, sku, category_id, cost_price, price, stock, store_id)
VALUES (
  'Placa Sub G8 play/One Macro com aro',
  'PLC-0049',
  (SELECT id FROM categories WHERE name = 'Placas de Carga'),
  81.9,
  136.5,
  6,
  1
);
INSERT INTO products (name, sku, category_id, cost_price, price, stock, store_id)
VALUES (
  'Placa Sub Mi 9t oled com aro (Premium)',
  'PLC-0050',
  (SELECT id FROM categories WHERE name = 'Placas de Carga'),
  249.6,
  416,
  6,
  2
);
INSERT INTO products (name, sku, category_id, cost_price, price, stock, store_id)
VALUES (
  'Placa Sub G8 play / one macro com aro (Premium)',
  'PLC-0051',
  (SELECT id FROM categories WHERE name = 'Placas de Carga'),
  101.4,
  169,
  5,
  1
);
INSERT INTO products (name, sku, category_id, cost_price, price, stock, store_id)
VALUES (
  'Placa Sub Mi 10 lite incell',
  'PLC-0052',
  (SELECT id FROM categories WHERE name = 'Placas de Carga'),
  89.7,
  149.5,
  2,
  2
);
INSERT INTO products (name, sku, category_id, cost_price, price, stock, store_id)
VALUES (
  'Placa Sub G8 plus',
  'PLC-0053',
  (SELECT id FROM categories WHERE name = 'Placas de Carga'),
  66.3,
  110.5,
  5,
  1
);
INSERT INTO products (name, sku, category_id, cost_price, price, stock, store_id)
VALUES (
  'Placa Sub Mi 10 lite oled',
  'PLC-0054',
  (SELECT id FROM categories WHERE name = 'Placas de Carga'),
  273,
  455,
  8,
  2
);
INSERT INTO products (name, sku, category_id, cost_price, price, stock, store_id)
VALUES (
  'Placa Sub G8 plus com aro',
  'PLC-0055',
  (SELECT id FROM categories WHERE name = 'Placas de Carga'),
  81.9,
  136.5,
  9,
  1
);
INSERT INTO products (name, sku, category_id, cost_price, price, stock, store_id)
VALUES (
  'Placa Sub Mi note 10 pró/ mi note 10 lite oled',
  'PLC-0056',
  (SELECT id FROM categories WHERE name = 'Placas de Carga'),
  276.9,
  461.5,
  2,
  2
);
INSERT INTO products (name, sku, category_id, cost_price, price, stock, store_id)
VALUES (
  'Placa Sub G8 power',
  'PLC-0057',
  (SELECT id FROM categories WHERE name = 'Placas de Carga'),
  66.3,
  110.5,
  3,
  1
);
INSERT INTO products (name, sku, category_id, cost_price, price, stock, store_id)
VALUES (
  'Placa Sub Mi 10T',
  'PLC-0058',
  (SELECT id FROM categories WHERE name = 'Placas de Carga'),
  105.3,
  175.5,
  3,
  2
);
INSERT INTO products (name, sku, category_id, cost_price, price, stock, store_id)
VALUES (
  'Placa Sub G8 power com aro',
  'PLC-0059',
  (SELECT id FROM categories WHERE name = 'Placas de Carga'),
  97.5,
  162.5,
  1,
  1
);
INSERT INTO products (name, sku, category_id, cost_price, price, stock, store_id)
VALUES (
  'Placa Sub Mi 11 lite incell',
  'PLC-0060',
  (SELECT id FROM categories WHERE name = 'Placas de Carga'),
  93.6,
  156,
  7,
  2
);
INSERT INTO products (name, sku, category_id, cost_price, price, stock, store_id)
VALUES (
  'Placa Sub G8 power lite',
  'PLC-0061',
  (SELECT id FROM categories WHERE name = 'Placas de Carga'),
  54.6,
  91,
  5,
  1
);
INSERT INTO products (name, sku, category_id, cost_price, price, stock, store_id)
VALUES (
  'Placa Sub Mi 11 lite oled',
  'PLC-0062',
  (SELECT id FROM categories WHERE name = 'Placas de Carga'),
  265.2,
  442,
  6,
  2
);
INSERT INTO products (name, sku, category_id, cost_price, price, stock, store_id)
VALUES (
  'Placa Sub G8 power lite com aro',
  'PLC-0063',
  (SELECT id FROM categories WHERE name = 'Placas de Carga'),
  70.2,
  117,
  8,
  1
);
INSERT INTO products (name, sku, category_id, cost_price, price, stock, store_id)
VALUES (
  'Placa Sub Mi 12 lite oled',
  'PLC-0064',
  (SELECT id FROM categories WHERE name = 'Placas de Carga'),
  183.3,
  305.5,
  10,
  2
);
INSERT INTO products (name, sku, category_id, cost_price, price, stock, store_id)
VALUES (
  'Placa Sub G8',
  'PLC-0065',
  (SELECT id FROM categories WHERE name = 'Placas de Carga'),
  58.5,
  97.5,
  5,
  1
);
INSERT INTO products (name, sku, category_id, cost_price, price, stock, store_id)
VALUES (
  'Placa Sub Mi 13 lite oled',
  'PLC-0066',
  (SELECT id FROM categories WHERE name = 'Placas de Carga'),
  390,
  650,
  3,
  2
);
INSERT INTO products (name, sku, category_id, cost_price, price, stock, store_id)
VALUES (
  'Placa Sub G8 com aro',
  'PLC-0067',
  (SELECT id FROM categories WHERE name = 'Placas de Carga'),
  74.1,
  123.5,
  6,
  1
);
INSERT INTO products (name, sku, category_id, cost_price, price, stock, store_id)
VALUES (
  'Placa Sub Redmi S2',
  'PLC-0068',
  (SELECT id FROM categories WHERE name = 'Placas de Carga'),
  62.4,
  104,
  3,
  2
);
INSERT INTO products (name, sku, category_id, cost_price, price, stock, store_id)
VALUES (
  'Placa Sub G9',
  'PLC-0069',
  (SELECT id FROM categories WHERE name = 'Placas de Carga'),
  117,
  195,
  1,
  1
);
INSERT INTO products (name, sku, category_id, cost_price, price, stock, store_id)
VALUES (
  'Placa Sub Redmi a1 / Redmi A1 plus/ Redmi a2/ Poco C50',
  'PLC-0070',
  (SELECT id FROM categories WHERE name = 'Placas de Carga'),
  70.2,
  117,
  4,
  2
);
INSERT INTO products (name, sku, category_id, cost_price, price, stock, store_id)
VALUES (
  'Placa Sub G9 play/ E7 plus',
  'PLC-0071',
  (SELECT id FROM categories WHERE name = 'Placas de Carga'),
  46.8,
  78,
  1,
  1
);
INSERT INTO products (name, sku, category_id, cost_price, price, stock, store_id)
VALUES (
  'Placa Sub Redmi a1 / Redmi A1 plus/ Redmi a2/ Poco C50 com aro',
  'PLC-0072',
  (SELECT id FROM categories WHERE name = 'Placas de Carga'),
  78,
  130,
  2,
  2
);
INSERT INTO products (name, sku, category_id, cost_price, price, stock, store_id)
VALUES (
  'Placa Sub G9 play/E7 plus com aro',
  'PLC-0073',
  (SELECT id FROM categories WHERE name = 'Placas de Carga'),
  70.2,
  117,
  2,
  1
);
INSERT INTO products (name, sku, category_id, cost_price, price, stock, store_id)
VALUES (
  'Placa Sub Redmi a1/ Redmi a1 plus/ Redmi a2/ Poco c50 com aro (Premium)',
  'PLC-0074',
  (SELECT id FROM categories WHERE name = 'Placas de Carga'),
  101.4,
  169,
  9,
  2
);
INSERT INTO products (name, sku, category_id, cost_price, price, stock, store_id)
VALUES (
  'Placa Sub G9 play / e7 plus com aro (Premium)',
  'PLC-0075',
  (SELECT id FROM categories WHERE name = 'Placas de Carga'),
  85.8,
  143,
  2,
  1
);
INSERT INTO products (name, sku, category_id, cost_price, price, stock, store_id)
VALUES (
  'Placa Sub Redmi a3',
  'PLC-0076',
  (SELECT id FROM categories WHERE name = 'Placas de Carga'),
  54.6,
  91,
  6,
  2
);
INSERT INTO products (name, sku, category_id, cost_price, price, stock, store_id)
VALUES (
  'Placa Sub G9 plus',
  'PLC-0077',
  (SELECT id FROM categories WHERE name = 'Placas de Carga'),
  81.9,
  136.5,
  4,
  1
);
INSERT INTO products (name, sku, category_id, cost_price, price, stock, store_id)
VALUES (
  'Placa Sub Redmi a3 com aro',
  'PLC-0078',
  (SELECT id FROM categories WHERE name = 'Placas de Carga'),
  85.8,
  143,
  3,
  2
);
INSERT INTO products (name, sku, category_id, cost_price, price, stock, store_id)
VALUES (
  'Placa Sub G9 plus com aro',
  'PLC-0079',
  (SELECT id FROM categories WHERE name = 'Placas de Carga'),
  97.5,
  162.5,
  9,
  1
);
INSERT INTO products (name, sku, category_id, cost_price, price, stock, store_id)
VALUES (
  'Placa Sub Redmi a5',
  'PLC-0080',
  (SELECT id FROM categories WHERE name = 'Placas de Carga'),
  70.2,
  117,
  7,
  2
);
INSERT INTO products (name, sku, category_id, cost_price, price, stock, store_id)
VALUES (
  'Placa Sub G9 power',
  'PLC-0081',
  (SELECT id FROM categories WHERE name = 'Placas de Carga'),
  70.2,
  117,
  9,
  1
);
INSERT INTO products (name, sku, category_id, cost_price, price, stock, store_id)
VALUES (
  'Placa Sub Redmi 5 plus',
  'PLC-0082',
  (SELECT id FROM categories WHERE name = 'Placas de Carga'),
  70.2,
  117,
  8,
  2
);
INSERT INTO products (name, sku, category_id, cost_price, price, stock, store_id)
VALUES (
  'Placa Sub G9 power com aro',
  'PLC-0083',
  (SELECT id FROM categories WHERE name = 'Placas de Carga'),
  101.4,
  169,
  9,
  1
);
INSERT INTO products (name, sku, category_id, cost_price, price, stock, store_id)
VALUES (
  'Placa Sub Redmi 6 / Redmi 6a',
  'PLC-0084',
  (SELECT id FROM categories WHERE name = 'Placas de Carga'),
  46.8,
  78,
  10,
  2
);
INSERT INTO products (name, sku, category_id, cost_price, price, stock, store_id)
VALUES (
  'Placa Sub G10/G20/G30',
  'PLC-0085',
  (SELECT id FROM categories WHERE name = 'Placas de Carga'),
  46.8,
  78,
  7,
  1
);
INSERT INTO products (name, sku, category_id, cost_price, price, stock, store_id)
VALUES (
  'Placa Sub Redmi 7',
  'PLC-0086',
  (SELECT id FROM categories WHERE name = 'Placas de Carga'),
  62.4,
  104,
  4,
  2
);
INSERT INTO products (name, sku, category_id, cost_price, price, stock, store_id)
VALUES (
  'Placa Sub G10/G20/G30 com aro',
  'PLC-0087',
  (SELECT id FROM categories WHERE name = 'Placas de Carga'),
  58.5,
  97.5,
  10,
  1
);
INSERT INTO products (name, sku, category_id, cost_price, price, stock, store_id)
VALUES (
  'Placa Sub Redmi 7a',
  'PLC-0088',
  (SELECT id FROM categories WHERE name = 'Placas de Carga'),
  54.6,
  91,
  8,
  2
);
INSERT INTO products (name, sku, category_id, cost_price, price, stock, store_id)
VALUES (
  'Placa Sub G10/G20/G30 com aro (Premium)',
  'PLC-0089',
  (SELECT id FROM categories WHERE name = 'Placas de Carga'),
  89.7,
  149.5,
  6,
  1
);
INSERT INTO products (name, sku, category_id, cost_price, price, stock, store_id)
VALUES (
  'Placa Sub Redmi 7a com aro (Premium)',
  'PLC-0090',
  (SELECT id FROM categories WHERE name = 'Placas de Carga'),
  85.8,
  143,
  8,
  2
);
INSERT INTO products (name, sku, category_id, cost_price, price, stock, store_id)
VALUES (
  'Placa Sub G13/G23/G34/G53',
  'PLC-0091',
  (SELECT id FROM categories WHERE name = 'Placas de Carga'),
  66.3,
  110.5,
  1,
  1
);
INSERT INTO products (name, sku, category_id, cost_price, price, stock, store_id)
VALUES (
  'Placa Sub Redmi 8/ Redmi 8a',
  'PLC-0092',
  (SELECT id FROM categories WHERE name = 'Placas de Carga'),
  58.5,
  97.5,
  5,
  2
);
INSERT INTO products (name, sku, category_id, cost_price, price, stock, store_id)
VALUES (
  'Placa Sub G13 com aro',
  'PLC-0093',
  (SELECT id FROM categories WHERE name = 'Placas de Carga'),
  93.6,
  156,
  6,
  1
);
INSERT INTO products (name, sku, category_id, cost_price, price, stock, store_id)
VALUES (
  'Placa Sub Redmi 8 / Redmi 8a com aro (Premium)',
  'PLC-0094',
  (SELECT id FROM categories WHERE name = 'Placas de Carga'),
  74.1,
  123.5,
  10,
  2
);
INSERT INTO products (name, sku, category_id, cost_price, price, stock, store_id)
VALUES (
  'Placa Sub G13 com aro (Premium)',
  'PLC-0095',
  (SELECT id FROM categories WHERE name = 'Placas de Carga'),
  93.6,
  156,
  1,
  1
);
INSERT INTO products (name, sku, category_id, cost_price, price, stock, store_id)
VALUES (
  'Placa Sub Redmi 9',
  'PLC-0096',
  (SELECT id FROM categories WHERE name = 'Placas de Carga'),
  58.5,
  97.5,
  6,
  2
);
INSERT INTO products (name, sku, category_id, cost_price, price, stock, store_id)
VALUES (
  'Placa Sub G14/ G54',
  'PLC-0097',
  (SELECT id FROM categories WHERE name = 'Placas de Carga'),
  62.4,
  104,
  8,
  1
);
INSERT INTO products (name, sku, category_id, cost_price, price, stock, store_id)
VALUES (
  'Placa Sub Redmi 9 com aro',
  'PLC-0098',
  (SELECT id FROM categories WHERE name = 'Placas de Carga'),
  70.2,
  117,
  9,
  2
);
INSERT INTO products (name, sku, category_id, cost_price, price, stock, store_id)
VALUES (
  'Placa Sub G14 com aro (Premium)',
  'PLC-0099',
  (SELECT id FROM categories WHERE name = 'Placas de Carga'),
  132.6,
  221,
  1,
  1
);
INSERT INTO products (name, sku, category_id, cost_price, price, stock, store_id)
VALUES (
  'Placa Sub Redmi 9a/ 9c/ 9i/ 10a/ Poco c3',
  'PLC-0100',
  (SELECT id FROM categories WHERE name = 'Placas de Carga'),
  50.7,
  84.5,
  2,
  2
);
INSERT INTO products (name, sku, category_id, cost_price, price, stock, store_id)
VALUES (
  'Placa Sub G15 / G05',
  'PLC-0101',
  (SELECT id FROM categories WHERE name = 'Placas de Carga'),
  81.9,
  136.5,
  4,
  1
);
INSERT INTO products (name, sku, category_id, cost_price, price, stock, store_id)
VALUES (
  'Placa Sub Redmi 9a/ 9c/ 9i/ 10a/ Poco C3 com aro',
  'PLC-0102',
  (SELECT id FROM categories WHERE name = 'Placas de Carga'),
  70.2,
  117,
  7,
  2
);
INSERT INTO products (name, sku, category_id, cost_price, price, stock, store_id)
VALUES (
  'Placa Sub G15 com aro',
  'PLC-0103',
  (SELECT id FROM categories WHERE name = 'Placas de Carga'),
  136.5,
  227.5,
  5,
  1
);
INSERT INTO products (name, sku, category_id, cost_price, price, stock, store_id)
VALUES (
  'Placa Sub Redmi 9a/ 9c/ 9i/ 10a/ Poco C3 com aro (Premium)',
  'PLC-0104',
  (SELECT id FROM categories WHERE name = 'Placas de Carga'),
  85.8,
  143,
  1,
  2
);
INSERT INTO products (name, sku, category_id, cost_price, price, stock, store_id)
VALUES (
  'Placa Sub G22/ E32',
  'PLC-0105',
  (SELECT id FROM categories WHERE name = 'Placas de Carga'),
  54.6,
  91,
  5,
  1
);
INSERT INTO products (name, sku, category_id, cost_price, price, stock, store_id)
VALUES (
  'Placa Sub Redmi 9t / poco m3',
  'PLC-0106',
  (SELECT id FROM categories WHERE name = 'Placas de Carga'),
  54.6,
  91,
  4,
  2
);
INSERT INTO products (name, sku, category_id, cost_price, price, stock, store_id)
VALUES (
  'Placa Sub G22 com aro',
  'PLC-0107',
  (SELECT id FROM categories WHERE name = 'Placas de Carga'),
  66.3,
  110.5,
  1,
  1
);
INSERT INTO products (name, sku, category_id, cost_price, price, stock, store_id)
VALUES (
  'Placa Sub Redmi 9t/ poco m3 com aro',
  'PLC-0108',
  (SELECT id FROM categories WHERE name = 'Placas de Carga'),
  74.1,
  123.5,
  10,
  2
);
INSERT INTO products (name, sku, category_id, cost_price, price, stock, store_id)
VALUES (
  'Placa Sub G22 com aro (Premium)',
  'PLC-0109',
  (SELECT id FROM categories WHERE name = 'Placas de Carga'),
  81.9,
  136.5,
  5,
  1
);
INSERT INTO products (name, sku, category_id, cost_price, price, stock, store_id)
VALUES (
  'Placa Sub Redmi 9t/ poco m3 com aro (Premium)',
  'PLC-0110',
  (SELECT id FROM categories WHERE name = 'Placas de Carga'),
  78,
  130,
  8,
  2
);
INSERT INTO products (name, sku, category_id, cost_price, price, stock, store_id)
VALUES (
  'Placa Sub Redmi 10/ Redmi 10 prime',
  'PLC-0111',
  (SELECT id FROM categories WHERE name = 'Placas de Carga'),
  66.3,
  110.5,
  4,
  1
);
INSERT INTO products (name, sku, category_id, cost_price, price, stock, store_id)
VALUES (
  'Placa Sub G23 com aro  (premium)',
  'PLC-0112',
  (SELECT id FROM categories WHERE name = 'Placas de Carga'),
  101.4,
  169,
  5,
  2
);
INSERT INTO products (name, sku, category_id, cost_price, price, stock, store_id)
VALUES (
  'Placa Sub Redmi 10 5g com aro (Premium)',
  'PLC-0113',
  (SELECT id FROM categories WHERE name = 'Placas de Carga'),
  140.4,
  234,
  2,
  1
);
INSERT INTO products (name, sku, category_id, cost_price, price, stock, store_id)
VALUES (
  'Placa Sub G24/ G04',
  'PLC-0114',
  (SELECT id FROM categories WHERE name = 'Placas de Carga'),
  54.6,
  91,
  2,
  2
);
INSERT INTO products (name, sku, category_id, cost_price, price, stock, store_id)
VALUES (
  'Placa Sub Redmi 10c / 12c / Poco c40 / Poco c55',
  'PLC-0115',
  (SELECT id FROM categories WHERE name = 'Placas de Carga'),
  54.6,
  91,
  9,
  1
);
INSERT INTO products (name, sku, category_id, cost_price, price, stock, store_id)
VALUES (
  'Placa Sub G24 com aro',
  'PLC-0116',
  (SELECT id FROM categories WHERE name = 'Placas de Carga'),
  66.3,
  110.5,
  4,
  2
);
INSERT INTO products (name, sku, category_id, cost_price, price, stock, store_id)
VALUES (
  'Placa Sub Redmi 10c / Poco c40 com aro',
  'PLC-0117',
  (SELECT id FROM categories WHERE name = 'Placas de Carga'),
  66.3,
  110.5,
  6,
  1
);
INSERT INTO products (name, sku, category_id, cost_price, price, stock, store_id)
VALUES (
  'Placa Sub G24 com aro (Premium)',
  'PLC-0118',
  (SELECT id FROM categories WHERE name = 'Placas de Carga'),
  109.2,
  182,
  6,
  2
);
INSERT INTO products (name, sku, category_id, cost_price, price, stock, store_id)
VALUES (
  'Placa Sub Redmi 10c/ Poco c40 com aro (Premium)',
  'PLC-0119',
  (SELECT id FROM categories WHERE name = 'Placas de Carga'),
  89.7,
  149.5,
  10,
  1
);
INSERT INTO products (name, sku, category_id, cost_price, price, stock, store_id)
VALUES (
  'Placa Sub G10 play',
  'PLC-0120',
  (SELECT id FROM categories WHERE name = 'Placas de Carga'),
  101.4,
  169,
  7,
  2
);
INSERT INTO products (name, sku, category_id, cost_price, price, stock, store_id)
VALUES (
  'Placa Sub Redmi 12 / Redmi 13 / Poco M6 pro 5g',
  'PLC-0121',
  (SELECT id FROM categories WHERE name = 'Placas de Carga'),
  74.1,
  123.5,
  6,
  1
);
INSERT INTO products (name, sku, category_id, cost_price, price, stock, store_id)
VALUES (
  'Placa Sub G31 / G41 / G71 incell',
  'PLC-0122',
  (SELECT id FROM categories WHERE name = 'Placas de Carga'),
  70.2,
  117,
  6,
  2
);
INSERT INTO products (name, sku, category_id, cost_price, price, stock, store_id)
VALUES (
  'Placa Sub Redmi 12/ Poco m6 pró 5g com aro',
  'PLC-0123',
  (SELECT id FROM categories WHERE name = 'Placas de Carga'),
  81.9,
  136.5,
  10,
  1
);
INSERT INTO products (name, sku, category_id, cost_price, price, stock, store_id)
VALUES (
  'Placa Sub G31 incell com aro',
  'PLC-0124',
  (SELECT id FROM categories WHERE name = 'Placas de Carga'),
  89.7,
  149.5,
  6,
  2
);
INSERT INTO products (name, sku, category_id, cost_price, price, stock, store_id)
VALUES (
  'Placa Sub Redmi 12 com aro / poco m6 pro 5g com aro (Premium)',
  'PLC-0125',
  (SELECT id FROM categories WHERE name = 'Placas de Carga'),
  109.2,
  182,
  3,
  1
);
INSERT INTO products (name, sku, category_id, cost_price, price, stock, store_id)
VALUES (
  'Placa Sub G31 oled com aro',
  'PLC-0126',
  (SELECT id FROM categories WHERE name = 'Placas de Carga'),
  175.5,
  292.5,
  3,
  2
);
INSERT INTO products (name, sku, category_id, cost_price, price, stock, store_id)
VALUES (
  'Placa Sub Redmi 12c / poco c55 com aro',
  'PLC-0127',
  (SELECT id FROM categories WHERE name = 'Placas de Carga'),
  70.2,
  117,
  7,
  1
);
INSERT INTO products (name, sku, category_id, cost_price, price, stock, store_id)
VALUES (
  'Placa Sub G31 oled com aro (Premium)',
  'PLC-0128',
  (SELECT id FROM categories WHERE name = 'Placas de Carga'),
  187.2,
  312,
  2,
  2
);
INSERT INTO products (name, sku, category_id, cost_price, price, stock, store_id)
VALUES (
  'Placa Sub Redmi 12c/ Poco C55 com aro (Premium)',
  'PLC-0129',
  (SELECT id FROM categories WHERE name = 'Placas de Carga'),
  93.6,
  156,
  6,
  1
);
INSERT INTO products (name, sku, category_id, cost_price, price, stock, store_id)
VALUES (
  'Placa Sub G32 / g73',
  'PLC-0130',
  (SELECT id FROM categories WHERE name = 'Placas de Carga'),
  66.3,
  110.5,
  4,
  2
);
INSERT INTO products (name, sku, category_id, cost_price, price, stock, store_id)
VALUES (
  'Placa Sub Redmi 13c/ Poco C65',
  'PLC-0131',
  (SELECT id FROM categories WHERE name = 'Placas de Carga'),
  58.5,
  97.5,
  10,
  1
);
INSERT INTO products (name, sku, category_id, cost_price, price, stock, store_id)
VALUES (
  'Placa Sub G32 com aro',
  'PLC-0132',
  (SELECT id FROM categories WHERE name = 'Placas de Carga'),
  85.8,
  143,
  1,
  2
);
INSERT INTO products (name, sku, category_id, cost_price, price, stock, store_id)
VALUES (
  'Placa Sub Redmi 13c / poco c65 com aro',
  'PLC-0133',
  (SELECT id FROM categories WHERE name = 'Placas de Carga'),
  70.2,
  117,
  2,
  1
);
INSERT INTO products (name, sku, category_id, cost_price, price, stock, store_id)
VALUES (
  'Placa Sub G32 com aro  (premium)',
  'PLC-0134',
  (SELECT id FROM categories WHERE name = 'Placas de Carga'),
  117,
  195,
  7,
  2
);
INSERT INTO products (name, sku, category_id, cost_price, price, stock, store_id)
VALUES (
  'Placa Sub Redmi 13c com aro (Premium)',
  'PLC-0135',
  (SELECT id FROM categories WHERE name = 'Placas de Carga'),
  97.5,
  162.5,
  2,
  1
);
INSERT INTO products (name, sku, category_id, cost_price, price, stock, store_id)
VALUES (
  'Placa Sub G34 com aro',
  'PLC-0136',
  (SELECT id FROM categories WHERE name = 'Placas de Carga'),
  89.7,
  149.5,
  8,
  2
);
INSERT INTO products (name, sku, category_id, cost_price, price, stock, store_id)
VALUES (
  'Placa Sub Redmi 14c / Poco c75',
  'PLC-0137',
  (SELECT id FROM categories WHERE name = 'Placas de Carga'),
  66.3,
  110.5,
  8,
  1
);
INSERT INTO products (name, sku, category_id, cost_price, price, stock, store_id)
VALUES (
  'Placa Sub G35 com aro',
  'PLC-0138',
  (SELECT id FROM categories WHERE name = 'Placas de Carga'),
  128.7,
  214.5,
  5,
  2
);
INSERT INTO products (name, sku, category_id, cost_price, price, stock, store_id)
VALUES (
  'Placa Sub Redmi 14c com aro',
  'PLC-0139',
  (SELECT id FROM categories WHERE name = 'Placas de Carga'),
  93.6,
  156,
  5,
  1
);
INSERT INTO products (name, sku, category_id, cost_price, price, stock, store_id)
VALUES (
  'Placa Sub G41 incell com aro',
  'PLC-0140',
  (SELECT id FROM categories WHERE name = 'Placas de Carga'),
  85.8,
  143,
  7,
  2
);
INSERT INTO products (name, sku, category_id, cost_price, price, stock, store_id)
VALUES (
  'Placa Sub Redmi note 4x',
  'PLC-0141',
  (SELECT id FROM categories WHERE name = 'Placas de Carga'),
  93.6,
  156,
  1,
  1
);
INSERT INTO products (name, sku, category_id, cost_price, price, stock, store_id)
VALUES (
  'Placa Sub G41 oled com aro',
  'PLC-0142',
  (SELECT id FROM categories WHERE name = 'Placas de Carga'),
  175.5,
  292.5,
  9,
  2
);
INSERT INTO products (name, sku, category_id, cost_price, price, stock, store_id)
VALUES (
  'Placa Sub Redmi note 5/ note 5 pró',
  'PLC-0143',
  (SELECT id FROM categories WHERE name = 'Placas de Carga'),
  54.6,
  91,
  2,
  1
);
INSERT INTO products (name, sku, category_id, cost_price, price, stock, store_id)
VALUES (
  'Placa Sub G41 oled com aro (Premium)',
  'PLC-0144',
  (SELECT id FROM categories WHERE name = 'Placas de Carga'),
  187.2,
  312,
  4,
  2
);
INSERT INTO products (name, sku, category_id, cost_price, price, stock, store_id)
VALUES (
  'Placa Sub Redmi note 6 pró',
  'PLC-0145',
  (SELECT id FROM categories WHERE name = 'Placas de Carga'),
  54.6,
  91,
  3,
  1
);
INSERT INTO products (name, sku, category_id, cost_price, price, stock, store_id)
VALUES (
  'Placa Sub G42 incell',
  'PLC-0146',
  (SELECT id FROM categories WHERE name = 'Placas de Carga'),
  81.9,
  136.5,
  9,
  2
);
INSERT INTO products (name, sku, category_id, cost_price, price, stock, store_id)
VALUES (
  'Placa Sub Redmi note 6 pró com aro (Premium)',
  'PLC-0147',
  (SELECT id FROM categories WHERE name = 'Placas de Carga'),
  85.8,
  143,
  4,
  1
);
INSERT INTO products (name, sku, category_id, cost_price, price, stock, store_id)
VALUES (
  'Placa Sub G42 incell com aro',
  'PLC-0148',
  (SELECT id FROM categories WHERE name = 'Placas de Carga'),
  85.8,
  143,
  4,
  2
);
INSERT INTO products (name, sku, category_id, cost_price, price, stock, store_id)
VALUES (
  'Placa Sub Redmi note 7',
  'PLC-0149',
  (SELECT id FROM categories WHERE name = 'Placas de Carga'),
  54.6,
  91,
  3,
  1
);
INSERT INTO products (name, sku, category_id, cost_price, price, stock, store_id)
VALUES (
  'Placa Sub G42 oled com aro',
  'PLC-0150',
  (SELECT id FROM categories WHERE name = 'Placas de Carga'),
  171.6,
  286,
  7,
  2
);
INSERT INTO products (name, sku, category_id, cost_price, price, stock, store_id)
VALUES (
  'Placa Sub Redmi note 7 com aro',
  'PLC-0151',
  (SELECT id FROM categories WHERE name = 'Placas de Carga'),
  78,
  130,
  6,
  1
);
INSERT INTO products (name, sku, category_id, cost_price, price, stock, store_id)
VALUES (
  'Placa Sub G42 oled com aro (premium)',
  'PLC-0152',
  (SELECT id FROM categories WHERE name = 'Placas de Carga'),
  179.4,
  299,
  3,
  2
);
INSERT INTO products (name, sku, category_id, cost_price, price, stock, store_id)
VALUES (
  'Placa Sub Redmi note 8',
  'PLC-0153',
  (SELECT id FROM categories WHERE name = 'Placas de Carga'),
  50.7,
  84.5,
  7,
  1
);
INSERT INTO products (name, sku, category_id, cost_price, price, stock, store_id)
VALUES (
  'Placa Sub G71 com aro',
  'PLC-0154',
  (SELECT id FROM categories WHERE name = 'Placas de Carga'),
  218.4,
  364,
  7,
  2
);
INSERT INTO products (name, sku, category_id, cost_price, price, stock, store_id)
VALUES (
  'Placa Sub Redmi note 8 com aro',
  'PLC-0155',
  (SELECT id FROM categories WHERE name = 'Placas de Carga'),
  78,
  130,
  8,
  1
);
INSERT INTO products (name, sku, category_id, cost_price, price, stock, store_id)
VALUES (
  'Placa Sub G50 4g',
  'PLC-0156',
  (SELECT id FROM categories WHERE name = 'Placas de Carga'),
  105.3,
  175.5,
  10,
  2
);
INSERT INTO products (name, sku, category_id, cost_price, price, stock, store_id)
VALUES (
  'Placa Sub Redmi note 8 com aro (Premium)',
  'PLC-0157',
  (SELECT id FROM categories WHERE name = 'Placas de Carga'),
  105.3,
  175.5,
  7,
  1
);
INSERT INTO products (name, sku, category_id, cost_price, price, stock, store_id)
VALUES (
  'Placa Sub G50 4g com aro original',
  'PLC-0158',
  (SELECT id FROM categories WHERE name = 'Placas de Carga'),
  187.2,
  312,
  6,
  2
);
INSERT INTO products (name, sku, category_id, cost_price, price, stock, store_id)
VALUES (
  'Placa Sub Redmi Note 8t',
  'PLC-0159',
  (SELECT id FROM categories WHERE name = 'Placas de Carga'),
  70.2,
  117,
  3,
  1
);
INSERT INTO products (name, sku, category_id, cost_price, price, stock, store_id)
VALUES (
  'Placa Sub G50 5g',
  'PLC-0160',
  (SELECT id FROM categories WHERE name = 'Placas de Carga'),
  58.5,
  97.5,
  4,
  2
);
INSERT INTO products (name, sku, category_id, cost_price, price, stock, store_id)
VALUES (
  'Placa Sub Redmi note 8T com aro',
  'PLC-0161',
  (SELECT id FROM categories WHERE name = 'Placas de Carga'),
  81.9,
  136.5,
  3,
  1
);
INSERT INTO products (name, sku, category_id, cost_price, price, stock, store_id)
VALUES (
  'Placa Sub G50 5g com aro',
  'PLC-0162',
  (SELECT id FROM categories WHERE name = 'Placas de Carga'),
  85.8,
  143,
  4,
  2
);
INSERT INTO products (name, sku, category_id, cost_price, price, stock, store_id)
VALUES (
  'Placa Sub Redmi note 8 pró',
  'PLC-0163',
  (SELECT id FROM categories WHERE name = 'Placas de Carga'),
  58.5,
  97.5,
  2,
  1
);
INSERT INTO products (name, sku, category_id, cost_price, price, stock, store_id)
VALUES (
  'Placa Sub G52 5g / g82 5g / edge 30 oled',
  'PLC-0164',
  (SELECT id FROM categories WHERE name = 'Placas de Carga'),
  210.6,
  351,
  4,
  2
);
INSERT INTO products (name, sku, category_id, cost_price, price, stock, store_id)
VALUES (
  'Placa Sub Redmi note 8 pro com aro',
  'PLC-0165',
  (SELECT id FROM categories WHERE name = 'Placas de Carga'),
  81.9,
  136.5,
  7,
  1
);
INSERT INTO products (name, sku, category_id, cost_price, price, stock, store_id)
VALUES (
  'Placa Sub G52 5G/ G82 5G oled com aro (premium)',
  'PLC-0166',
  (SELECT id FROM categories WHERE name = 'Placas de Carga'),
  265.2,
  442,
  1,
  2
);
INSERT INTO products (name, sku, category_id, cost_price, price, stock, store_id)
VALUES (
  'Placa Sub Redmi note 8 pro com aro (Premium)',
  'PLC-0167',
  (SELECT id FROM categories WHERE name = 'Placas de Carga'),
  97.5,
  162.5,
  9,
  1
);
INSERT INTO products (name, sku, category_id, cost_price, price, stock, store_id)
VALUES (
  'Placa Sub G52 5g / G82 5g/ Edge 30 incell',
  'PLC-0168',
  (SELECT id FROM categories WHERE name = 'Placas de Carga'),
  70.2,
  117,
  6,
  2
);
INSERT INTO products (name, sku, category_id, cost_price, price, stock, store_id)
VALUES (
  'Placa Sub Redmi note 9',
  'PLC-0169',
  (SELECT id FROM categories WHERE name = 'Placas de Carga'),
  58.5,
  97.5,
  1,
  1
);
INSERT INTO products (name, sku, category_id, cost_price, price, stock, store_id)
VALUES (
  'Placa Sub G52 5g/ G82 5g incell com aro',
  'PLC-0170',
  (SELECT id FROM categories WHERE name = 'Placas de Carga'),
  78,
  130,
  4,
  2
);
INSERT INTO products (name, sku, category_id, cost_price, price, stock, store_id)
VALUES (
  'Placa Sub Redmi note 9 com aro',
  'PLC-0171',
  (SELECT id FROM categories WHERE name = 'Placas de Carga'),
  74.1,
  123.5,
  10,
  1
);
INSERT INTO products (name, sku, category_id, cost_price, price, stock, store_id)
VALUES (
  'Placa Sub G53 5g com aro',
  'PLC-0172',
  (SELECT id FROM categories WHERE name = 'Placas de Carga'),
  81.9,
  136.5,
  4,
  2
);
INSERT INTO products (name, sku, category_id, cost_price, price, stock, store_id)
VALUES (
  'Placa Sub Redmi note 9 com aro (Premium)',
  'PLC-0173',
  (SELECT id FROM categories WHERE name = 'Placas de Carga'),
  81.9,
  136.5,
  7,
  1
);
INSERT INTO products (name, sku, category_id, cost_price, price, stock, store_id)
VALUES (
  'Placa Sub G53 5g com aro (Premium)',
  'PLC-0174',
  (SELECT id FROM categories WHERE name = 'Placas de Carga'),
  97.5,
  162.5,
  3,
  2
);
INSERT INTO products (name, sku, category_id, cost_price, price, stock, store_id)
VALUES (
  'Placa Sub Redmi note 9 pró/ note 9s',
  'PLC-0175',
  (SELECT id FROM categories WHERE name = 'Placas de Carga'),
  54.6,
  91,
  1,
  1
);
INSERT INTO products (name, sku, category_id, cost_price, price, stock, store_id)
VALUES (
  'Placa Sub G54 com aro',
  'PLC-0176',
  (SELECT id FROM categories WHERE name = 'Placas de Carga'),
  81.9,
  136.5,
  2,
  2
);
INSERT INTO products (name, sku, category_id, cost_price, price, stock, store_id)
VALUES (
  'Placa Sub Redmi note 9 pró/ note 9s  com aro',
  'PLC-0177',
  (SELECT id FROM categories WHERE name = 'Placas de Carga'),
  70.2,
  117,
  5,
  1
);
INSERT INTO products (name, sku, category_id, cost_price, price, stock, store_id)
VALUES (
  'Placa Sub G54 com aro (Premium)',
  'PLC-0178',
  (SELECT id FROM categories WHERE name = 'Placas de Carga'),
  136.5,
  227.5,
  7,
  2
);
INSERT INTO products (name, sku, category_id, cost_price, price, stock, store_id)
VALUES (
  'Placa Sub Redmi note 9t',
  'PLC-0179',
  (SELECT id FROM categories WHERE name = 'Placas de Carga'),
  93.6,
  156,
  3,
  1
);
INSERT INTO products (name, sku, category_id, cost_price, price, stock, store_id)
VALUES (
  'Placa Sub G55',
  'PLC-0180',
  (SELECT id FROM categories WHERE name = 'Placas de Carga'),
  89.7,
  149.5,
  4,
  2
);
INSERT INTO products (name, sku, category_id, cost_price, price, stock, store_id)
VALUES (
  'Placa Sub Redmi note 10 4g/10s/ poco m5s incell',
  'PLC-0181',
  (SELECT id FROM categories WHERE name = 'Placas de Carga'),
  58.5,
  97.5,
  2,
  1
);
INSERT INTO products (name, sku, category_id, cost_price, price, stock, store_id)
VALUES (
  'Placa Sub G60/G60s',
  'PLC-0182',
  (SELECT id FROM categories WHERE name = 'Placas de Carga'),
  66.3,
  110.5,
  9,
  2
);
INSERT INTO products (name, sku, category_id, cost_price, price, stock, store_id)
VALUES (
  'Placa Sub Redmi note 10 4g/10s/ poco m5s incell com aro',
  'PLC-0183',
  (SELECT id FROM categories WHERE name = 'Placas de Carga'),
  70.2,
  117,
  4,
  1
);
INSERT INTO products (name, sku, category_id, cost_price, price, stock, store_id)
VALUES (
  'Placa Sub G60 com aro',
  'PLC-0184',
  (SELECT id FROM categories WHERE name = 'Placas de Carga'),
  81.9,
  136.5,
  9,
  2
);
INSERT INTO products (name, sku, category_id, cost_price, price, stock, store_id)
VALUES (
  'Placa Sub Redmi note 10 4g/10s/ poco m5s incell com aro (Premium)',
  'PLC-0185',
  (SELECT id FROM categories WHERE name = 'Placas de Carga'),
  93.6,
  156,
  2,
  1
);
INSERT INTO products (name, sku, category_id, cost_price, price, stock, store_id)
VALUES (
  'Placa Sub G60s com aro',
  'PLC-0186',
  (SELECT id FROM categories WHERE name = 'Placas de Carga'),
  85.8,
  143,
  3,
  2
);
INSERT INTO products (name, sku, category_id, cost_price, price, stock, store_id)
VALUES (
  'Placa Sub Redmi note 10 4g/ 10s/ poco m5s oled',
  'PLC-0187',
  (SELECT id FROM categories WHERE name = 'Placas de Carga'),
  128.7,
  214.5,
  9,
  1
);
INSERT INTO products (name, sku, category_id, cost_price, price, stock, store_id)
VALUES (
  'Placa Sub G62',
  'PLC-0188',
  (SELECT id FROM categories WHERE name = 'Placas de Carga'),
  85.8,
  143,
  10,
  2
);
INSERT INTO products (name, sku, category_id, cost_price, price, stock, store_id)
VALUES (
  'Placa Sub Redmi note 10 4g/10s/ poco m5s oled com aro',
  'PLC-0189',
  (SELECT id FROM categories WHERE name = 'Placas de Carga'),
  156,
  260,
  7,
  1
);
INSERT INTO products (name, sku, category_id, cost_price, price, stock, store_id)
VALUES (
  'Placa Sub G62 com aro',
  'PLC-0190',
  (SELECT id FROM categories WHERE name = 'Placas de Carga'),
  105.3,
  175.5,
  7,
  2
);
INSERT INTO products (name, sku, category_id, cost_price, price, stock, store_id)
VALUES (
  'Placa Sub Redmi note 10 4g/10s/ poco m5s oled com aro (premium)',
  'PLC-0191',
  (SELECT id FROM categories WHERE name = 'Placas de Carga'),
  171.6,
  286,
  1,
  1
);
INSERT INTO products (name, sku, category_id, cost_price, price, stock, store_id)
VALUES (
  'Placa Sub G62 com aro  (Premium)',
  'PLC-0192',
  (SELECT id FROM categories WHERE name = 'Placas de Carga'),
  120.9,
  201.5,
  3,
  2
);
INSERT INTO products (name, sku, category_id, cost_price, price, stock, store_id)
VALUES (
  'Placa Sub Redmi note 10 5g / Poco m3 pró 5g',
  'PLC-0193',
  (SELECT id FROM categories WHERE name = 'Placas de Carga'),
  66.3,
  110.5,
  8,
  1
);
INSERT INTO products (name, sku, category_id, cost_price, price, stock, store_id)
VALUES (
  'Placa Sub G64',
  'PLC-0194',
  (SELECT id FROM categories WHERE name = 'Placas de Carga'),
  89.7,
  149.5,
  7,
  2
);
INSERT INTO products (name, sku, category_id, cost_price, price, stock, store_id)
VALUES (
  'Placa Sub Redmi note 10 5g / poco m3 pró 5g com aro',
  'PLC-0195',
  (SELECT id FROM categories WHERE name = 'Placas de Carga'),
  78,
  130,
  3,
  1
);
INSERT INTO products (name, sku, category_id, cost_price, price, stock, store_id)
VALUES (
  'Placa Sub G71 oled com aro',
  'PLC-0196',
  (SELECT id FROM categories WHERE name = 'Placas de Carga'),
  175.5,
  292.5,
  3,
  2
);
INSERT INTO products (name, sku, category_id, cost_price, price, stock, store_id)
VALUES (
  'Placa Sub Redmi Note 10 5g / poco m3 pro 5g com aro (Premium)',
  'PLC-0197',
  (SELECT id FROM categories WHERE name = 'Placas de Carga'),
  101.4,
  169,
  4,
  1
);
INSERT INTO products (name, sku, category_id, cost_price, price, stock, store_id)
VALUES (
  'Placa Sub G71 oled com aro (Premium)',
  'PLC-0198',
  (SELECT id FROM categories WHERE name = 'Placas de Carga'),
  187.2,
  312,
  7,
  2
);
INSERT INTO products (name, sku, category_id, cost_price, price, stock, store_id)
VALUES (
  'Placa Sub Redmi Note 10 pro/ 10 pro Max/Note 11 pro/ Poco x4 pro incell',
  'PLC-0199',
  (SELECT id FROM categories WHERE name = 'Placas de Carga'),
  70.2,
  117,
  10,
  1
);
INSERT INTO products (name, sku, category_id, cost_price, price, stock, store_id)
VALUES (
  'Placa Sub G72 oled com aro',
  'PLC-0200',
  (SELECT id FROM categories WHERE name = 'Placas de Carga'),
  171.6,
  286,
  1,
  2
);
INSERT INTO products (name, sku, category_id, cost_price, price, stock, store_id)
VALUES (
  'Placa Sub Redmi note 10 pro/ 10 pro max incell com aro',
  'PLC-0201',
  (SELECT id FROM categories WHERE name = 'Placas de Carga'),
  78,
  130,
  5,
  1
);
INSERT INTO products (name, sku, category_id, cost_price, price, stock, store_id)
VALUES (
  'Placa Sub G73 com aro (Linha premium)',
  'PLC-0202',
  (SELECT id FROM categories WHERE name = 'Placas de Carga'),
  105.3,
  175.5,
  9,
  2
);
INSERT INTO products (name, sku, category_id, cost_price, price, stock, store_id)
VALUES (
  'Placa Sub Redmi note 10 pro/ 10 pro max incell com aro (Premium)',
  'PLC-0203',
  (SELECT id FROM categories WHERE name = 'Placas de Carga'),
  105.3,
  175.5,
  3,
  1
);
INSERT INTO products (name, sku, category_id, cost_price, price, stock, store_id)
VALUES (
  'Placa Sub G75',
  'PLC-0204',
  (SELECT id FROM categories WHERE name = 'Placas de Carga'),
  171.6,
  286,
  4,
  2
);
INSERT INTO products (name, sku, category_id, cost_price, price, stock, store_id)
VALUES (
  'Placa Sub Redmi Note 10 pro / 10 pro max/ Note 11 pro / Poco x4 pro oled',
  'PLC-0205',
  (SELECT id FROM categories WHERE name = 'Placas de Carga'),
  234,
  390,
  3,
  1
);
INSERT INTO products (name, sku, category_id, cost_price, price, stock, store_id)
VALUES (
  'Placa Sub G82 oled com aro (Premium)',
  'PLC-0206',
  (SELECT id FROM categories WHERE name = 'Placas de Carga'),
  261.3,
  435.5,
  10,
  2
);
INSERT INTO products (name, sku, category_id, cost_price, price, stock, store_id)
VALUES (
  'Placa Sub Redmi note 10 pro / 10 pro max oled com aro (Premium)',
  'PLC-0207',
  (SELECT id FROM categories WHERE name = 'Placas de Carga'),
  257.4,
  429,
  10,
  1
);
INSERT INTO products (name, sku, category_id, cost_price, price, stock, store_id)
VALUES (
  'Placa Sub G84 incell',
  'PLC-0208',
  (SELECT id FROM categories WHERE name = 'Placas de Carga'),
  101.4,
  169,
  5,
  2
);
INSERT INTO products (name, sku, category_id, cost_price, price, stock, store_id)
VALUES (
  'Placa Sub Redmi note 11 4g / note 11s / note 12s /poco m4 pro 4g incell',
  'PLC-0209',
  (SELECT id FROM categories WHERE name = 'Placas de Carga'),
  58.5,
  97.5,
  7,
  1
);
INSERT INTO products (name, sku, category_id, cost_price, price, stock, store_id)
VALUES (
  'Placa Sub G84 incell com aro',
  'PLC-0210',
  (SELECT id FROM categories WHERE name = 'Placas de Carga'),
  124.8,
  208,
  4,
  2
);
INSERT INTO products (name, sku, category_id, cost_price, price, stock, store_id)
VALUES (
  'Placa Sub Redmi note 11 4g incell com aro',
  'PLC-0211',
  (SELECT id FROM categories WHERE name = 'Placas de Carga'),
  78,
  130,
  10,
  1
);
INSERT INTO products (name, sku, category_id, cost_price, price, stock, store_id)
VALUES (
  'Placa Sub G84 oled com aro',
  'PLC-0212',
  (SELECT id FROM categories WHERE name = 'Placas de Carga'),
  241.8,
  403,
  8,
  2
);
INSERT INTO products (name, sku, category_id, cost_price, price, stock, store_id)
VALUES (
  'Placa Sub Redmi note 11 4g incell com aro  (Premium)',
  'PLC-0213',
  (SELECT id FROM categories WHERE name = 'Placas de Carga'),
  101.4,
  169,
  9,
  1
);
INSERT INTO products (name, sku, category_id, cost_price, price, stock, store_id)
VALUES (
  'Placa Sub G84 oled com aro  (Linha premium)',
  'PLC-0214',
  (SELECT id FROM categories WHERE name = 'Placas de Carga'),
  257.4,
  429,
  8,
  2
);
INSERT INTO products (name, sku, category_id, cost_price, price, stock, store_id)
VALUES (
  'Placa Sub Redmi Note 11 4g oled com aro',
  'PLC-0215',
  (SELECT id FROM categories WHERE name = 'Placas de Carga'),
  175.5,
  292.5,
  8,
  1
);
INSERT INTO products (name, sku, category_id, cost_price, price, stock, store_id)
VALUES (
  'Placa Sub Redmi note 11 4g oled com aro (Premium)',
  'PLC-0216',
  (SELECT id FROM categories WHERE name = 'Placas de Carga'),
  187.2,
  312,
  10,
  2
);
INSERT INTO products (name, sku, category_id, cost_price, price, stock, store_id)
VALUES (
  'Placa Sub Redmi note 11s/note 12s/poco m4 pro 4g Incell com aro',
  'PLC-0217',
  (SELECT id FROM categories WHERE name = 'Placas de Carga'),
  78,
  130,
  10,
  1
);
INSERT INTO products (name, sku, category_id, cost_price, price, stock, store_id)
VALUES (
  'Placa Sub G85 5g incell',
  'PLC-0218',
  (SELECT id FROM categories WHERE name = 'Placas de Carga'),
  175.5,
  292.5,
  8,
  2
);
INSERT INTO products (name, sku, category_id, cost_price, price, stock, store_id)
VALUES (
  'Placa Sub Redmi note 11s/note 12s/ poco m4 pro 4g incell com aro (Premium)',
  'PLC-0219',
  (SELECT id FROM categories WHERE name = 'Placas de Carga'),
  97.5,
  162.5,
  7,
  1
);
INSERT INTO products (name, sku, category_id, cost_price, price, stock, store_id)
VALUES (
  'Placa Sub G100 com aro',
  'PLC-0220',
  (SELECT id FROM categories WHERE name = 'Placas de Carga'),
  179.4,
  299,
  2,
  2
);
INSERT INTO products (name, sku, category_id, cost_price, price, stock, store_id)
VALUES (
  'Placa Sub Redmi note 11s / note 12s / poco m4 pro 4g oled com aro',
  'PLC-0221',
  (SELECT id FROM categories WHERE name = 'Placas de Carga'),
  179.4,
  299,
  6,
  1
);
INSERT INTO products (name, sku, category_id, cost_price, price, stock, store_id)
VALUES (
  'Placa Sub G200',
  'PLC-0222',
  (SELECT id FROM categories WHERE name = 'Placas de Carga'),
  101.4,
  169,
  7,
  2
);
INSERT INTO products (name, sku, category_id, cost_price, price, stock, store_id)
VALUES (
  'Placa Sub Redmi note 11s/note 12s/poco m4 pro 4g oled com aro (premium)',
  'PLC-0223',
  (SELECT id FROM categories WHERE name = 'Placas de Carga'),
  175.5,
  292.5,
  1,
  1
);
INSERT INTO products (name, sku, category_id, cost_price, price, stock, store_id)
VALUES (
  'Placa Sub G04 / G04s com aro',
  'PLC-0224',
  (SELECT id FROM categories WHERE name = 'Placas de Carga'),
  81.9,
  136.5,
  9,
  2
);
INSERT INTO products (name, sku, category_id, cost_price, price, stock, store_id)
VALUES (
  'Placa Sub Redmi note 11 5g',
  'PLC-0225',
  (SELECT id FROM categories WHERE name = 'Placas de Carga'),
  70.2,
  117,
  7,
  1
);
INSERT INTO products (name, sku, category_id, cost_price, price, stock, store_id)
VALUES (
  'Placa Sub G04 / G04s com aro (Premium)',
  'PLC-0226',
  (SELECT id FROM categories WHERE name = 'Placas de Carga'),
  101.4,
  169,
  6,
  2
);
INSERT INTO products (name, sku, category_id, cost_price, price, stock, store_id)
VALUES (
  'Placa Sub Redmi note 11 5g com aro (Premium)',
  'PLC-0227',
  (SELECT id FROM categories WHERE name = 'Placas de Carga'),
  113.1,
  188.5,
  5,
  1
);
INSERT INTO products (name, sku, category_id, cost_price, price, stock, store_id)
VALUES (
  'Placa Sub G05 com aro',
  'PLC-0228',
  (SELECT id FROM categories WHERE name = 'Placas de Carga'),
  117,
  195,
  9,
  2
);
INSERT INTO products (name, sku, category_id, cost_price, price, stock, store_id)
VALUES (
  'Placa Sub Redmi Note 11 pro/ Poco x4 pro incell com aro',
  'PLC-0229',
  (SELECT id FROM categories WHERE name = 'Placas de Carga'),
  81.9,
  136.5,
  3,
  1
);
INSERT INTO products (name, sku, category_id, cost_price, price, stock, store_id)
VALUES (
  'Placa Sub G Play 2021',
  'PLC-0230',
  (SELECT id FROM categories WHERE name = 'Placas de Carga'),
  132.6,
  221,
  10,
  2
);
INSERT INTO products (name, sku, category_id, cost_price, price, stock, store_id)
VALUES (
  'Placa Sub Redmi note 11 pro incell / poco x4 pro incell com aro (Premium)',
  'PLC-0231',
  (SELECT id FROM categories WHERE name = 'Placas de Carga'),
  85.8,
  143,
  2,
  1
);
INSERT INTO products (name, sku, category_id, cost_price, price, stock, store_id)
VALUES (
  'Placa Sub G Stylus',
  'PLC-0232',
  (SELECT id FROM categories WHERE name = 'Placas de Carga'),
  132.6,
  221,
  3,
  2
);
INSERT INTO products (name, sku, category_id, cost_price, price, stock, store_id)
VALUES (
  'Placa Sub Redmi note 11 pro/ Poco x4 pro oled com aro',
  'PLC-0233',
  (SELECT id FROM categories WHERE name = 'Placas de Carga'),
  195,
  325,
  6,
  1
);
INSERT INTO products (name, sku, category_id, cost_price, price, stock, store_id)
VALUES (
  'Placa Sub E4',
  'PLC-0234',
  (SELECT id FROM categories WHERE name = 'Placas de Carga'),
  54.6,
  91,
  4,
  2
);
INSERT INTO products (name, sku, category_id, cost_price, price, stock, store_id)
VALUES (
  'Placa Sub Redmi Note 11 pro / poco x4 pro oled com aro (Premium)',
  'PLC-0235',
  (SELECT id FROM categories WHERE name = 'Placas de Carga'),
  222.3,
  370.5,
  4,
  1
);
INSERT INTO products (name, sku, category_id, cost_price, price, stock, store_id)
VALUES (
  'Placa Sub E4 plus',
  'PLC-0236',
  (SELECT id FROM categories WHERE name = 'Placas de Carga'),
  46.8,
  78,
  7,
  2
);
INSERT INTO products (name, sku, category_id, cost_price, price, stock, store_id)
VALUES (
  'Placa Sub Redmi Note 11E/ Poco m4 5g/ Poco m5/ Redmi 10 5g',
  'PLC-0237',
  (SELECT id FROM categories WHERE name = 'Placas de Carga'),
  70.2,
  117,
  10,
  1
);
INSERT INTO products (name, sku, category_id, cost_price, price, stock, store_id)
VALUES (
  'Placa Sub E5 plus',
  'PLC-0238',
  (SELECT id FROM categories WHERE name = 'Placas de Carga'),
  70.2,
  117,
  4,
  2
);
INSERT INTO products (name, sku, category_id, cost_price, price, stock, store_id)
VALUES (
  'Placa Sub Redmi note 11E com aro (Premium)',
  'PLC-0239',
  (SELECT id FROM categories WHERE name = 'Placas de Carga'),
  105.3,
  175.5,
  7,
  1
);
INSERT INTO products (name, sku, category_id, cost_price, price, stock, store_id)
VALUES (
  'Placa Sub E5 plus com aro',
  'PLC-0240',
  (SELECT id FROM categories WHERE name = 'Placas de Carga'),
  78,
  130,
  7,
  2
);
INSERT INTO products (name, sku, category_id, cost_price, price, stock, store_id)
VALUES (
  'Placa Sub Redmi Note 12 4g/ 12 5g/ poco x5 5g incell',
  'PLC-0241',
  (SELECT id FROM categories WHERE name = 'Placas de Carga'),
  66.3,
  110.5,
  3,
  1
);
INSERT INTO products (name, sku, category_id, cost_price, price, stock, store_id)
VALUES (
  'Placa Sub E5 play',
  'PLC-0242',
  (SELECT id FROM categories WHERE name = 'Placas de Carga'),
  66.3,
  110.5,
  4,
  2
);
INSERT INTO products (name, sku, category_id, cost_price, price, stock, store_id)
VALUES (
  'Placa Sub Redmi note 12 4g incell com aro',
  'PLC-0243',
  (SELECT id FROM categories WHERE name = 'Placas de Carga'),
  81.9,
  136.5,
  9,
  1
);
INSERT INTO products (name, sku, category_id, cost_price, price, stock, store_id)
VALUES (
  'Placa Sub E5 play com aro',
  'PLC-0244',
  (SELECT id FROM categories WHERE name = 'Placas de Carga'),
  101.4,
  169,
  7,
  2
);
INSERT INTO products (name, sku, category_id, cost_price, price, stock, store_id)
VALUES (
  'Placa Sub Redmi Note 12 4g oled com aro',
  'PLC-0245',
  (SELECT id FROM categories WHERE name = 'Placas de Carga'),
  195,
  325,
  1,
  1
);
INSERT INTO products (name, sku, category_id, cost_price, price, stock, store_id)
VALUES (
  'Placa Sub E6 plus',
  'PLC-0246',
  (SELECT id FROM categories WHERE name = 'Placas de Carga'),
  46.8,
  78,
  7,
  2
);
INSERT INTO products (name, sku, category_id, cost_price, price, stock, store_id)
VALUES (
  'Placa Sub Redmi Note 12 4g oled com aro (Premium)',
  'PLC-0247',
  (SELECT id FROM categories WHERE name = 'Placas de Carga'),
  234,
  390,
  6,
  1
);
INSERT INTO products (name, sku, category_id, cost_price, price, stock, store_id)
VALUES (
  'Placa Sub E6 plus com aro',
  'PLC-0248',
  (SELECT id FROM categories WHERE name = 'Placas de Carga'),
  62.4,
  104,
  2,
  2
);
INSERT INTO products (name, sku, category_id, cost_price, price, stock, store_id)
VALUES (
  'Placa Sub Redmi note 12 5g / poco x5 5g incell com aro',
  'PLC-0249',
  (SELECT id FROM categories WHERE name = 'Placas de Carga'),
  93.6,
  156,
  8,
  1
);
INSERT INTO products (name, sku, category_id, cost_price, price, stock, store_id)
VALUES (
  'Placa Sub E6 play',
  'PLC-0250',
  (SELECT id FROM categories WHERE name = 'Placas de Carga'),
  54.6,
  91,
  4,
  2
);
INSERT INTO products (name, sku, category_id, cost_price, price, stock, store_id)
VALUES (
  'Placa Sub Redmi note 12 5g/ Poco x5 5g oled com aro',
  'PLC-0251',
  (SELECT id FROM categories WHERE name = 'Placas de Carga'),
  218.4,
  364,
  1,
  1
);
INSERT INTO products (name, sku, category_id, cost_price, price, stock, store_id)
VALUES (
  'Placa Sub E6 play com aro',
  'PLC-0252',
  (SELECT id FROM categories WHERE name = 'Placas de Carga'),
  62.4,
  104,
  9,
  2
);
INSERT INTO products (name, sku, category_id, cost_price, price, stock, store_id)
VALUES (
  'Placa Sub Redmi Note 12 5g / poco x5 5g oled com aro (Premium)',
  'PLC-0253',
  (SELECT id FROM categories WHERE name = 'Placas de Carga'),
  241.8,
  403,
  3,
  1
);
INSERT INTO products (name, sku, category_id, cost_price, price, stock, store_id)
VALUES (
  'Placa Sub E6i/E6s',
  'PLC-0254',
  (SELECT id FROM categories WHERE name = 'Placas de Carga'),
  54.6,
  91,
  3,
  2
);
INSERT INTO products (name, sku, category_id, cost_price, price, stock, store_id)
VALUES (
  'Placa Sub Redmi note 12 pro 4g incell',
  'PLC-0255',
  (SELECT id FROM categories WHERE name = 'Placas de Carga'),
  74.1,
  123.5,
  10,
  1
);
INSERT INTO products (name, sku, category_id, cost_price, price, stock, store_id)
VALUES (
  'Placa Sub E6s com aro',
  'PLC-0256',
  (SELECT id FROM categories WHERE name = 'Placas de Carga'),
  70.2,
  117,
  8,
  2
);
INSERT INTO products (name, sku, category_id, cost_price, price, stock, store_id)
VALUES (
  'Placa Sub Note 12 pro 4g incell com aro',
  'PLC-0257',
  (SELECT id FROM categories WHERE name = 'Placas de Carga'),
  85.8,
  143,
  2,
  1
);
INSERT INTO products (name, sku, category_id, cost_price, price, stock, store_id)
VALUES (
  'Placa Sub E7/E7 power',
  'PLC-0258',
  (SELECT id FROM categories WHERE name = 'Placas de Carga'),
  46.8,
  78,
  10,
  2
);
INSERT INTO products (name, sku, category_id, cost_price, price, stock, store_id)
VALUES (
  'Placa Sub Redmi note 12 pro 4g incell com aro (premium)',
  'PLC-0259',
  (SELECT id FROM categories WHERE name = 'Placas de Carga'),
  105.3,
  175.5,
  9,
  1
);
INSERT INTO products (name, sku, category_id, cost_price, price, stock, store_id)
VALUES (
  'Placa Sub E7 com aro',
  'PLC-0260',
  (SELECT id FROM categories WHERE name = 'Placas de Carga'),
  66.3,
  110.5,
  1,
  2
);
INSERT INTO products (name, sku, category_id, cost_price, price, stock, store_id)
VALUES (
  'Placa Sub Redmi note 12 pro 4g oled com aro (Premium)',
  'PLC-0261',
  (SELECT id FROM categories WHERE name = 'Placas de Carga'),
  226.2,
  377,
  6,
  1
);
INSERT INTO products (name, sku, category_id, cost_price, price, stock, store_id)
VALUES (
  'Placa Sub E7 power com aro',
  'PLC-0262',
  (SELECT id FROM categories WHERE name = 'Placas de Carga'),
  66.3,
  110.5,
  8,
  2
);
INSERT INTO products (name, sku, category_id, cost_price, price, stock, store_id)
VALUES (
  'Placa Sub Redmi Note 12 pro 5g / Poco x5 pró 5g incell',
  'PLC-0263',
  (SELECT id FROM categories WHERE name = 'Placas de Carga'),
  74.1,
  123.5,
  1,
  1
);
INSERT INTO products (name, sku, category_id, cost_price, price, stock, store_id)
VALUES (
  'Placa Sub E13',
  'PLC-0264',
  (SELECT id FROM categories WHERE name = 'Placas de Carga'),
  54.6,
  91,
  9,
  2
);
INSERT INTO products (name, sku, category_id, cost_price, price, stock, store_id)
VALUES (
  'Placa Sub Redmi Note 12 pro 5g / Poco x5 pró 5g incell com aro (premium)',
  'PLC-0265',
  (SELECT id FROM categories WHERE name = 'Placas de Carga'),
  144.3,
  240.5,
  5,
  1
);
INSERT INTO products (name, sku, category_id, cost_price, price, stock, store_id)
VALUES (
  'Placa Sub E13 com aro',
  'PLC-0266',
  (SELECT id FROM categories WHERE name = 'Placas de Carga'),
  70.2,
  117,
  7,
  2
);
INSERT INTO products (name, sku, category_id, cost_price, price, stock, store_id)
VALUES (
  'Placa Sub Redmi note 12 pro 5g / poco x5 pro 5g oled (Premium)',
  'PLC-0267',
  (SELECT id FROM categories WHERE name = 'Placas de Carga'),
  214.5,
  357.5,
  4,
  1
);
INSERT INTO products (name, sku, category_id, cost_price, price, stock, store_id)
VALUES (
  'Placa Sub E13 com aro (Premium)',
  'PLC-0268',
  (SELECT id FROM categories WHERE name = 'Placas de Carga'),
  93.6,
  156,
  3,
  2
);
INSERT INTO products (name, sku, category_id, cost_price, price, stock, store_id)
VALUES (
  'Placa Sub Redmi Note 12 pro plus oled com aro (Premium)',
  'PLC-0269',
  (SELECT id FROM categories WHERE name = 'Placas de Carga'),
  319.8,
  533,
  9,
  1
);
INSERT INTO products (name, sku, category_id, cost_price, price, stock, store_id)
VALUES (
  'Placa Sub E20',
  'PLC-0270',
  (SELECT id FROM categories WHERE name = 'Placas de Carga'),
  54.6,
  91,
  9,
  2
);
INSERT INTO products (name, sku, category_id, cost_price, price, stock, store_id)
VALUES (
  'Placa Sub Redmi note 13 4g incell',
  'PLC-0271',
  (SELECT id FROM categories WHERE name = 'Placas de Carga'),
  74.1,
  123.5,
  2,
  1
);
INSERT INTO products (name, sku, category_id, cost_price, price, stock, store_id)
VALUES (
  'Placa Sub E20 com aro',
  'PLC-0272',
  (SELECT id FROM categories WHERE name = 'Placas de Carga'),
  66.3,
  110.5,
  8,
  2
);
INSERT INTO products (name, sku, category_id, cost_price, price, stock, store_id)
VALUES (
  'Placa Sub Redmi note 13 4g incell com aro',
  'PLC-0273',
  (SELECT id FROM categories WHERE name = 'Placas de Carga'),
  93.6,
  156,
  10,
  1
);
INSERT INTO products (name, sku, category_id, cost_price, price, stock, store_id)
VALUES (
  'Placa Sub E20 com aro (Premium)',
  'PLC-0274',
  (SELECT id FROM categories WHERE name = 'Placas de Carga'),
  85.8,
  143,
  2,
  2
);
INSERT INTO products (name, sku, category_id, cost_price, price, stock, store_id)
VALUES (
  'Placa Sub Note 13 4g incell com aro (Premium)',
  'PLC-0275',
  (SELECT id FROM categories WHERE name = 'Placas de Carga'),
  132.6,
  221,
  9,
  1
);
INSERT INTO products (name, sku, category_id, cost_price, price, stock, store_id)
VALUES (
  'Placa Sub E22',
  'PLC-0276',
  (SELECT id FROM categories WHERE name = 'Placas de Carga'),
  54.6,
  91,
  4,
  2
);
INSERT INTO products (name, sku, category_id, cost_price, price, stock, store_id)
VALUES (
  'Placa Sub Note 13 4g oled',
  'PLC-0277',
  (SELECT id FROM categories WHERE name = 'Placas de Carga'),
  179.4,
  299,
  9,
  1
);
INSERT INTO products (name, sku, category_id, cost_price, price, stock, store_id)
VALUES (
  'Placa Sub E22 com aro',
  'PLC-0278',
  (SELECT id FROM categories WHERE name = 'Placas de Carga'),
  66.3,
  110.5,
  10,
  2
);
INSERT INTO products (name, sku, category_id, cost_price, price, stock, store_id)
VALUES (
  'Placa Sub Redmi note 13 4g oled com aro',
  'PLC-0279',
  (SELECT id FROM categories WHERE name = 'Placas de Carga'),
  210.6,
  351,
  4,
  1
);
INSERT INTO products (name, sku, category_id, cost_price, price, stock, store_id)
VALUES (
  'Placa Sub E32 com aro',
  'PLC-0280',
  (SELECT id FROM categories WHERE name = 'Placas de Carga'),
  70.2,
  117,
  5,
  2
);
INSERT INTO products (name, sku, category_id, cost_price, price, stock, store_id)
VALUES (
  'Placa Sub Redmi note 13 4g oled com aro (premium)',
  'PLC-0281',
  (SELECT id FROM categories WHERE name = 'Placas de Carga'),
  351,
  585,
  3,
  1
);
INSERT INTO products (name, sku, category_id, cost_price, price, stock, store_id)
VALUES (
  'Placa Sub E32 com aro (Premium)',
  'PLC-0282',
  (SELECT id FROM categories WHERE name = 'Placas de Carga'),
  93.6,
  156,
  6,
  2
);
INSERT INTO products (name, sku, category_id, cost_price, price, stock, store_id)
VALUES (
  'Placa Sub Redmi note 13 5g/ poco f5 5g',
  'PLC-0283',
  (SELECT id FROM categories WHERE name = 'Placas de Carga'),
  85.8,
  143,
  6,
  1
);
INSERT INTO products (name, sku, category_id, cost_price, price, stock, store_id)
VALUES (
  'Placa Sub E40',
  'PLC-0284',
  (SELECT id FROM categories WHERE name = 'Placas de Carga'),
  66.3,
  110.5,
  2,
  2
);
INSERT INTO products (name, sku, category_id, cost_price, price, stock, store_id)
VALUES (
  'Placa Sub Redmi note 13 pro 4g incell/ poco m6 pro 4g',
  'PLC-0285',
  (SELECT id FROM categories WHERE name = 'Placas de Carga'),
  78,
  130,
  5,
  1
);
INSERT INTO products (name, sku, category_id, cost_price, price, stock, store_id)
VALUES (
  'Placa Sub E40 com aro',
  'PLC-0286',
  (SELECT id FROM categories WHERE name = 'Placas de Carga'),
  70.2,
  117,
  6,
  2
);
INSERT INTO products (name, sku, category_id, cost_price, price, stock, store_id)
VALUES (
  'Placa Sub Redmi note 13 pro 4g/ poco m6 pro 4g incell com aro (Premium)',
  'PLC-0287',
  (SELECT id FROM categories WHERE name = 'Placas de Carga'),
  222.3,
  370.5,
  8,
  1
);
INSERT INTO products (name, sku, category_id, cost_price, price, stock, store_id)
VALUES (
  'Placa Sub E40 com aro (Premium)',
  'PLC-0288',
  (SELECT id FROM categories WHERE name = 'Placas de Carga'),
  93.6,
  156,
  10,
  2
);
INSERT INTO products (name, sku, category_id, cost_price, price, stock, store_id)
VALUES (
  'Placa Sub Redmi note 13 pro 5g/ poco x6/ poco x6 pro 5g incell',
  'PLC-0289',
  (SELECT id FROM categories WHERE name = 'Placas de Carga'),
  101.4,
  169,
  7,
  1
);
INSERT INTO products (name, sku, category_id, cost_price, price, stock, store_id)
VALUES (
  'Placa Sub Xplay',
  'PLC-0290',
  (SELECT id FROM categories WHERE name = 'Placas de Carga'),
  62.4,
  104,
  8,
  2
);
INSERT INTO products (name, sku, category_id, cost_price, price, stock, store_id)
VALUES (
  'Placa Sub Redmi note 13 pro 5g/ poco x6 oled com aro',
  'PLC-0291',
  (SELECT id FROM categories WHERE name = 'Placas de Carga'),
  351,
  585,
  1,
  1
);
INSERT INTO products (name, sku, category_id, cost_price, price, stock, store_id)
VALUES (
  'Placa Sub X2',
  'PLC-0292',
  (SELECT id FROM categories WHERE name = 'Placas de Carga'),
  62.4,
  104,
  1,
  2
);
INSERT INTO products (name, sku, category_id, cost_price, price, stock, store_id)
VALUES (
  'Placa Sub Redmi note 14  incell',
  'PLC-0293',
  (SELECT id FROM categories WHERE name = 'Placas de Carga'),
  85.8,
  143,
  3,
  1
);
INSERT INTO products (name, sku, category_id, cost_price, price, stock, store_id)
VALUES (
  'Placa Sub X4',
  'PLC-0294',
  (SELECT id FROM categories WHERE name = 'Placas de Carga'),
  78,
  130,
  5,
  2
);
INSERT INTO products (name, sku, category_id, cost_price, price, stock, store_id)
VALUES (
  'Placa Sub Redmi note 14 pro incell',
  'PLC-0295',
  (SELECT id FROM categories WHERE name = 'Placas de Carga'),
  132.6,
  221,
  3,
  1
);
INSERT INTO products (name, sku, category_id, cost_price, price, stock, store_id)
VALUES (
  'Placa Sub Z play incell',
  'PLC-0296',
  (SELECT id FROM categories WHERE name = 'Placas de Carga'),
  70.2,
  117,
  8,
  2
);
INSERT INTO products (name, sku, category_id, cost_price, price, stock, store_id)
VALUES (
  'Placa Sub Poco f1',
  'PLC-0297',
  (SELECT id FROM categories WHERE name = 'Placas de Carga'),
  70.2,
  117,
  2,
  1
);
INSERT INTO products (name, sku, category_id, cost_price, price, stock, store_id)
VALUES (
  'Placa Sub Z play oled',
  'PLC-0298',
  (SELECT id FROM categories WHERE name = 'Placas de Carga'),
  109.2,
  182,
  6,
  2
);
INSERT INTO products (name, sku, category_id, cost_price, price, stock, store_id)
VALUES (
  'Placa Sub Poco f1 com aro  (Premium)',
  'PLC-0299',
  (SELECT id FROM categories WHERE name = 'Placas de Carga'),
  85.8,
  143,
  3,
  1
);
INSERT INTO products (name, sku, category_id, cost_price, price, stock, store_id)
VALUES (
  'Placa Sub Z2 play oled',
  'PLC-0300',
  (SELECT id FROM categories WHERE name = 'Placas de Carga'),
  132.6,
  221,
  1,
  2
);
INSERT INTO products (name, sku, category_id, cost_price, price, stock, store_id)
VALUES (
  'Placa Sub Poco F3 incell',
  'PLC-0301',
  (SELECT id FROM categories WHERE name = 'Placas de Carga'),
  74.1,
  123.5,
  7,
  1
);
INSERT INTO products (name, sku, category_id, cost_price, price, stock, store_id)
VALUES (
  'Placa Sub Z3 play oled',
  'PLC-0302',
  (SELECT id FROM categories WHERE name = 'Placas de Carga'),
  156,
  260,
  10,
  2
);
INSERT INTO products (name, sku, category_id, cost_price, price, stock, store_id)
VALUES (
  'Placa Sub Poco F3 incell com aro (Premium)',
  'PLC-0303',
  (SELECT id FROM categories WHERE name = 'Placas de Carga'),
  117,
  195,
  7,
  1
);
INSERT INTO products (name, sku, category_id, cost_price, price, stock, store_id)
VALUES (
  'Placa Sub C',
  'PLC-0304',
  (SELECT id FROM categories WHERE name = 'Placas de Carga'),
  62.4,
  104,
  4,
  2
);
INSERT INTO products (name, sku, category_id, cost_price, price, stock, store_id)
VALUES (
  'Placa Sub Poco F3 oled com aro (Premium)',
  'PLC-0305',
  (SELECT id FROM categories WHERE name = 'Placas de Carga'),
  234,
  390,
  7,
  1
);
INSERT INTO products (name, sku, category_id, cost_price, price, stock, store_id)
VALUES (
  'Placa Sub C plus',
  'PLC-0306',
  (SELECT id FROM categories WHERE name = 'Placas de Carga'),
  62.4,
  104,
  7,
  2
);
INSERT INTO products (name, sku, category_id, cost_price, price, stock, store_id)
VALUES (
  'Placa Sub Poco f4 incell',
  'PLC-0307',
  (SELECT id FROM categories WHERE name = 'Placas de Carga'),
  70.2,
  117,
  6,
  1
);
INSERT INTO products (name, sku, category_id, cost_price, price, stock, store_id)
VALUES (
  'Placa Sub One',
  'PLC-0308',
  (SELECT id FROM categories WHERE name = 'Placas de Carga'),
  54.6,
  91,
  10,
  2
);
INSERT INTO products (name, sku, category_id, cost_price, price, stock, store_id)
VALUES (
  'Placa Sub Poco F4 incell com aro',
  'PLC-0309',
  (SELECT id FROM categories WHERE name = 'Placas de Carga'),
  124.8,
  208,
  3,
  1
);
INSERT INTO products (name, sku, category_id, cost_price, price, stock, store_id)
VALUES (
  'Placa Sub One com aro',
  'PLC-0310',
  (SELECT id FROM categories WHERE name = 'Placas de Carga'),
  85.8,
  143,
  4,
  2
);
INSERT INTO products (name, sku, category_id, cost_price, price, stock, store_id)
VALUES (
  'Placa Sub Poco F4 oled com aro (Premium)',
  'PLC-0311',
  (SELECT id FROM categories WHERE name = 'Placas de Carga'),
  222.3,
  370.5,
  1,
  1
);
INSERT INTO products (name, sku, category_id, cost_price, price, stock, store_id)
VALUES (
  'Placa Sub One vision/One action',
  'PLC-0312',
  (SELECT id FROM categories WHERE name = 'Placas de Carga'),
  163.8,
  273,
  5,
  2
);
INSERT INTO products (name, sku, category_id, cost_price, price, stock, store_id)
VALUES (
  'Placa Sub Poco f5 pro incell',
  'PLC-0313',
  (SELECT id FROM categories WHERE name = 'Placas de Carga'),
  89.7,
  149.5,
  3,
  1
);
INSERT INTO products (name, sku, category_id, cost_price, price, stock, store_id)
VALUES (
  'Placa Sub One vision com aro',
  'PLC-0314',
  (SELECT id FROM categories WHERE name = 'Placas de Carga'),
  210.6,
  351,
  5,
  2
);
INSERT INTO products (name, sku, category_id, cost_price, price, stock, store_id)
VALUES (
  'Placa Sub Poco x2',
  'PLC-0315',
  (SELECT id FROM categories WHERE name = 'Placas de Carga'),
  89.7,
  149.5,
  6,
  1
);
INSERT INTO products (name, sku, category_id, cost_price, price, stock, store_id)
VALUES (
  'Placa Sub One action com aro',
  'PLC-0316',
  (SELECT id FROM categories WHERE name = 'Placas de Carga'),
  241.8,
  403,
  2,
  2
);
INSERT INTO products (name, sku, category_id, cost_price, price, stock, store_id)
VALUES (
  'Placa Sub Poco x2 com aro',
  'PLC-0317',
  (SELECT id FROM categories WHERE name = 'Placas de Carga'),
  124.8,
  208,
  3,
  1
);
INSERT INTO products (name, sku, category_id, cost_price, price, stock, store_id)
VALUES (
  'Placa Sub One hyper',
  'PLC-0318',
  (SELECT id FROM categories WHERE name = 'Placas de Carga'),
  62.4,
  104,
  2,
  2
);
INSERT INTO products (name, sku, category_id, cost_price, price, stock, store_id)
VALUES (
  'Placa Sub Poco X3/ Poco x3 pró/ Poco x3 nfc',
  'PLC-0319',
  (SELECT id FROM categories WHERE name = 'Placas de Carga'),
  74.1,
  123.5,
  3,
  1
);
INSERT INTO products (name, sku, category_id, cost_price, price, stock, store_id)
VALUES (
  'Placa Sub One hyper com aro (Premium)',
  'PLC-0320',
  (SELECT id FROM categories WHERE name = 'Placas de Carga'),
  152.1,
  253.5,
  6,
  2
);
INSERT INTO products (name, sku, category_id, cost_price, price, stock, store_id)
VALUES (
  'Placa Sub Poco x3 com aro',
  'PLC-0321',
  (SELECT id FROM categories WHERE name = 'Placas de Carga'),
  101.4,
  169,
  8,
  1
);
INSERT INTO products (name, sku, category_id, cost_price, price, stock, store_id)
VALUES (
  'Placa Sub One fusion',
  'PLC-0322',
  (SELECT id FROM categories WHERE name = 'Placas de Carga'),
  58.5,
  97.5,
  1,
  2
);
INSERT INTO products (name, sku, category_id, cost_price, price, stock, store_id)
VALUES (
  'Placa Sub Poco x3 pro com aro (Premium)',
  'PLC-0323',
  (SELECT id FROM categories WHERE name = 'Placas de Carga'),
  113.1,
  188.5,
  2,
  1
);
INSERT INTO products (name, sku, category_id, cost_price, price, stock, store_id)
VALUES (
  'Placa Sub One fusion com aro',
  'PLC-0324',
  (SELECT id FROM categories WHERE name = 'Placas de Carga'),
  66.3,
  110.5,
  2,
  2
);
INSERT INTO products (name, sku, category_id, cost_price, price, stock, store_id)
VALUES (
  'Placa Sub Poco x3 gt',
  'PLC-0325',
  (SELECT id FROM categories WHERE name = 'Placas de Carga'),
  70.2,
  117,
  5,
  1
);
INSERT INTO products (name, sku, category_id, cost_price, price, stock, store_id)
VALUES (
  'Placa Sub One fusion plus',
  'PLC-0326',
  (SELECT id FROM categories WHERE name = 'Placas de Carga'),
  62.4,
  104,
  5,
  2
);
INSERT INTO products (name, sku, category_id, cost_price, price, stock, store_id)
VALUES (
  'Placa Sub Poco x3 gt com aro (Premium)',
  'PLC-0327',
  (SELECT id FROM categories WHERE name = 'Placas de Carga'),
  105.3,
  175.5,
  3,
  1
);
INSERT INTO products (name, sku, category_id, cost_price, price, stock, store_id)
VALUES (
  'Placa Sub One fusion plus com aro (Premium)',
  'PLC-0328',
  (SELECT id FROM categories WHERE name = 'Placas de Carga'),
  109.2,
  182,
  1,
  2
);
INSERT INTO products (name, sku, category_id, cost_price, price, stock, store_id)
VALUES (
  'Placa Sub Poco x4 gt',
  'PLC-0329',
  (SELECT id FROM categories WHERE name = 'Placas de Carga'),
  105.3,
  175.5,
  8,
  1
);
INSERT INTO products (name, sku, category_id, cost_price, price, stock, store_id)
VALUES (
  'Placa Sub One zoom oled',
  'PLC-0330',
  (SELECT id FROM categories WHERE name = 'Placas de Carga'),
  148.2,
  247,
  1,
  2
);
INSERT INTO products (name, sku, category_id, cost_price, price, stock, store_id)
VALUES (
  'Placa Sub Poco x6 oled com aro',
  'PLC-0331',
  (SELECT id FROM categories WHERE name = 'Placas de Carga'),
  210.6,
  351,
  5,
  1
);
INSERT INTO products (name, sku, category_id, cost_price, price, stock, store_id)
VALUES (
  'Placa Sub Edge oled (Premium)',
  'PLC-0332',
  (SELECT id FROM categories WHERE name = 'Placas de Carga'),
  300.3,
  500.5,
  8,
  2
);
INSERT INTO products (name, sku, category_id, cost_price, price, stock, store_id)
VALUES (
  'Placa Sub Poco x6 pro oled com aro',
  'PLC-0333',
  (SELECT id FROM categories WHERE name = 'Placas de Carga'),
  241.8,
  403,
  10,
  1
);
INSERT INTO products (name, sku, category_id, cost_price, price, stock, store_id)
VALUES (
  'Placa Sub Edge oled com aro (Premium)',
  'PLC-0334',
  (SELECT id FROM categories WHERE name = 'Placas de Carga'),
  397.8,
  663,
  8,
  2
);
INSERT INTO products (name, sku, category_id, cost_price, price, stock, store_id)
VALUES (
  'Placa Sub Poco x7 oled',
  'PLC-0335',
  (SELECT id FROM categories WHERE name = 'Placas de Carga'),
  202.8,
  338,
  10,
  1
);
INSERT INTO products (name, sku, category_id, cost_price, price, stock, store_id)
VALUES (
  'Placa Sub Edge 20/ edge 20 plus/edge 20 pró oled',
  'PLC-0336',
  (SELECT id FROM categories WHERE name = 'Placas de Carga'),
  241.8,
  403,
  6,
  2
);
INSERT INTO products (name, sku, category_id, cost_price, price, stock, store_id)
VALUES (
  'Placa Sub Poco m4 5g / m5 com aro (Premium)',
  'PLC-0337',
  (SELECT id FROM categories WHERE name = 'Placas de Carga'),
  97.5,
  162.5,
  2,
  1
);
INSERT INTO products (name, sku, category_id, cost_price, price, stock, store_id)
VALUES (
  'Placa Sub Edge 20 oled com aro (Premium)',
  'PLC-0338',
  (SELECT id FROM categories WHERE name = 'Placas de Carga'),
  222.3,
  370.5,
  3,
  2
);
INSERT INTO products (name, sku, category_id, cost_price, price, stock, store_id)
VALUES (
  'Placa Sub Poco m4 4g',
  'PLC-0339',
  (SELECT id FROM categories WHERE name = 'Placas de Carga'),
  70.2,
  117,
  10,
  1
);
INSERT INTO products (name, sku, category_id, cost_price, price, stock, store_id)
VALUES (
  'Placa Sub Edge 20 pro oled com aro (Premium)',
  'PLC-0340',
  (SELECT id FROM categories WHERE name = 'Placas de Carga'),
  319.8,
  533,
  10,
  2
);
INSERT INTO products (name, sku, category_id, cost_price, price, stock, store_id)
VALUES (
  'Placa Sub Poco m4 pro 5g',
  'PLC-0341',
  (SELECT id FROM categories WHERE name = 'Placas de Carga'),
  78,
  130,
  4,
  1
);
INSERT INTO products (name, sku, category_id, cost_price, price, stock, store_id)
VALUES (
  'Placa Sub Edge 20 lite incell',
  'PLC-0342',
  (SELECT id FROM categories WHERE name = 'Placas de Carga'),
  81.9,
  136.5,
  2,
  2
);
INSERT INTO products (name, sku, category_id, cost_price, price, stock, store_id)
VALUES (
  'Placa Sub Poco m4 pro 5g com aro (Premium)',
  'PLC-0343',
  (SELECT id FROM categories WHERE name = 'Placas de Carga'),
  101.4,
  169,
  9,
  1
);
INSERT INTO products (name, sku, category_id, cost_price, price, stock, store_id)
VALUES (
  'Placa Sub Edge 20 lite oled',
  'PLC-0344',
  (SELECT id FROM categories WHERE name = 'Placas de Carga'),
  226.2,
  377,
  1,
  2
);
INSERT INTO products (name, sku, category_id, cost_price, price, stock, store_id)
VALUES (
  'Placa Sub Redmi pad se 11 polegadas',
  'PLC-0345',
  (SELECT id FROM categories WHERE name = 'Placas de Carga'),
  202.8,
  338,
  8,
  1
);
INSERT INTO products (name, sku, category_id, cost_price, price, stock, store_id)
VALUES (
  'Placa Sub Edge 30 neo incell',
  'PLC-0346',
  (SELECT id FROM categories WHERE name = 'Placas de Carga'),
  124.8,
  208,
  3,
  2
);
INSERT INTO products (name, sku, category_id, cost_price, price, stock, store_id)
VALUES (
  'Placa Sub Edge 30 neo oled',
  'PLC-0347',
  (SELECT id FROM categories WHERE name = 'Placas de Carga'),
  335.4,
  559,
  3,
  1
);
INSERT INTO products (name, sku, category_id, cost_price, price, stock, store_id)
VALUES (
  'Placa Sub Edge 30 neo oled com aro (Premium)',
  'PLC-0348',
  (SELECT id FROM categories WHERE name = 'Placas de Carga'),
  405.6,
  676,
  1,
  2
);
INSERT INTO products (name, sku, category_id, cost_price, price, stock, store_id)
VALUES (
  'Placa Sub C3/C12/C15',
  'PLC-0349',
  (SELECT id FROM categories WHERE name = 'Placas de Carga'),
  54.6,
  91,
  5,
  1
);
INSERT INTO products (name, sku, category_id, cost_price, price, stock, store_id)
VALUES (
  'Placa Sub Edge 30 ultra incell',
  'PLC-0350',
  (SELECT id FROM categories WHERE name = 'Placas de Carga'),
  132.6,
  221,
  9,
  2
);
INSERT INTO products (name, sku, category_id, cost_price, price, stock, store_id)
VALUES (
  'Placa Sub C3 com aro',
  'PLC-0351',
  (SELECT id FROM categories WHERE name = 'Placas de Carga'),
  78,
  130,
  6,
  1
);
INSERT INTO products (name, sku, category_id, cost_price, price, stock, store_id)
VALUES (
  'Placa Sub Edge 40 oled',
  'PLC-0352',
  (SELECT id FROM categories WHERE name = 'Placas de Carga'),
  312,
  520,
  3,
  2
);
INSERT INTO products (name, sku, category_id, cost_price, price, stock, store_id)
VALUES (
  'Placa Sub C3 com aro (Premium)',
  'PLC-0353',
  (SELECT id FROM categories WHERE name = 'Placas de Carga'),
  89.7,
  149.5,
  10,
  1
);
INSERT INTO products (name, sku, category_id, cost_price, price, stock, store_id)
VALUES (
  'Placa Sub Edge 40 oled com aro (Premium)',
  'PLC-0354',
  (SELECT id FROM categories WHERE name = 'Placas de Carga'),
  397.8,
  663,
  8,
  2
);
INSERT INTO products (name, sku, category_id, cost_price, price, stock, store_id)
VALUES (
  'Placa Sub Edge 50 oled',
  'PLC-0355',
  (SELECT id FROM categories WHERE name = 'Placas de Carga'),
  312,
  520,
  7,
  1
);
INSERT INTO products (name, sku, category_id, cost_price, price, stock, store_id)
VALUES (
  'Placa Sub 5i',
  'PLC-0356',
  (SELECT id FROM categories WHERE name = 'Placas de Carga'),
  70.2,
  117,
  7,
  2
);
INSERT INTO products (name, sku, category_id, cost_price, price, stock, store_id)
VALUES (
  'Placa Sub 7 / A52',
  'PLC-0357',
  (SELECT id FROM categories WHERE name = 'Placas de Carga'),
  78,
  130,
  2,
  1
);
INSERT INTO products (name, sku, category_id, cost_price, price, stock, store_id)
VALUES (
  'Placa Sub 7i',
  'PLC-0358',
  (SELECT id FROM categories WHERE name = 'Placas de Carga'),
  58.5,
  97.5,
  10,
  2
);
INSERT INTO products (name, sku, category_id, cost_price, price, stock, store_id)
VALUES (
  'Placa Sub K4',
  'PLC-0359',
  (SELECT id FROM categories WHERE name = 'Placas de Carga'),
  32.4,
  54,
  8,
  1
);
INSERT INTO products (name, sku, category_id, cost_price, price, stock, store_id)
VALUES (
  'Placa Sub 7i com aro (Premium)',
  'PLC-0360',
  (SELECT id FROM categories WHERE name = 'Placas de Carga'),
  89.7,
  149.5,
  7,
  2
);
INSERT INTO products (name, sku, category_id, cost_price, price, stock, store_id)
VALUES (
  'Placa Sub K4 2017 com aro',
  'PLC-0361',
  (SELECT id FROM categories WHERE name = 'Placas de Carga'),
  62.4,
  104,
  7,
  1
);
INSERT INTO products (name, sku, category_id, cost_price, price, stock, store_id)
VALUES (
  'Placa Sub 8i/ 9i',
  'PLC-0362',
  (SELECT id FROM categories WHERE name = 'Placas de Carga'),
  101.4,
  169,
  1,
  2
);
INSERT INTO products (name, sku, category_id, cost_price, price, stock, store_id)
VALUES (
  'Placa Sub K8 com aro',
  'PLC-0363',
  (SELECT id FROM categories WHERE name = 'Placas de Carga'),
  62.4,
  104,
  6,
  1
);
INSERT INTO products (name, sku, category_id, cost_price, price, stock, store_id)
VALUES (
  'Placa Sub C11',
  'PLC-0364',
  (SELECT id FROM categories WHERE name = 'Placas de Carga'),
  62.4,
  104,
  3,
  2
);
INSERT INTO products (name, sku, category_id, cost_price, price, stock, store_id)
VALUES (
  'Placa Sub K8 2017 com aro',
  'PLC-0365',
  (SELECT id FROM categories WHERE name = 'Placas de Carga'),
  70.2,
  117,
  8,
  1
);
INSERT INTO products (name, sku, category_id, cost_price, price, stock, store_id)
VALUES (
  'Placa Sub C11 2021',
  'PLC-0366',
  (SELECT id FROM categories WHERE name = 'Placas de Carga'),
  62.4,
  104,
  4,
  2
);
INSERT INTO products (name, sku, category_id, cost_price, price, stock, store_id)
VALUES (
  'Placa Sub K8 plus',
  'PLC-0367',
  (SELECT id FROM categories WHERE name = 'Placas de Carga'),
  62.4,
  104,
  4,
  1
);
INSERT INTO products (name, sku, category_id, cost_price, price, stock, store_id)
VALUES (
  'Placa Sub C11 2021 com aro (Premium)',
  'PLC-0368',
  (SELECT id FROM categories WHERE name = 'Placas de Carga'),
  81.9,
  136.5,
  8,
  2
);
INSERT INTO products (name, sku, category_id, cost_price, price, stock, store_id)
VALUES (
  'Placa Sub K8 plus com aro',
  'PLC-0369',
  (SELECT id FROM categories WHERE name = 'Placas de Carga'),
  58.5,
  97.5,
  6,
  1
);
INSERT INTO products (name, sku, category_id, cost_price, price, stock, store_id)
VALUES (
  'Placa Sub C15 com aro (Premium)',
  'PLC-0370',
  (SELECT id FROM categories WHERE name = 'Placas de Carga'),
  78,
  130,
  9,
  2
);
INSERT INTO products (name, sku, category_id, cost_price, price, stock, store_id)
VALUES (
  'Placa Sub K9 com aro',
  'PLC-0371',
  (SELECT id FROM categories WHERE name = 'Placas de Carga'),
  58.5,
  97.5,
  3,
  1
);
INSERT INTO products (name, sku, category_id, cost_price, price, stock, store_id)
VALUES (
  'Placa Sub C20',
  'PLC-0372',
  (SELECT id FROM categories WHERE name = 'Placas de Carga'),
  81.9,
  136.5,
  4,
  2
);
INSERT INTO products (name, sku, category_id, cost_price, price, stock, store_id)
VALUES (
  'Placa Sub K10 tv com aro',
  'PLC-0373',
  (SELECT id FROM categories WHERE name = 'Placas de Carga'),
  70.2,
  117,
  9,
  1
);
INSERT INTO products (name, sku, category_id, cost_price, price, stock, store_id)
VALUES (
  'Placa Sub C20 com aro  (premium)',
  'PLC-0374',
  (SELECT id FROM categories WHERE name = 'Placas de Carga'),
  93.6,
  156,
  6,
  2
);
INSERT INTO products (name, sku, category_id, cost_price, price, stock, store_id)
VALUES (
  'Placa Sub K10 sem tv com aro',
  'PLC-0375',
  (SELECT id FROM categories WHERE name = 'Placas de Carga'),
  70.2,
  117,
  3,
  1
);
INSERT INTO products (name, sku, category_id, cost_price, price, stock, store_id)
VALUES (
  'Placa Sub C21y',
  'PLC-0376',
  (SELECT id FROM categories WHERE name = 'Placas de Carga'),
  62.4,
  104,
  3,
  2
);
INSERT INTO products (name, sku, category_id, cost_price, price, stock, store_id)
VALUES (
  'Placa Sub K10 2017 com aro',
  'PLC-0377',
  (SELECT id FROM categories WHERE name = 'Placas de Carga'),
  58.5,
  97.5,
  8,
  1
);
INSERT INTO products (name, sku, category_id, cost_price, price, stock, store_id)
VALUES (
  'Placa Sub C21y com aro (Premium)',
  'PLC-0378',
  (SELECT id FROM categories WHERE name = 'Placas de Carga'),
  85.8,
  143,
  5,
  2
);
INSERT INTO products (name, sku, category_id, cost_price, price, stock, store_id)
VALUES (
  'Placa Sub K10 power com aro',
  'PLC-0379',
  (SELECT id FROM categories WHERE name = 'Placas de Carga'),
  66.3,
  110.5,
  8,
  1
);
INSERT INTO products (name, sku, category_id, cost_price, price, stock, store_id)
VALUES (
  'Placa Sub C25',
  'PLC-0380',
  (SELECT id FROM categories WHERE name = 'Placas de Carga'),
  124.8,
  208,
  1,
  2
);
INSERT INTO products (name, sku, category_id, cost_price, price, stock, store_id)
VALUES (
  'Placa Sub K11+ com aro',
  'PLC-0381',
  (SELECT id FROM categories WHERE name = 'Placas de Carga'),
  66.3,
  110.5,
  5,
  1
);
INSERT INTO products (name, sku, category_id, cost_price, price, stock, store_id)
VALUES (
  'Placa Sub C25Y',
  'PLC-0382',
  (SELECT id FROM categories WHERE name = 'Placas de Carga'),
  58.5,
  97.5,
  1,
  2
);
INSERT INTO products (name, sku, category_id, cost_price, price, stock, store_id)
VALUES (
  'Placa Sub K12/K12+/k40',
  'PLC-0383',
  (SELECT id FROM categories WHERE name = 'Placas de Carga'),
  54.6,
  91,
  6,
  1
);
INSERT INTO products (name, sku, category_id, cost_price, price, stock, store_id)
VALUES (
  'Placa Sub C30',
  'PLC-0384',
  (SELECT id FROM categories WHERE name = 'Placas de Carga'),
  93.6,
  156,
  8,
  2
);
INSERT INTO products (name, sku, category_id, cost_price, price, stock, store_id)
VALUES (
  'Placa Sub K12/ K12+/ K40 com aro',
  'PLC-0385',
  (SELECT id FROM categories WHERE name = 'Placas de Carga'),
  81.9,
  136.5,
  8,
  1
);
INSERT INTO products (name, sku, category_id, cost_price, price, stock, store_id)
VALUES (
  'Placa Sub C30 com aro  (premium)',
  'PLC-0386',
  (SELECT id FROM categories WHERE name = 'Placas de Carga'),
  101.4,
  169,
  3,
  2
);
INSERT INTO products (name, sku, category_id, cost_price, price, stock, store_id)
VALUES (
  'Placa Sub K12 Max/K50/ k12 prime',
  'PLC-0387',
  (SELECT id FROM categories WHERE name = 'Placas de Carga'),
  54.6,
  91,
  3,
  1
);
INSERT INTO products (name, sku, category_id, cost_price, price, stock, store_id)
VALUES (
  'Placa Sub C30s',
  'PLC-0388',
  (SELECT id FROM categories WHERE name = 'Placas de Carga'),
  70.2,
  117,
  8,
  2
);
INSERT INTO products (name, sku, category_id, cost_price, price, stock, store_id)
VALUES (
  'Placa Sub K12 max/K50/ k12 prime com aro',
  'PLC-0389',
  (SELECT id FROM categories WHERE name = 'Placas de Carga'),
  85.8,
  143,
  6,
  1
);
INSERT INTO products (name, sku, category_id, cost_price, price, stock, store_id)
VALUES (
  'Placa Sub C30s com aro (premium)',
  'PLC-0390',
  (SELECT id FROM categories WHERE name = 'Placas de Carga'),
  89.7,
  149.5,
  9,
  2
);
INSERT INTO products (name, sku, category_id, cost_price, price, stock, store_id)
VALUES (
  'Placa Sub K22/K22+',
  'PLC-0391',
  (SELECT id FROM categories WHERE name = 'Placas de Carga'),
  54.6,
  91,
  4,
  1
);
INSERT INTO products (name, sku, category_id, cost_price, price, stock, store_id)
VALUES (
  'Placa Sub C33',
  'PLC-0392',
  (SELECT id FROM categories WHERE name = 'Placas de Carga'),
  58.5,
  97.5,
  10,
  2
);
INSERT INTO products (name, sku, category_id, cost_price, price, stock, store_id)
VALUES (
  'Placa Sub K22/K22+ com aro',
  'PLC-0393',
  (SELECT id FROM categories WHERE name = 'Placas de Carga'),
  66.3,
  110.5,
  9,
  1
);
INSERT INTO products (name, sku, category_id, cost_price, price, stock, store_id)
VALUES (
  'Placa Sub C35',
  'PLC-0394',
  (SELECT id FROM categories WHERE name = 'Placas de Carga'),
  54.6,
  91,
  2,
  2
);
INSERT INTO products (name, sku, category_id, cost_price, price, stock, store_id)
VALUES (
  'Placa Sub K40s',
  'PLC-0395',
  (SELECT id FROM categories WHERE name = 'Placas de Carga'),
  54.6,
  91,
  5,
  1
);
INSERT INTO products (name, sku, category_id, cost_price, price, stock, store_id)
VALUES (
  'Placa Sub C35 com aro',
  'PLC-0396',
  (SELECT id FROM categories WHERE name = 'Placas de Carga'),
  70.2,
  117,
  2,
  2
);
INSERT INTO products (name, sku, category_id, cost_price, price, stock, store_id)
VALUES (
  'Placa Sub K40s com aro',
  'PLC-0397',
  (SELECT id FROM categories WHERE name = 'Placas de Carga'),
  74.1,
  123.5,
  7,
  1
);
INSERT INTO products (name, sku, category_id, cost_price, price, stock, store_id)
VALUES (
  'Placa Sub C35 com aro (Premium)',
  'PLC-0398',
  (SELECT id FROM categories WHERE name = 'Placas de Carga'),
  89.7,
  149.5,
  5,
  2
);
INSERT INTO products (name, sku, category_id, cost_price, price, stock, store_id)
VALUES (
  'Placa Sub K41s',
  'PLC-0399',
  (SELECT id FROM categories WHERE name = 'Placas de Carga'),
  54.6,
  91,
  5,
  1
);
INSERT INTO products (name, sku, category_id, cost_price, price, stock, store_id)
VALUES (
  'Placa Sub C51/C53/Note 50',
  'PLC-0400',
  (SELECT id FROM categories WHERE name = 'Placas de Carga'),
  66.3,
  110.5,
  10,
  2
);
INSERT INTO products (name, sku, category_id, cost_price, price, stock, store_id)
VALUES (
  'Placa Sub K41s com aro',
  'PLC-0401',
  (SELECT id FROM categories WHERE name = 'Placas de Carga'),
  66.3,
  110.5,
  6,
  1
);
INSERT INTO products (name, sku, category_id, cost_price, price, stock, store_id)
VALUES (
  'Placa Sub C51 com aro (Premium)',
  'PLC-0402',
  (SELECT id FROM categories WHERE name = 'Placas de Carga'),
  93.6,
  156,
  3,
  2
);
INSERT INTO products (name, sku, category_id, cost_price, price, stock, store_id)
VALUES (
  'Placa Sub K42/k52/k62',
  'PLC-0403',
  (SELECT id FROM categories WHERE name = 'Placas de Carga'),
  62.4,
  104,
  9,
  1
);
INSERT INTO products (name, sku, category_id, cost_price, price, stock, store_id)
VALUES (
  'Placa Sub C53 com aro (Premium)',
  'PLC-0404',
  (SELECT id FROM categories WHERE name = 'Placas de Carga'),
  93.6,
  156,
  4,
  2
);
INSERT INTO products (name, sku, category_id, cost_price, price, stock, store_id)
VALUES (
  'Placa Sub K42/ K62 com aro',
  'PLC-0405',
  (SELECT id FROM categories WHERE name = 'Placas de Carga'),
  78,
  130,
  5,
  1
);
INSERT INTO products (name, sku, category_id, cost_price, price, stock, store_id)
VALUES (
  'Placa Sub C55 / C67',
  'PLC-0406',
  (SELECT id FROM categories WHERE name = 'Placas de Carga'),
  66.3,
  110.5,
  5,
  2
);
INSERT INTO products (name, sku, category_id, cost_price, price, stock, store_id)
VALUES (
  'Placa Sub K42/ K62 com aro (Premium)',
  'PLC-0407',
  (SELECT id FROM categories WHERE name = 'Placas de Carga'),
  97.5,
  162.5,
  6,
  1
);
INSERT INTO products (name, sku, category_id, cost_price, price, stock, store_id)
VALUES (
  'Placa Sub Note 50',
  'PLC-0408',
  (SELECT id FROM categories WHERE name = 'Placas de Carga'),
  78,
  130,
  4,
  2
);
INSERT INTO products (name, sku, category_id, cost_price, price, stock, store_id)
VALUES (
  'Placa Sub K50s',
  'PLC-0409',
  (SELECT id FROM categories WHERE name = 'Placas de Carga'),
  58.5,
  97.5,
  6,
  1
);
INSERT INTO products (name, sku, category_id, cost_price, price, stock, store_id)
VALUES (
  'Placa Sub K50s com aro',
  'PLC-0410',
  (SELECT id FROM categories WHERE name = 'Placas de Carga'),
  93.6,
  156,
  3,
  2
);
INSERT INTO products (name, sku, category_id, cost_price, price, stock, store_id)
VALUES (
  'Placa Sub K51',
  'PLC-0411',
  (SELECT id FROM categories WHERE name = 'Placas de Carga'),
  101.4,
  169,
  7,
  1
);
INSERT INTO products (name, sku, category_id, cost_price, price, stock, store_id)
VALUES (
  'Placa Sub Lenovo C2',
  'PLC-0412',
  (SELECT id FROM categories WHERE name = 'Placas de Carga'),
  62.4,
  104,
  2,
  2
);
INSERT INTO products (name, sku, category_id, cost_price, price, stock, store_id)
VALUES (
  'Placa Sub K51s',
  'PLC-0413',
  (SELECT id FROM categories WHERE name = 'Placas de Carga'),
  66.3,
  110.5,
  5,
  1
);
INSERT INTO products (name, sku, category_id, cost_price, price, stock, store_id)
VALUES (
  'Placa Sub Lenovo K5',
  'PLC-0414',
  (SELECT id FROM categories WHERE name = 'Placas de Carga'),
  62.4,
  104,
  8,
  2
);
INSERT INTO products (name, sku, category_id, cost_price, price, stock, store_id)
VALUES (
  'Placa Sub K51s com aro',
  'PLC-0415',
  (SELECT id FROM categories WHERE name = 'Placas de Carga'),
  89.7,
  149.5,
  9,
  1
);
INSERT INTO products (name, sku, category_id, cost_price, price, stock, store_id)
VALUES (
  'Placa Sub Lenovo K6',
  'PLC-0416',
  (SELECT id FROM categories WHERE name = 'Placas de Carga'),
  62.4,
  104,
  2,
  2
);
INSERT INTO products (name, sku, category_id, cost_price, price, stock, store_id)
VALUES (
  'Placa Sub K51s com aro  (Premium)',
  'PLC-0417',
  (SELECT id FROM categories WHERE name = 'Placas de Carga'),
  109.2,
  182,
  4,
  1
);
INSERT INTO products (name, sku, category_id, cost_price, price, stock, store_id)
VALUES (
  'Placa Sub K52 com aro',
  'PLC-0418',
  (SELECT id FROM categories WHERE name = 'Placas de Carga'),
  78,
  130,
  1,
  2
);
INSERT INTO products (name, sku, category_id, cost_price, price, stock, store_id)
VALUES (
  'Placa Sub K52 com aro (Premium)',
  'PLC-0419',
  (SELECT id FROM categories WHERE name = 'Placas de Carga'),
  101.4,
  169,
  7,
  1
);
INSERT INTO products (name, sku, category_id, cost_price, price, stock, store_id)
VALUES (
  'Placa Sub ZA550KL',
  'PLC-0420',
  (SELECT id FROM categories WHERE name = 'Placas de Carga'),
  78,
  130,
  7,
  2
);
INSERT INTO products (name, sku, category_id, cost_price, price, stock, store_id)
VALUES (
  'Placa Sub K61',
  'PLC-0421',
  (SELECT id FROM categories WHERE name = 'Placas de Carga'),
  66.3,
  110.5,
  4,
  1
);
INSERT INTO products (name, sku, category_id, cost_price, price, stock, store_id)
VALUES (
  'Placa Sub ZA550KL com aro',
  'PLC-0422',
  (SELECT id FROM categories WHERE name = 'Placas de Carga'),
  93.6,
  156,
  8,
  2
);
INSERT INTO products (name, sku, category_id, cost_price, price, stock, store_id)
VALUES (
  'Placa Sub K61 com aro',
  'PLC-0423',
  (SELECT id FROM categories WHERE name = 'Placas de Carga'),
  89.7,
  149.5,
  7,
  1
);
INSERT INTO products (name, sku, category_id, cost_price, price, stock, store_id)
VALUES (
  'Placa Sub ZB501KL',
  'PLC-0424',
  (SELECT id FROM categories WHERE name = 'Placas de Carga'),
  78,
  130,
  8,
  2
);
INSERT INTO products (name, sku, category_id, cost_price, price, stock, store_id)
VALUES (
  'Placa Sub K61 com aro (premium)',
  'PLC-0425',
  (SELECT id FROM categories WHERE name = 'Placas de Carga'),
  105.3,
  175.5,
  7,
  1
);
INSERT INTO products (name, sku, category_id, cost_price, price, stock, store_id)
VALUES (
  'Placa Sub ZB551KL',
  'PLC-0426',
  (SELECT id FROM categories WHERE name = 'Placas de Carga'),
  93.6,
  156,
  5,
  2
);
INSERT INTO products (name, sku, category_id, cost_price, price, stock, store_id)
VALUES (
  'Placa Sub K71',
  'PLC-0427',
  (SELECT id FROM categories WHERE name = 'Placas de Carga'),
  202.8,
  338,
  9,
  1
);
INSERT INTO products (name, sku, category_id, cost_price, price, stock, store_id)
VALUES (
  'Placa Sub ZB553KL',
  'PLC-0428',
  (SELECT id FROM categories WHERE name = 'Placas de Carga'),
  109.2,
  182,
  2,
  2
);
INSERT INTO products (name, sku, category_id, cost_price, price, stock, store_id)
VALUES (
  'Placa Sub K200',
  'PLC-0429',
  (SELECT id FROM categories WHERE name = 'Placas de Carga'),
  66.3,
  110.5,
  7,
  1
);
INSERT INTO products (name, sku, category_id, cost_price, price, stock, store_id)
VALUES (
  'Placa Sub ZB555KL com aro',
  'PLC-0430',
  (SELECT id FROM categories WHERE name = 'Placas de Carga'),
  97.5,
  162.5,
  5,
  2
);
INSERT INTO products (name, sku, category_id, cost_price, price, stock, store_id)
VALUES (
  'Placa Sub K220',
  'PLC-0431',
  (SELECT id FROM categories WHERE name = 'Placas de Carga'),
  70.2,
  117,
  4,
  1
);
INSERT INTO products (name, sku, category_id, cost_price, price, stock, store_id)
VALUES (
  'Placa Sub ZB570KL',
  'PLC-0432',
  (SELECT id FROM categories WHERE name = 'Placas de Carga'),
  93.6,
  156,
  3,
  2
);
INSERT INTO products (name, sku, category_id, cost_price, price, stock, store_id)
VALUES (
  'Placa Sub Q7',
  'PLC-0433',
  (SELECT id FROM categories WHERE name = 'Placas de Carga'),
  124.8,
  208,
  1,
  1
);
INSERT INTO products (name, sku, category_id, cost_price, price, stock, store_id)
VALUES (
  'Placa Sub ZB570TL',
  'PLC-0434',
  (SELECT id FROM categories WHERE name = 'Placas de Carga'),
  101.4,
  169,
  4,
  2
);
INSERT INTO products (name, sku, category_id, cost_price, price, stock, store_id)
VALUES (
  'Placa Sub ZB570TL com aro',
  'PLC-0435',
  (SELECT id FROM categories WHERE name = 'Placas de Carga'),
  117,
  195,
  5,
  1
);
INSERT INTO products (name, sku, category_id, cost_price, price, stock, store_id)
VALUES (
  'Placa Sub ZB601KL / ZB602KL',
  'PLC-0436',
  (SELECT id FROM categories WHERE name = 'Placas de Carga'),
  78,
  130,
  7,
  2
);
INSERT INTO products (name, sku, category_id, cost_price, price, stock, store_id)
VALUES (
  'Placa Sub ZB601KL / ZB602KL com aro',
  'PLC-0437',
  (SELECT id FROM categories WHERE name = 'Placas de Carga'),
  109.2,
  182,
  5,
  1
);
INSERT INTO products (name, sku, category_id, cost_price, price, stock, store_id)
VALUES (
  'Placa Sub ZB500KG',
  'PLC-0438',
  (SELECT id FROM categories WHERE name = 'Placas de Carga'),
  93.6,
  156,
  10,
  2
);
INSERT INTO products (name, sku, category_id, cost_price, price, stock, store_id)
VALUES (
  'Placa Sub Hot 10',
  'PLC-0439',
  (SELECT id FROM categories WHERE name = 'Placas de Carga'),
  78,
  130,
  8,
  1
);
INSERT INTO products (name, sku, category_id, cost_price, price, stock, store_id)
VALUES (
  'Placa Sub ZB631KL',
  'PLC-0440',
  (SELECT id FROM categories WHERE name = 'Placas de Carga'),
  85.8,
  143,
  6,
  2
);
INSERT INTO products (name, sku, category_id, cost_price, price, stock, store_id)
VALUES (
  'Placa Sub Hot 10s',
  'PLC-0441',
  (SELECT id FROM categories WHERE name = 'Placas de Carga'),
  89.7,
  149.5,
  6,
  1
);
INSERT INTO products (name, sku, category_id, cost_price, price, stock, store_id)
VALUES (
  'Placa Sub ZB634KL',
  'PLC-0442',
  (SELECT id FROM categories WHERE name = 'Placas de Carga'),
  78,
  130,
  7,
  2
);
INSERT INTO products (name, sku, category_id, cost_price, price, stock, store_id)
VALUES (
  'Placa Sub Hot 11',
  'PLC-0443',
  (SELECT id FROM categories WHERE name = 'Placas de Carga'),
  70.2,
  117,
  8,
  1
);
INSERT INTO products (name, sku, category_id, cost_price, price, stock, store_id)
VALUES (
  'Placa Sub ZB634KL com aro',
  'PLC-0444',
  (SELECT id FROM categories WHERE name = 'Placas de Carga'),
  109.2,
  182,
  5,
  2
);
INSERT INTO products (name, sku, category_id, cost_price, price, stock, store_id)
VALUES (
  'Placa Sub Hot 11s',
  'PLC-0445',
  (SELECT id FROM categories WHERE name = 'Placas de Carga'),
  105.3,
  175.5,
  7,
  1
);
INSERT INTO products (name, sku, category_id, cost_price, price, stock, store_id)
VALUES (
  'Placa Sub ZC520TL',
  'PLC-0446',
  (SELECT id FROM categories WHERE name = 'Placas de Carga'),
  117,
  195,
  8,
  2
);
INSERT INTO products (name, sku, category_id, cost_price, price, stock, store_id)
VALUES (
  'Placa Sub Hot 11 play',
  'PLC-0447',
  (SELECT id FROM categories WHERE name = 'Placas de Carga'),
  70.2,
  117,
  8,
  1
);
INSERT INTO products (name, sku, category_id, cost_price, price, stock, store_id)
VALUES (
  'Placa Sub ZC600KL',
  'PLC-0448',
  (SELECT id FROM categories WHERE name = 'Placas de Carga'),
  105.3,
  175.5,
  3,
  2
);
INSERT INTO products (name, sku, category_id, cost_price, price, stock, store_id)
VALUES (
  'Placa Sub Hot 9',
  'PLC-0449',
  (SELECT id FROM categories WHERE name = 'Placas de Carga'),
  85.8,
  143,
  8,
  1
);
INSERT INTO products (name, sku, category_id, cost_price, price, stock, store_id)
VALUES (
  'Placa Sub ZC553KL',
  'PLC-0450',
  (SELECT id FROM categories WHERE name = 'Placas de Carga'),
  101.4,
  169,
  3,
  2
);
INSERT INTO products (name, sku, category_id, cost_price, price, stock, store_id)
VALUES (
  'Placa Sub Hot 20i',
  'PLC-0451',
  (SELECT id FROM categories WHERE name = 'Placas de Carga'),
  101.4,
  169,
  10,
  1
);
INSERT INTO products (name, sku, category_id, cost_price, price, stock, store_id)
VALUES (
  'Placa Sub ZC554KL',
  'PLC-0452',
  (SELECT id FROM categories WHERE name = 'Placas de Carga'),
  117,
  195,
  1,
  2
);
INSERT INTO products (name, sku, category_id, cost_price, price, stock, store_id)
VALUES (
  'Placa Sub Note 10 pró',
  'PLC-0453',
  (SELECT id FROM categories WHERE name = 'Placas de Carga'),
  78,
  130,
  10,
  1
);
INSERT INTO products (name, sku, category_id, cost_price, price, stock, store_id)
VALUES (
  'Placa Sub ZC554KL com aro',
  'PLC-0454',
  (SELECT id FROM categories WHERE name = 'Placas de Carga'),
  148.2,
  247,
  1,
  2
);
INSERT INTO products (name, sku, category_id, cost_price, price, stock, store_id)
VALUES (
  'Placa Sub Note 8i',
  'PLC-0455',
  (SELECT id FROM categories WHERE name = 'Placas de Carga'),
  97.5,
  162.5,
  5,
  1
);
INSERT INTO products (name, sku, category_id, cost_price, price, stock, store_id)
VALUES (
  'Placa Sub ZC520KL',
  'PLC-0456',
  (SELECT id FROM categories WHERE name = 'Placas de Carga'),
  101.4,
  169,
  1,
  2
);
INSERT INTO products (name, sku, category_id, cost_price, price, stock, store_id)
VALUES (
  'Placa Sub ZD551KL',
  'PLC-0457',
  (SELECT id FROM categories WHERE name = 'Placas de Carga'),
  101.4,
  169,
  6,
  1
);
INSERT INTO products (name, sku, category_id, cost_price, price, stock, store_id)
VALUES (
  'Placa Sub ZD552KL',
  'PLC-0458',
  (SELECT id FROM categories WHERE name = 'Placas de Carga'),
  140.4,
  234,
  10,
  2
);
INSERT INTO products (name, sku, category_id, cost_price, price, stock, store_id)
VALUES (
  'Placa Sub ZD553KL',
  'PLC-0459',
  (SELECT id FROM categories WHERE name = 'Placas de Carga'),
  109.2,
  182,
  1,
  1
);
INSERT INTO products (name, sku, category_id, cost_price, price, stock, store_id)
VALUES (
  'Placa Sub ZE552KL',
  'PLC-0460',
  (SELECT id FROM categories WHERE name = 'Placas de Carga'),
  109.2,
  182,
  3,
  2
);
INSERT INTO products (name, sku, category_id, cost_price, price, stock, store_id)
VALUES (
  'Placa Sub ZE554KL com aro',
  'PLC-0461',
  (SELECT id FROM categories WHERE name = 'Placas de Carga'),
  148.2,
  247,
  7,
  1
);
INSERT INTO products (name, sku, category_id, cost_price, price, stock, store_id)
VALUES (
  'Placa Sub ZE620KL',
  'PLC-0462',
  (SELECT id FROM categories WHERE name = 'Placas de Carga'),
  140.4,
  234,
  3,
  2
);
INSERT INTO products (name, sku, category_id, cost_price, price, stock, store_id)
VALUES (
  'Placa Sub ZE630KL',
  'PLC-0463',
  (SELECT id FROM categories WHERE name = 'Placas de Carga'),
  171.6,
  286,
  8,
  1
);
INSERT INTO products (name, sku, category_id, cost_price, price, stock, store_id)
VALUES (
  'Placa Sub Alcatel 5051',
  'PLC-0464',
  (SELECT id FROM categories WHERE name = 'Placas de Carga'),
  93.6,
  156,
  10,
  2
);
INSERT INTO products (name, sku, category_id, cost_price, price, stock, store_id)
VALUES (
  'Placa Sub Alcatel 9008J',
  'PLC-0465',
  (SELECT id FROM categories WHERE name = 'Placas de Carga'),
  93.6,
  156,
  10,
  1
);
INSERT INTO products (name, sku, category_id, cost_price, price, stock, store_id)
VALUES (
  'Placa Sub C20 com aro (premium)',
  'PLC-0466',
  (SELECT id FROM categories WHERE name = 'Placas de Carga'),
  93.6,
  156,
  4,
  2
);
INSERT INTO products (name, sku, category_id, cost_price, price, stock, store_id)
VALUES (
  'Placa Sub K10 tv',
  'PLC-0467',
  (SELECT id FROM categories WHERE name = 'Placas de Carga'),
  36,
  60,
  10,
  1
);
INSERT INTO products (name, sku, category_id, cost_price, price, stock, store_id)
VALUES (
  'Placa Sub K10 sem tv',
  'PLC-0468',
  (SELECT id FROM categories WHERE name = 'Placas de Carga'),
  36,
  60,
  4,
  2
);
INSERT INTO products (name, sku, category_id, cost_price, price, stock, store_id)
VALUES (
  'Placa Sub C21y com aro (premium)',
  'PLC-0469',
  (SELECT id FROM categories WHERE name = 'Placas de Carga'),
  85.8,
  143,
  5,
  1
);
INSERT INTO products (name, sku, category_id, cost_price, price, stock, store_id)
VALUES (
  'Placa Sub k10 power com aro',
  'PLC-0470',
  (SELECT id FROM categories WHERE name = 'Placas de Carga'),
  66.3,
  110.5,
  10,
  2
);
INSERT INTO products (name, sku, category_id, cost_price, price, stock, store_id)
VALUES (
  'Placa Sub k11+ com aro',
  'PLC-0471',
  (SELECT id FROM categories WHERE name = 'Placas de Carga'),
  58.5,
  97.5,
  2,
  1
);
INSERT INTO products (name, sku, category_id, cost_price, price, stock, store_id)
VALUES (
  'Placa Sub C25y',
  'PLC-0472',
  (SELECT id FROM categories WHERE name = 'Placas de Carga'),
  58.5,
  97.5,
  6,
  2
);
INSERT INTO products (name, sku, category_id, cost_price, price, stock, store_id)
VALUES (
  'Placa Sub k12/ k12+/ k40',
  'PLC-0473',
  (SELECT id FROM categories WHERE name = 'Placas de Carga'),
  54.6,
  91,
  4,
  1
);
INSERT INTO products (name, sku, category_id, cost_price, price, stock, store_id)
VALUES (
  'Placa Sub K12 / K12+ / K40 com aro',
  'PLC-0474',
  (SELECT id FROM categories WHERE name = 'Placas de Carga'),
  74.1,
  123.5,
  3,
  2
);
INSERT INTO products (name, sku, category_id, cost_price, price, stock, store_id)
VALUES (
  'Placa Sub k22/ k22+',
  'PLC-0475',
  (SELECT id FROM categories WHERE name = 'Placas de Carga'),
  54.6,
  91,
  9,
  1
);
INSERT INTO products (name, sku, category_id, cost_price, price, stock, store_id)
VALUES (
  'Placa Sub k22/ k22+ com aro',
  'PLC-0476',
  (SELECT id FROM categories WHERE name = 'Placas de Carga'),
  66.3,
  110.5,
  2,
  2
);
INSERT INTO products (name, sku, category_id, cost_price, price, stock, store_id)
VALUES (
  'Placa Sub C35 com aro (premium)',
  'PLC-0477',
  (SELECT id FROM categories WHERE name = 'Placas de Carga'),
  89.7,
  149.5,
  8,
  1
);
INSERT INTO products (name, sku, category_id, cost_price, price, stock, store_id)
VALUES (
  'Placa Sub K42/k52//k62',
  'PLC-0478',
  (SELECT id FROM categories WHERE name = 'Placas de Carga'),
  58.5,
  97.5,
  6,
  2
);
INSERT INTO products (name, sku, category_id, cost_price, price, stock, store_id)
VALUES (
  'Placa Sub C51 / note 50 com aro (premium)',
  'PLC-0479',
  (SELECT id FROM categories WHERE name = 'Placas de Carga'),
  81.9,
  136.5,
  2,
  1
);
INSERT INTO products (name, sku, category_id, cost_price, price, stock, store_id)
VALUES (
  'Placa Sub k42/k62 com aro',
  'PLC-0480',
  (SELECT id FROM categories WHERE name = 'Placas de Carga'),
  78,
  130,
  1,
  2
);
INSERT INTO products (name, sku, category_id, cost_price, price, stock, store_id)
VALUES (
  'Placa Sub C53 com aro (premium)',
  'PLC-0481',
  (SELECT id FROM categories WHERE name = 'Placas de Carga'),
  70.2,
  117,
  1,
  1
);
INSERT INTO products (name, sku, category_id, cost_price, price, stock, store_id)
VALUES (
  'Placa Sub C55/C67',
  'PLC-0482',
  (SELECT id FROM categories WHERE name = 'Placas de Carga'),
  66.3,
  110.5,
  4,
  2
);
INSERT INTO products (name, sku, category_id, cost_price, price, stock, store_id)
VALUES (
  'Placa Sub C61 / C63 / Note 60',
  'PLC-0483',
  (SELECT id FROM categories WHERE name = 'Placas de Carga'),
  62.4,
  104,
  10,
  1
);
INSERT INTO products (name, sku, category_id, cost_price, price, stock, store_id)
VALUES (
  'Placa Sub C61 com aro',
  'PLC-0484',
  (SELECT id FROM categories WHERE name = 'Placas de Carga'),
  78,
  130,
  8,
  2
);
INSERT INTO products (name, sku, category_id, cost_price, price, stock, store_id)
VALUES (
  'Placa Sub C61 com aro (Premium)',
  'PLC-0485',
  (SELECT id FROM categories WHERE name = 'Placas de Carga'),
  93.6,
  156,
  4,
  1
);
INSERT INTO products (name, sku, category_id, cost_price, price, stock, store_id)
VALUES (
  'Placa Sub C67 com aro',
  'PLC-0486',
  (SELECT id FROM categories WHERE name = 'Placas de Carga'),
  89.7,
  149.5,
  2,
  2
);
INSERT INTO products (name, sku, category_id, cost_price, price, stock, store_id)
VALUES (
  'Placa Sub K51s com aro (premium)',
  'PLC-0487',
  (SELECT id FROM categories WHERE name = 'Placas de Carga'),
  109.2,
  182,
  3,
  1
);
INSERT INTO products (name, sku, category_id, cost_price, price, stock, store_id)
VALUES (
  'Placa Sub K61 com aro (Premium)',
  'PLC-0488',
  (SELECT id FROM categories WHERE name = 'Placas de Carga'),
  105.3,
  175.5,
  2,
  2
);
INSERT INTO products (name, sku, category_id, cost_price, price, stock, store_id)
VALUES (
  'Placa Sub ZA550KL COM ARO',
  'PLC-0489',
  (SELECT id FROM categories WHERE name = 'Placas de Carga'),
  78,
  130,
  6,
  1
);
INSERT INTO products (name, sku, category_id, cost_price, price, stock, store_id)
VALUES (
  'Placa Sub Hot 9 play (X680 / X680B)',
  'PLC-0490',
  (SELECT id FROM categories WHERE name = 'Placas de Carga'),
  85.8,
  143,
  3,
  2
);
INSERT INTO products (name, sku, category_id, cost_price, price, stock, store_id)
VALUES (
  'Placa Sub Hot 11 / Hot 10s / Hot 10T (X689F)',
  'PLC-0491',
  (SELECT id FROM categories WHERE name = 'Placas de Carga'),
  70.2,
  117,
  4,
  1
);
INSERT INTO products (name, sku, category_id, cost_price, price, stock, store_id)
VALUES (
  'Placa Sub Hot 11 (X689F)',
  'PLC-0492',
  (SELECT id FROM categories WHERE name = 'Placas de Carga'),
  70.2,
  117,
  1,
  2
);
INSERT INTO products (name, sku, category_id, cost_price, price, stock, store_id)
VALUES (
  'Placa Sub Hot 11s com aro',
  'PLC-0493',
  (SELECT id FROM categories WHERE name = 'Placas de Carga'),
  117,
  195,
  3,
  1
);
INSERT INTO products (name, sku, category_id, cost_price, price, stock, store_id)
VALUES (
  'Placa Sub Hot 10 play / Hot 11 play',
  'PLC-0494',
  (SELECT id FROM categories WHERE name = 'Placas de Carga'),
  62.4,
  104,
  1,
  2
);
INSERT INTO products (name, sku, category_id, cost_price, price, stock, store_id)
VALUES (
  'Placa Sub ZB601KL/ZB602KL',
  'PLC-0495',
  (SELECT id FROM categories WHERE name = 'Placas de Carga'),
  66.3,
  110.5,
  5,
  1
);
INSERT INTO products (name, sku, category_id, cost_price, price, stock, store_id)
VALUES (
  'Placa Sub Hot 12  (X6817) / Hot 12 play (X6818) / Hot 20 play',
  'PLC-0496',
  (SELECT id FROM categories WHERE name = 'Placas de Carga'),
  74.1,
  123.5,
  5,
  2
);
INSERT INTO products (name, sku, category_id, cost_price, price, stock, store_id)
VALUES (
  'Placa Sub ZB601/ ZB602kl com aro',
  'PLC-0497',
  (SELECT id FROM categories WHERE name = 'Placas de Carga'),
  85.8,
  143,
  5,
  1
);
INSERT INTO products (name, sku, category_id, cost_price, price, stock, store_id)
VALUES (
  'Placa Sub Hot 20 5g',
  'PLC-0498',
  (SELECT id FROM categories WHERE name = 'Placas de Carga'),
  78,
  130,
  6,
  2
);
INSERT INTO products (name, sku, category_id, cost_price, price, stock, store_id)
VALUES (
  'Placa Sub ZB631Kl',
  'PLC-0499',
  (SELECT id FROM categories WHERE name = 'Placas de Carga'),
  78,
  130,
  3,
  1
);
INSERT INTO products (name, sku, category_id, cost_price, price, stock, store_id)
VALUES (
  'Placa Sub Hot 30i',
  'PLC-0500',
  (SELECT id FROM categories WHERE name = 'Placas de Carga'),
  78,
  130,
  5,
  2
);
INSERT INTO products (name, sku, category_id, cost_price, price, stock, store_id)
VALUES (
  'Placa Sub Hot 40i',
  'PLC-0501',
  (SELECT id FROM categories WHERE name = 'Placas de Carga'),
  66.3,
  110.5,
  7,
  1
);
INSERT INTO products (name, sku, category_id, cost_price, price, stock, store_id)
VALUES (
  'Placa Sub Hot 50i',
  'PLC-0502',
  (SELECT id FROM categories WHERE name = 'Placas de Carga'),
  78,
  130,
  9,
  2
);
INSERT INTO products (name, sku, category_id, cost_price, price, stock, store_id)
VALUES (
  'Placa Sub Note 10 pró (X695)',
  'PLC-0503',
  (SELECT id FROM categories WHERE name = 'Placas de Carga'),
  93.6,
  156,
  3,
  1
);
INSERT INTO products (name, sku, category_id, cost_price, price, stock, store_id)
VALUES (
  'Placa Sub Note 11 / Note 12/ Note 12 pro incell (X676B)',
  'PLC-0504',
  (SELECT id FROM categories WHERE name = 'Placas de Carga'),
  85.8,
  143,
  9,
  2
);
INSERT INTO products (name, sku, category_id, cost_price, price, stock, store_id)
VALUES (
  'Placa Sub Note 11/ note 12/ note 12 pro oled (X676B)',
  'PLC-0505',
  (SELECT id FROM categories WHERE name = 'Placas de Carga'),
  163.8,
  273,
  9,
  1
);
INSERT INTO products (name, sku, category_id, cost_price, price, stock, store_id)
VALUES (
  'Placa Sub Note 11 pro (X697)',
  'PLC-0506',
  (SELECT id FROM categories WHERE name = 'Placas de Carga'),
  93.6,
  156,
  4,
  2
);
INSERT INTO products (name, sku, category_id, cost_price, price, stock, store_id)
VALUES (
  'Placa Sub Note 30 5g',
  'PLC-0507',
  (SELECT id FROM categories WHERE name = 'Placas de Carga'),
  93.6,
  156,
  5,
  1
);
INSERT INTO products (name, sku, category_id, cost_price, price, stock, store_id)
VALUES (
  'Placa Sub Note 40 5g',
  'PLC-0508',
  (SELECT id FROM categories WHERE name = 'Placas de Carga'),
  109.2,
  182,
  9,
  2
);
INSERT INTO products (name, sku, category_id, cost_price, price, stock, store_id)
VALUES (
  'Placa Sub Smart 6',
  'PLC-0509',
  (SELECT id FROM categories WHERE name = 'Placas de Carga'),
  62.4,
  104,
  10,
  1
);
INSERT INTO products (name, sku, category_id, cost_price, price, stock, store_id)
VALUES (
  'Placa Sub Smart 7',
  'PLC-0510',
  (SELECT id FROM categories WHERE name = 'Placas de Carga'),
  58.5,
  97.5,
  5,
  2
);
INSERT INTO products (name, sku, category_id, cost_price, price, stock, store_id)
VALUES (
  'Placa Sub ZE553KL',
  'PLC-0511',
  (SELECT id FROM categories WHERE name = 'Placas de Carga'),
  117,
  195,
  2,
  1
);
INSERT INTO products (name, sku, category_id, cost_price, price, stock, store_id)
VALUES (
  'Placa Sub Smart 8 pro',
  'PLC-0512',
  (SELECT id FROM categories WHERE name = 'Placas de Carga'),
  74.1,
  123.5,
  7,
  2
);
INSERT INTO products (name, sku, category_id, cost_price, price, stock, store_id)
VALUES (
  'Placa Sub Smart 9',
  'PLC-0513',
  (SELECT id FROM categories WHERE name = 'Placas de Carga'),
  70.2,
  117,
  9,
  1
);
INSERT INTO products (name, sku, category_id, cost_price, price, stock, store_id)
VALUES (
  'Placa Sub ZE620KL/ ZS620KL',
  'PLC-0514',
  (SELECT id FROM categories WHERE name = 'Placas de Carga'),
  101.4,
  169,
  2,
  2
);
INSERT INTO products (name, sku, category_id, cost_price, price, stock, store_id)
VALUES (
  'Placa Sub ZE630KL com aro',
  'PLC-0515',
  (SELECT id FROM categories WHERE name = 'Placas de Carga'),
  163.8,
  273,
  2,
  1
);
INSERT INTO products (name, sku, category_id, cost_price, price, stock, store_id)
VALUES (
  'Placa Sub Nokia 1.3',
  'PLC-0516',
  (SELECT id FROM categories WHERE name = 'Placas de Carga'),
  70.2,
  117,
  10,
  2
);
INSERT INTO products (name, sku, category_id, cost_price, price, stock, store_id)
VALUES (
  'Placa Sub Nokia 1.4',
  'PLC-0517',
  (SELECT id FROM categories WHERE name = 'Placas de Carga'),
  58.5,
  97.5,
  2,
  1
);
INSERT INTO products (name, sku, category_id, cost_price, price, stock, store_id)
VALUES (
  'Placa Sub Nokia 2.2',
  'PLC-0518',
  (SELECT id FROM categories WHERE name = 'Placas de Carga'),
  58.5,
  97.5,
  4,
  2
);
INSERT INTO products (name, sku, category_id, cost_price, price, stock, store_id)
VALUES (
  'Placa Sub Nokia 2.3',
  'PLC-0519',
  (SELECT id FROM categories WHERE name = 'Placas de Carga'),
  58.5,
  97.5,
  5,
  1
);
INSERT INTO products (name, sku, category_id, cost_price, price, stock, store_id)
VALUES (
  'Placa Sub Nokia 2.4',
  'PLC-0520',
  (SELECT id FROM categories WHERE name = 'Placas de Carga'),
  58.5,
  97.5,
  8,
  2
);
INSERT INTO products (name, sku, category_id, cost_price, price, stock, store_id)
VALUES (
  'Placa Sub Nokia 4.2',
  'PLC-0521',
  (SELECT id FROM categories WHERE name = 'Placas de Carga'),
  58.5,
  97.5,
  9,
  1
);
INSERT INTO products (name, sku, category_id, cost_price, price, stock, store_id)
VALUES (
  'Placa Sub Nokia 5.3',
  'PLC-0522',
  (SELECT id FROM categories WHERE name = 'Placas de Carga'),
  62.4,
  104,
  8,
  2
);
INSERT INTO products (name, sku, category_id, cost_price, price, stock, store_id)
VALUES (
  'Placa Sub Nokia 5.4',
  'PLC-0523',
  (SELECT id FROM categories WHERE name = 'Placas de Carga'),
  70.2,
  117,
  4,
  1
);
INSERT INTO products (name, sku, category_id, cost_price, price, stock, store_id)
VALUES (
  'Placa Sub Nokia 6.1',
  'PLC-0524',
  (SELECT id FROM categories WHERE name = 'Placas de Carga'),
  62.4,
  104,
  8,
  2
);
INSERT INTO products (name, sku, category_id, cost_price, price, stock, store_id)
VALUES (
  'Placa Sub Nokia C01 Plus',
  'PLC-0525',
  (SELECT id FROM categories WHERE name = 'Placas de Carga'),
  54.6,
  91,
  5,
  1
);
INSERT INTO products (name, sku, category_id, cost_price, price, stock, store_id)
VALUES (
  'Placa Sub Nokia C20',
  'PLC-0526',
  (SELECT id FROM categories WHERE name = 'Placas de Carga'),
  58.5,
  97.5,
  6,
  2
);
INSERT INTO products (name, sku, category_id, cost_price, price, stock, store_id)
VALUES (
  'Placa Sub Nokia C21 Plus',
  'PLC-0527',
  (SELECT id FROM categories WHERE name = 'Placas de Carga'),
  66.3,
  110.5,
  3,
  1
);
INSERT INTO products (name, sku, category_id, cost_price, price, stock, store_id)
VALUES (
  'Placa Sub Nokia C30',
  'PLC-0528',
  (SELECT id FROM categories WHERE name = 'Placas de Carga'),
  66.3,
  110.5,
  5,
  2
);
INSERT INTO products (name, sku, category_id, cost_price, price, stock, store_id)
VALUES (
  'Placa Sub Nokia G11 plus',
  'PLC-0529',
  (SELECT id FROM categories WHERE name = 'Placas de Carga'),
  66.3,
  110.5,
  7,
  1
);
INSERT INTO products (name, sku, category_id, cost_price, price, stock, store_id)
VALUES (
  'Placa Sub Nokia G21',
  'PLC-0530',
  (SELECT id FROM categories WHERE name = 'Placas de Carga'),
  70.2,
  117,
  1,
  2
);
INSERT INTO products (name, sku, category_id, cost_price, price, stock, store_id)
VALUES (
  'Placa Sub Nokia G50',
  'PLC-0531',
  (SELECT id FROM categories WHERE name = 'Placas de Carga'),
  58.5,
  97.5,
  2,
  1
);
INSERT INTO products (name, sku, category_id, cost_price, price, stock, store_id)
VALUES (
  'Placa Sub Nokia X10',
  'PLC-0532',
  (SELECT id FROM categories WHERE name = 'Placas de Carga'),
  58.5,
  97.5,
  8,
  2
);

-- Verificar inserção
SELECT 
  COUNT(*) as total_placas,
  store_id,
  s.name as loja_nome
FROM products p
JOIN stores s ON p.store_id = s.id
JOIN categories c ON p.category_id = c.id
WHERE c.name = 'Placas de Carga'
GROUP BY store_id, s.name
ORDER BY store_id;
