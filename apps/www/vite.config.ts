import tailwindcss from '@tailwindcss/vite';
import {
  type Config,
  TanStackRouterVite as tanstackRouter,
} from '@tanstack/router-plugin/vite';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

const routerConfig = {
  target: 'react',
  autoCodeSplitting: true,
  routesDirectory: './app/routes',
  generatedRouteTree: './app/routeTree.gen.ts',
} satisfies Partial<Config>;

export default defineConfig({
  plugins: [tanstackRouter(routerConfig), react(), tailwindcss()],
  build: {
    rolldownOptions: {
      output: {
        codeSplitting: {
          groups: [
            {
              name: 'rac',
              test: /node_modules[\\/]react-aria(?:-components)?[\\/]/,
            },
          ],
        },
      },
    },
  },
});
