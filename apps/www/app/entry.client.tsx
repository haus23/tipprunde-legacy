import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { RouterProvider, createBrowserRouter } from 'react-router';

import { Logo } from './components/brand/logo';
import { ThemeProvider } from './utils/theme';

import { AppErrorBoundary, ErrorBoundary } from './routes/_error';
import Layout from './routes/_layout';
import { layoutLoader } from './routes/_layout.data';
import { rootLoader } from './routes/_root.data';
import MatchesRoute from './routes/matches/_route';
import { matchesLoader } from './routes/matches/_route.data';
import PlayersRoute from './routes/players/_route';
import { playersLoader } from './routes/players/_route.data';
import TablesRoute from './routes/tables/_route';
import { tablesLoader } from './routes/tables/_route.data';

import './styles/tailwind.css';
import { MatchesErrorBoundary } from './routes/matches/_route.error';
import { PlayersErrorBoundary } from './routes/players/_route.error';
import { redirectLegacyRoute } from './utils/app/redirect-legacy-route';

const container = document.getElementById('root');
if (!container) throw Error('Missing root element!');

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
    hydrateFallbackElement: <Logo className="translate-y-[180px]" />,
    children: [
      {
        id: 'master',
        path: ':championshipId?',
        loader: layoutLoader(queryClient),
        errorElement: <AppErrorBoundary />,
        children: [
          {
            index: true,
            loader: tablesLoader(queryClient),
            element: <TablesRoute />,
            handle: { viewPath: '' },
          },
          {
            path: 'spieler',
            loader: playersLoader(queryClient),
            element: <PlayersRoute />,
            errorElement: <PlayersErrorBoundary />,
            handle: { viewPath: 'spieler' },
          },
          {
            path: 'spiel',
            loader: matchesLoader(queryClient),
            element: <MatchesRoute />,
            errorElement: <MatchesErrorBoundary />,
            handle: { viewPath: 'spiel' },
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
        <RouterProvider router={router} />
      </QueryClientProvider>
    </ThemeProvider>
  </StrictMode>,
);
