// vite.config.js
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      // Proxy Open Library API
      '/ol': {
        target: 'https://openlibrary.org',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/ol/, ''),
        secure: true,
      },
      // Optional: proxy covers too (not required for <img>, but handy)
      '/covers': {
        target: 'https://covers.openlibrary.org',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/covers/, ''),
        secure: true,
      },
    },
  },
})
