import tailwindcss from '@tailwindcss/vite';
import {
  type Config,
  TanStackRouterVite as tanstackRouter,
} from '@tanstack/router-plugin/vite';
import react from '@vitejs/plugin-react';
import { cn } from 'cn/vite';
import { defineConfig } from 'vite';

import { version } from './package.json';

const routerConfig = {
  target: 'react',
  autoCodeSplitting: true,
  routesDirectory: './app/routes',
  generatedRouteTree: './app/routeTree.gen.ts',
} satisfies Partial<Config>;

export default defineConfig({
  define: {
    'import.meta.env.VITE_APP_VERSION': JSON.stringify(version),
  },
  plugins: [
    tanstackRouter(routerConfig),
    react(),
    tailwindcss(),
    cn({ content: ['app/**/*.{ts,tsx}'], out: 'app/utils/cn-tables.ts' }),
  ],
});
