import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    // Disable automatic <link rel="modulepreload"> injection.
    // Vite injects preload hints for ALL lazy chunks at startup which causes
    // hundreds of "preloaded but not used within a few seconds" console warnings
    // because each chunk belongs to a different route that isn't rendered yet.
    modulePreload: { polyfill: false },
  },
})

