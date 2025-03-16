import { ConvexAuthProvider } from '@convex-dev/auth/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ConvexReactClient } from 'convex/react';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { RouterProvider, createBrowserRouter } from 'react-router';

import { SplashScreen } from './components/brand/splash-screen';
import { ThemeProvider } from './utils/theme';

import { AppErrorBoundary, ErrorBoundary } from './routes/_error';
import Layout from './routes/_layout';
import { layoutLoader } from './routes/_layout.data';
import { rootLoader } from './routes/_root.data';
import { matchesLoader } from './routes/matches/_route.data';
import { playersLoader } from './routes/players/_route.data';
import { tablesLoader } from './routes/tables/_route.data';
import { redirectLegacyRoute } from './utils/app/redirect-legacy-route';

import './styles/tailwind.css';

const container = document.getElementById('root');
if (!container) throw Error('Missing root element!');

const convexClient = new ConvexReactClient(import.meta.env.VITE_CONVEX_URL);

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 60,
    },
  },
});

const router = createBrowserRouter([
  {
    id: 'root',
    loader: rootLoader(queryClient),
    element: <Layout />,
    errorElement: <ErrorBoundary />,
    hydrateFallbackElement: <SplashScreen />,
    children: [
      {
        id: 'master',
        path: ':championshipId?',
        loader: layoutLoader(queryClient),
        errorElement: <AppErrorBoundary />,
        children: [
          {
            index: true,
            handle: { viewPath: '' },
            loader: tablesLoader(queryClient),
            lazy: () => import('./routes/tables/_route'),
          },
          {
            path: 'spieler',
            handle: { viewPath: 'spieler' },
            loader: playersLoader(queryClient),
            lazy: () => import('./routes/players/_route'),
          },
          {
            path: 'spiel',
            handle: { viewPath: 'spiel' },
            loader: matchesLoader(queryClient),
            lazy: () => import('./routes/matches/_route'),
          },
          {
            path: 'login',
            lazy: () => import('./routes/auth/login'),
          },
          {
            path: 'login/code',
            lazy: () => import('./routes/auth/otp'),
          },
          {
            path: 'tipps',
            children: [
              { path: 'spieler', loader: redirectLegacyRoute, element: null },
              { path: 'spiel', loader: redirectLegacyRoute, element: null },
            ],
          },
        ],
      },
    ],
  },
]);

createRoot(container).render(
  <StrictMode>
    <ThemeProvider>
      <QueryClientProvider client={queryClient}>
        <ConvexAuthProvider client={convexClient}>
          <RouterProvider router={router} />
        </ConvexAuthProvider>
      </QueryClientProvider>
    </ThemeProvider>
  </StrictMode>,
);
