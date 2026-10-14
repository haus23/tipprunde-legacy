import { Suspense, useEffect } from 'react';
import { type DefaultToastOptions, Toaster } from 'react-hot-toast';
import { createBrowserRouter } from 'react-router';
import { RouterProvider } from 'react-router/dom';

import SplashScreen from '#/components/splash-screen';
import { resetCurrentData } from '#/state/current-data-store';
import { resetMasterData } from '#/state/master-data-store';
import createAppRoutes from './app.routes';

const router = createBrowserRouter(createAppRoutes());

// Toasts set inline styles, so the theme tokens go in as CSS variables.
const toastOptions: DefaultToastOptions = {
  style: {
    background: 'var(--popover)',
    color: 'var(--popover-foreground)',
    border: '1px solid var(--border)',
    borderRadius: 'var(--radius)',
    boxShadow: '0 4px 12px rgb(0 0 0 / 0.08)',
    fontSize: '0.875rem',
  },
  success: {
    iconTheme: {
      primary: 'var(--primary)',
      secondary: 'var(--primary-foreground)',
    },
  },
  error: {
    duration: 6000,
    iconTheme: {
      primary: 'var(--destructive)',
      secondary: 'var(--primary-foreground)',
    },
  },
  loading: {
    iconTheme: { primary: 'var(--primary)', secondary: 'var(--border)' },
  },
};

export default function AuthenticatedApp() {
  useEffect(
    () => () => {
      resetCurrentData();
      resetMasterData();
    },
    [],
  );

  return (
    <>
      <Toaster
        containerClassName="-mt-2"
        position="top-right"
        toastOptions={toastOptions}
      />
      <Suspense fallback={<SplashScreen message="Lade Stammdaten ..." />}>
        <RouterProvider router={router} />
      </Suspense>
    </>
  );
}
