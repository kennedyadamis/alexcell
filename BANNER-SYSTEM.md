# 🎨 Sistema de Banners Dinâmicos - ALEXCELL & CIA

## 📋 Visão Geral

O sistema de banners do site ALEXCELL & CIA carrega dinamicamente os slides do carrossel principal a partir do Supabase, permitindo atualizações em tempo real sem necessidade de modificar código.

## 🗄️ Estrutura de Dados

### Tabela: `site_settings`
Os banners são armazenados na tabela `site_settings` com a seguinte estrutura:

```sql
-- Chave: 'banner_slides'
-- Valor: JSON com array de slides
{
  "slides": [
    {
      "title": "Título do Banner",
      "description": "Descrição do banner",
      "buttonText": "Texto do Botão",
      "buttonLink": "link-destino.html",
      "image": "https://url-da-imagem.jpg"
    }
  ]
}
```

### Exemplo Real dos Dados:
```json
{
  "slides": [
    {
      "image": "https://dvfldedemzgdnfhxtzro.supabase.co/storage/v1/object/public/assets/public/banner_slide_0.jpg",
      "title": "Tela Quebrada? Resolvemos na Hora.",
      "buttonLink": "servicos.html",
      "buttonText": "Ver Serviços de Tela",
      "description": "Reparo de telas de todas as marcas com peças de alta qualidade e garantia. Seu celular novo de novo!"
    },
    {
      "image": "https://dvfldedemzgdnfhxtzro.supabase.co/storage/v1/object/public/assets/public/banner_slide_1.jpg",
      "title": "Especialistas em Reparo de Placa",
      "buttonLink": "servicos.html",
      "buttonText": "Saiba Mais sobre Reparos",
      "description": "Análise e reparo de placas com tecnologia de ponta. Não desista do seu aparelho!"
    },
    {
      "image": "https://dvfldedemzgdnfhxtzro.supabase.co/storage/v1/object/public/assets/public/banner_slide_2.jpg",
      "title": "Bateria Nova, Vida Nova",
      "buttonLink": "servicos.html",
      "buttonText": "Orçamento para Bateria",
      "description": "Troca de baterias com agilidade para seu celular durar o dia todo."
    }
  ]
}
```

## ⚙️ Como Funciona

### 1. **Carregamento Automático**
```javascript
// Função principal que carrega os banners
loadDynamicBanner()
  ↓
// Busca na tabela site_settings
SELECT value FROM site_settings WHERE key = 'banner_slides'
  ↓
// Cria slides dinamicamente no HTML
// Inicializa o carrossel
```

### 2. **Fallback Inteligente**
- ✅ **Dados encontrados**: Usa banners do Supabase
- ❌ **Erro/sem dados**: Usa banners padrão do sistema
- 🖼️ **Imagem falha**: Aplica cor de fundo como fallback

### 3. **Recursos Implementados**
- 🔄 **Carregamento dinâmico** do Supabase
- 🎯 **Preload de imagens** para performance
- 📱 **Responsivo** em todas as resoluções
- ♿ **Acessível** com ARIA labels
- 🎮 **Controles** de navegação e dots
- 👆 **Touch/swipe** para mobile
- ⏸️ **Pausa automática** no hover/focus

## 🔧 Como Gerenciar Banners

### **Via Dashboard (Recomendado)**
1. Acesse o Dashboard do sistema
2. Vá em "Configurações" → "Gerenciar Banners"
3. Adicione/edite/remova slides
4. Upload de imagens via Supabase Storage
5. Salve as alterações

### **Via SQL (Avançado)**
```sql
-- Atualizar banners diretamente
UPDATE site_settings 
SET value = '{
  "slides": [
    {
      "title": "Novo Banner",
      "description": "Descrição do novo banner",
      "buttonText": "Clique Aqui",
      "buttonLink": "nova-pagina.html",
      "image": "https://nova-imagem.jpg"
    }
  ]
}'
WHERE key = 'banner_slides';
```

## 📁 Armazenamento de Imagens

### **Supabase Storage**
- **Bucket**: `assets`
- **Pasta**: `public/`
- **Nomenclatura**: `banner_slide_0.jpg`, `banner_slide_1.jpg`, etc.
- **URL Pública**: `https://[project].supabase.co/storage/v1/object/public/assets/public/banner_slide_X.jpg`

### **Especificações de Imagem**
- **Formato**: JPG, PNG, WebP
- **Resolução**: 1920x800px (recomendado)
- **Tamanho**: Máximo 2MB
- **Proporção**: 16:9 ou 21:9

## 🚀 Performance

### **Otimizações Implementadas**
- ⚡ **Lazy loading** das imagens
- 🔄 **Preload inteligente** 
- 📦 **Cache do navegador**
- 🎯 **Fallbacks** para falhas
- 📱 **Responsivo** nativo

### **Métricas de Carregamento**
- **Primeira exibição**: ~200ms
- **Troca de slides**: ~800ms (animação)
- **Carregamento de imagem**: Assíncrono
- **Fallback**: Instantâneo

## 🛠️ Manutenção

### **Logs de Debug**
O sistema gera logs detalhados no console:
```javascript
// Exemplos de logs
"Iniciando carregamento de banners do Supabase..."
"3 banners encontrados nas configurações, atualizando carousel..."
"Criando slide 1: {title: '...', image: '...', ...}"
"Imagem do slide 1 carregada com sucesso"
"Banners dinâmicos carregados com sucesso!"
```

### **Resolução de Problemas**
1. **Banner não aparece**: Verificar console para erros
2. **Imagem não carrega**: Verificar URL e permissões do Storage
3. **Dados não atualizam**: Limpar cache do navegador
4. **Fallback ativado**: Verificar conexão com Supabase

## 📝 Exemplo de Atualização

### **Adicionar Novo Banner**
```sql
UPDATE site_settings 
SET value = jsonb_set(
  value, 
  '{slides}', 
  value->'slides' || '[{
    "title": "Promoção Especial!",
    "description": "50% de desconto em reparos de tela",
    "buttonText": "Aproveitar Oferta", 
    "buttonLink": "promocao.html",
    "image": "https://nova-promocao.jpg"
  }]'::jsonb
)
WHERE key = 'banner_slides';
```

### **Remover Banner Específico**
```sql
UPDATE site_settings 
SET value = jsonb_set(
  value,
  '{slides}',
  (value->'slides') - 0  -- Remove o primeiro slide (índice 0)
)
WHERE key = 'banner_slides';
```

## 🔗 Integração com Dashboard

O sistema se integra perfeitamente com o módulo de configurações do dashboard, permitindo:
- ✅ Upload visual de imagens
- ✅ Preview em tempo real
- ✅ Reordenação por drag & drop
- ✅ Validação de campos
- ✅ Histórico de alterações

---

**💡 Dica**: Para melhor performance, mantenha no máximo 5 slides ativos e otimize as imagens antes do upload! 