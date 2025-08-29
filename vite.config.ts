import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  css: {
    postcss: './postcss.config.js'
  },
  server: {
    proxy: {
      // Proxy /api requests to your backend
      '/api': {
        target: 'http://localhost:5000', // Your backend's URL
        changeOrigin: true, // Needed for virtual hosted sites
        rewrite: (path) => path.replace(/^\/api/, '/api'), // Rewrite path if needed, but often not for /api
      }
    }
  }
});
