import path from "path"
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      manifest: false, // usamos o public/manifest.json já criado
      includeAssets: ['icon-192.png', 'icon-512.png', 'icon-maskable-512.png', 'favicon.png'],
      workbox: {
        // Garante que o app sempre busca dados atualizados do Supabase
        // (nunca serve respostas de API antigas do cache).
        runtimeCaching: [],
        navigateFallbackDenylist: [/^\/rest\//],
      },
    }),
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
})
