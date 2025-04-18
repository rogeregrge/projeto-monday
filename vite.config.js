// vite.config.js
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    host: true, // permite acesso externo
    allowedHosts: [
      '058c-2804-1b3-a943-e595-80d6-7e33-a288-2eda.ngrok-free.app'
    ]
  }
});
