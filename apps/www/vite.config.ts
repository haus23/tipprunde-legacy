import { defineConfig } from 'vite';

import tailwindcss from '@tailwindcss/vite';
import {
  type Config,
  TanStackRouterVite as tanstackRouter,
} from '@tanstack/router-plugin/vite';
import react from '@vitejs/plugin-react';
import tsconfigPaths from 'vite-tsconfig-paths';

const routerConfig = {
  target: 'react',
  autoCodeSplitting: true,
  routesDirectory: './app/routes',
  generatedRouteTree: './app/routeTree.gen.ts',
} satisfies Partial<Config>;

export default defineConfig({
  plugins: [
    tanstackRouter(routerConfig),
    react(),
    tailwindcss(),
    tsconfigPaths(),
  ],
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          rac: ['react-aria', 'react-aria-components'],
        },
      },
    },
  },
});
