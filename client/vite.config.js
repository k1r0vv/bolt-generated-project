import { defineConfig } from 'vite';
    import react from '@vitejs/plugin-react';

    export default defineConfig({
      plugins: [react()],
      server: {
        port: 4567,
        proxy: {
          '/api': {
            target: process.env.VITE_API_URL || 'http://localhost:3000',
            changeOrigin: true
          }
        }
      },
      build: {
        outDir: 'dist',
        sourcemap: false,
        rollupOptions: {
          output: {
            manualChunks: {
              vendor: ['react', 'react-dom', '@mui/material', 'recharts'],
              ui: ['@emotion/react', '@emotion/styled']
            }
          }
        }
      }
    });
