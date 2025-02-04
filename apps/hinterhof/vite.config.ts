import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import tsconfigPaths from 'vite-tsconfig-paths';

import { defineConfig } from 'vite';

export default defineConfig({
  plugins: [react(), tailwindcss(), tsconfigPaths()],
  build: {
    rollupOptions: {
      output: {
        manualChunks: (id) => {
          if (id.includes('@radix-ui/')) {
            return 'radix-ui';
          }
          if (/firebase\/(app|auth|firestore)/.test(id)) {
            return 'firebase';
          }
          return null;
        },
      },
    },
  },
});
