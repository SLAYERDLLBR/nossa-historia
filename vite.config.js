import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // Em produção no GitHub Pages, usa o nome do repo como base path
  // Defina VITE_BASE_PATH no workflow ou use '/' para deploy raiz
  const base = process.env.VITE_BASE_PATH || '/nossa-trilha-sonora/';

  return {
    base,
    plugins: [
      react(),
      VitePWA({
        registerType: 'autoUpdate',
        includeAssets: ['favicon.ico', 'favicon.svg', 'apple-touch-icon.png', 'masked-icon.svg'],
        manifest: {
          name: 'Nossa Trilha Sonora',
          short_name: 'Nossa Trilha',
          description: 'Uma experiência interativa do nosso amor.',
          theme_color: '#050505',
          background_color: '#050505',
          display: 'standalone',
          start_url: base,
          scope: base,
          icons: [
            {
              src: 'pwa-192x192.png',
              sizes: '192x192',
              type: 'image/png'
            },
            {
              src: 'pwa-512x512.png',
              sizes: '512x512',
              type: 'image/png'
            }
          ]
        }
      })
    ],
    server: {
      host: true, // Expõe na rede local (0.0.0.0)
    },
    preview: {
      host: true,
    },
    build: {
      // Otimizações de produção
      target: 'es2020',
      rollupOptions: {
        output: {
          // Divisão de chunks para carregamento mais rápido em mobile
          manualChunks(id) {
            if (id.includes('node_modules/react-dom') || id.includes('node_modules/react/')) {
              return 'vendor-react';
            }
            if (id.includes('node_modules/framer-motion')) {
              return 'vendor-motion';
            }
            if (id.includes('node_modules/date-fns') || id.includes('node_modules/localforage') || id.includes('node_modules/react-qr-code')) {
              return 'vendor-utils';
            }
          },
        },
      },
      // Reportar tamanho dos chunks comprimidos
      reportCompressedSize: true,
      // Aumentar limite de warning de chunk
      chunkSizeWarningLimit: 800,
    },
  };
})
