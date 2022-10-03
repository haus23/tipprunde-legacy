/// <reference types="vitest" />
/// <reference types="vite/client" />

import { fileURLToPath } from 'url';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          lib: ['lib'],
        },
      },
    },
  },
  // Vitest
  test: {
    environment: 'jsdom',
  },
});
