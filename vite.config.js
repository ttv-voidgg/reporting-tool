import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],

  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:5000', // Example API server URL
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ''), // Remove /api from the request path
      },
    },
  },
    
})
