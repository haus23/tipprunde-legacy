import { defineConfig } from 'vite';

import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import tsconfigPaths from 'vite-tsconfig-paths';

export default defineConfig({
  build: {
    sourcemap: true,
    rollupOptions: {
      output: {
        manualChunks: {
          router: ['react-router'],
        },
      },
    },
  },
  plugins: [react(), tailwindcss(), tsconfigPaths()],
});
