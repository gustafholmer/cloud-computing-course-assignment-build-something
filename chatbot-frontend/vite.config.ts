// vite.config.ts
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: 'http://backend-service.default.svc.cluster.local:5000', // Adjust this to your backend port
        changeOrigin: true,
      },
    },
  },
});
