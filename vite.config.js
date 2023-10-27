// vite.config.js
import { defineConfig } from 'vite';

export default defineConfig({
  // Other Vite configurations...

  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:5000', // Example API server URL
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ''), // Remove /api from the request path
      },
    },
  },
});
