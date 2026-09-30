import { Suspense, useEffect, useState } from 'react';
import { Toaster } from 'react-hot-toast';
import { createBrowserRouter } from 'react-router';
import { RouterProvider } from 'react-router/dom';
import { SplashScreen } from 'ui-legacy';

import {
  type DataBootstrapPhase,
  useDataBootstrap,
} from './app.data-bootstrap';
import appRoutes from './app.routes';

const bootstrapMessages: Record<
  Exclude<DataBootstrapPhase, 'ready'>,
  string
> = {
  'master-data': 'Lade Stammdaten ...',
  'current-data': 'Lade Turnier ...',
};

export default function AuthenticatedApp() {
  const [router] = useState(() => createBrowserRouter(appRoutes));
  const bootstrapPhase = useDataBootstrap();

  useEffect(() => () => router.dispose(), [router]);

  return bootstrapPhase === 'ready' ? (
    <Suspense fallback={<SplashScreen message="Lade Ansicht ..." />}>
      <Toaster containerClassName="-mt-2" position="top-right" />
      <RouterProvider router={router} />
    </Suspense>
  ) : (
    <SplashScreen message={bootstrapMessages[bootstrapPhase]} />
  );
}
