import { Suspense } from 'react';

// React Query
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
export const queryClient = new QueryClient({
  defaultOptions: { queries: { suspense: true, staleTime: Infinity } },
});

// React Router
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { appRoutes } from './app.routes';
import SplashScreen from '@/components/brand/splash-screen';
import { darkModeQuery, setDarkClass } from './utils/dark-mode';
const router = createBrowserRouter(appRoutes);

function App() {
  const theme = localStorage.getItem('theme') || 'system';
  const isSystemDark = darkModeQuery.matches;
  const darkMode = (theme === 'system' && isSystemDark) || theme === 'dark';
  setDarkClass(darkMode);

  return (
    <Suspense fallback={<SplashScreen />}>
      <QueryClientProvider client={queryClient}>
        <RouterProvider router={router} />
        <ReactQueryDevtools initialIsOpen={false} />
      </QueryClientProvider>
    </Suspense>
  );
}

export default App;
