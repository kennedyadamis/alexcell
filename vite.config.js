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
        servicos: resolve(__dirname, 'servicos.html'),
        os: resolve(__dirname, 'os.html'),
        sobre: resolve(__dirname, 'sobre.html'),
        contato: resolve(__dirname, 'contato.html'),
      },
    },
  },
}) 