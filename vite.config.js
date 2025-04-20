// vite.config.js
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  define: {
    global: {}, //
  },
  server: {
    host: true,
    allowedHosts: [
      '058c-2804-1b3-a943-e595-80d6-7e33-a288-2eda.ngrok-free.app'
    ]
  }
});
