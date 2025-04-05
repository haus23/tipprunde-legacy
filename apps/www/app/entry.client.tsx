import { ConvexAuthProvider } from '@convex-dev/auth/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { RouterProvider, createRouter } from '@tanstack/react-router';
import { ConvexReactClient } from 'convex/react';
import { createRoot } from 'react-dom/client';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 30,
    },
  },
});
const convexClient = new ConvexReactClient(import.meta.env.VITE_CONVEX_URL);

import { routeTree } from './routeTree.gen';
const router = createRouter({
  routeTree,
  scrollRestoration: true,
  scrollRestorationBehavior: 'smooth',
  getScrollRestorationKey: (location) => location.pathname,
  context: { queryClient },
});

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}

const container = document.getElementById('root');
if (!container) throw Error('Missing root element!');

createRoot(container).render(
  <ConvexAuthProvider client={convexClient}>
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
    </QueryClientProvider>
  </ConvexAuthProvider>,
);
