import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

// https://vite.dev/config/
export default defineConfig({
  // 이 부분이 가장 중요합니다. 앱의 기본 경로를 설정합니다.
  base: "/doldol/",

  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.ico', 'apple-touch-icon.png', 'masked-icon.svg'],
      manifest: {
        name: '돌돌 - 재미있는 가챠로 결정하세요!',
        short_name: '돌돌',
        description: '선택의 순간, 재미있는 가챠로 결정하세요!',
        theme_color: '#FF6B6B',
        background_color: '#F7F7F7',
        display: 'standalone',
        orientation: 'portrait',
        // 이 부분도 중요합니다. PWA의 작동 범위를 앱의 기본 경로와 일치시킵니다.
        scope: '/doldol/',
        start_url: '/doldol/',
        categories: ['entertainment', 'utilities'],
        lang: 'ko',
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
          },
          {
            src: 'pwa-512x512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any maskable'
          }
        ]
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg,json,vue,txt,woff2}'],
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/fonts\.googleapis\.com\/.*/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'google-fonts-cache',
              expiration: {
                maxEntries: 10,
                maxAgeSeconds: 60 * 60 * 24 * 365 // 1년
              },
            }
          }
        ]
      }
    })
  ],
})