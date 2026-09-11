import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['icons/icon.svg'],
      manifest: {
        name: 'BackBenchers Academy',
        short_name: 'BackBenchers',
        description: 'မြန်မာ KG–12 အခမဲ့ 3D သင်ယူရေး',
        lang: 'my',
        theme_color: '#0b1020',
        background_color: '#0b1020',
        display: 'standalone',
        icons: [{ src: 'icons/icon.svg', sizes: 'any', type: 'image/svg+xml', purpose: 'any' }],
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,svg,woff2}'],
        maximumFileSizeToCacheInBytes: 8_000_000,
        runtimeCaching: [
          { urlPattern: ({ url }) => url.pathname.startsWith('/data/'), handler: 'StaleWhileRevalidate', options: { cacheName: 'data' } },
          { urlPattern: ({ url }) => url.hostname.endsWith('gstatic.com') || url.hostname.endsWith('googleapis.com'), handler: 'CacheFirst', options: { cacheName: 'fonts', expiration: { maxEntries: 10, maxAgeSeconds: 60 * 60 * 24 * 365 } } },
        ],
      },
    }),
  ],
  server: {
    proxy: Object.fromEntries(['edu4mm.com', 'books.learnbig.net', 'resources.mmoe.myanmarexam.org'].map((h) => [
      `/proxy/${h}`, { target: `${h.startsWith('resources.') ? 'http' : 'https'}://${h}`, changeOrigin: true, rewrite: (p: string) => p.replace(`/proxy/${h}`, '') },
    ])),
  },
  build: { chunkSizeWarningLimit: 1600 },
})
