import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  build: {
    // Raise warning threshold — we handle it via manual chunks
    chunkSizeWarningLimit: 600,
    rollupOptions: {
      output: {
        // Split vendor libraries into their own cacheable chunk
        manualChunks: {
          'vendor-react':  ['react', 'react-dom', 'react-router-dom'],
          'vendor-motion': ['motion'],
          'vendor-gsap':   ['gsap', '@gsap/react'],
          'vendor-misc':   ['lucide-react', 'react-helmet-async', 'lenis'],
        },
      },
    },
  },
})

