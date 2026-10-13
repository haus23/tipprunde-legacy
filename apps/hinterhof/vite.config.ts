import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import { cn } from 'cn/vite';

import { defineConfig } from 'vite';

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    cn({ content: ['src/**/*.{ts,tsx}'], out: 'src/utils/cn-tables.ts' }),
  ],
});
