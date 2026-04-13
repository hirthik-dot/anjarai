import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    // Disable automatic <link rel="modulepreload"> injection
    modulePreload: { polyfill: false },

    // Raise chunk size warning to reduce noise (not a hard limit)
    chunkSizeWarningLimit: 600,

    rollupOptions: {
      output: {
        // Manual chunking: split vendor libs into separate cacheable files
        manualChunks(id) {
          // React core — tiny, cached long-term
          if (id.includes('node_modules/react/') || id.includes('node_modules/react-dom/')) {
            return 'react-vendor'
          }
          // React Router
          if (id.includes('node_modules/react-router')) {
            return 'router'
          }
          // Razorpay (loaded only on checkout)
          if (id.includes('razorpay')) {
            return 'razorpay'
          }
          // All other node_modules → shared vendor chunk
          if (id.includes('node_modules')) {
            return 'vendor'
          }
        },
      },
    },
  },
})
