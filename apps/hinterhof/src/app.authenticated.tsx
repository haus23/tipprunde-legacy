import { Suspense, useEffect, useState } from 'react';
import { Toaster } from 'react-hot-toast';
import { createBrowserRouter } from 'react-router';
import { RouterProvider } from 'react-router/dom';
import { SplashScreen } from 'ui-legacy';

import appRoutes from './app.routes';

export default function AuthenticatedApp() {
  const [router] = useState(() => createBrowserRouter(appRoutes));

  useEffect(() => () => router.dispose(), [router]);

  return (
    <>
      <Toaster containerClassName="-mt-2" position="top-right" />
      <Suspense fallback={<SplashScreen message="Lade Stammdaten ..." />}>
        <RouterProvider router={router} />
      </Suspense>
    </>
  );
}
