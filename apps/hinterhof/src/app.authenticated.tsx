import { Suspense, useEffect } from 'react';
import { Toaster } from 'react-hot-toast';
import { createBrowserRouter } from 'react-router';
import { RouterProvider } from 'react-router/dom';
import { SplashScreen } from 'ui-legacy';

import { resetCurrentData } from '#/state/current-data-store';
import { resetMasterData } from '#/state/master-data-store';
import createAppRoutes from './app.routes';

const router = createBrowserRouter(createAppRoutes());

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
      <Toaster containerClassName="-mt-2" position="top-right" />
      <Suspense fallback={<SplashScreen message="Lade Stammdaten ..." />}>
        <RouterProvider router={router} />
      </Suspense>
    </>
  );
}
