import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { createRouter, RouterProvider } from '@tanstack/react-router';
import { createRoot } from 'react-dom/client';

// Data counts as stale right away: pages show cached data and refetch it
// in the background, e.g. when the window gets focus again. The route
// loaders take cached data as is (staleTime: 'static'), so navigating
// to a page seen before is instant.
export const queryClient = new QueryClient();

import { ErrorComponent } from './components/app/error';
import { LoadingView } from './components/app/loading';
import { routeTree } from './routeTree.gen';

const router = createRouter({
  defaultPreload: 'intent',
  routeTree,
  scrollRestoration: true,
  scrollRestorationBehavior: 'smooth',
  getScrollRestorationKey: (location) => location.pathname,
  context: { queryClient },
  defaultErrorComponent: ErrorComponent,
  // Pages render inside the app shell, so a quiet hint is enough there
  defaultPendingComponent: LoadingView,
});

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}

const container = document.getElementById('root');
if (!container) throw Error('Missing root element!');

createRoot(container).render(
  <QueryClientProvider client={queryClient}>
    <RouterProvider router={router} />
  </QueryClientProvider>,
);
