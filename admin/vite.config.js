import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  // Use /admin/ for production (Vercel monorepo) but / for local dev
  base: process.env.NODE_ENV === 'production' ? '/admin/' : '/',
  server: {
    port: 5174,
  },
})
