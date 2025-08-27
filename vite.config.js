import { defineConfig } from 'vite'
import { resolve } from 'path'

export default defineConfig({
  server: {
    host: '0.0.0.0', // Permite acesso de qualquer IP na rede
    port: 5174,      // Define uma porta específica
    open: true,      // Abre automaticamente no navegador
  },
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        auth: resolve(__dirname, 'auth.html'),
        dashboard: resolve(__dirname, 'dashboard.html'),
        servicos: resolve(__dirname, 'servicos.html'),
        sobre: resolve(__dirname, 'sobre.html'),
        contato: resolve(__dirname, 'contato.html'),
        'consultar-os': resolve(__dirname, 'consultar-os.html'),
        'store-selector': resolve(__dirname, 'store-selector.html'),
        'print-cash-template': resolve(__dirname, 'print-cash-template.html'),
        'print-template': resolve(__dirname, 'print-template.html'),
        'print-warranty-template': resolve(__dirname, 'print-warranty-template.html'),
        'pattern-lock-local': resolve(__dirname, 'pattern-lock-local.js'),
      },
    },
    assetsInclude: ['**/*.png', '**/*.jpg', '**/*.jpeg', '**/*.gif', '**/*.svg'],
    copyPublicDir: true,
  },
  publicDir: 'logos',
})