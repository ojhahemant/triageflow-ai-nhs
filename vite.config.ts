import path from 'path';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  server: {
    port: 3000,
    host: '0.0.0.0',
    proxy: {
      // Proxy API requests to avoid CORS issues in development
      '/api': {
        target: 'http://localhost:3001',
        changeOrigin: true,
        configure: (proxy, options) => {
          // Fallback for local development without backend
          proxy.on('error', (err, req, res) => {
            console.log('Proxy error - using mock response');
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({
              summary: 'Mock AI response - backend not running',
              urgencyRecommendation: 'Routine',
              suggestedPathway: 'Routine Clinic',
              safetyAlerts: []
            }));
          });
        }
      }
    }
  },
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, '.'),
    }
  }
});
