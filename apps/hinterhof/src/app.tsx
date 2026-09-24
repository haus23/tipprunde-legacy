import { Suspense } from 'react';
import { Toaster } from 'react-hot-toast';
import { createBrowserRouter } from 'react-router';
import { RouterProvider } from 'react-router/dom';
import { SplashScreen } from 'ui-legacy';
import { type BootstrapPhase, useBootstrap } from './app.bootstrap';
import appRoutes from './app.routes';

const router = createBrowserRouter(appRoutes);

const bootstrapMessages: Record<Exclude<BootstrapPhase, 'ready'>, string> = {
  auth: 'Prüfe Anmeldung ...',
  'master-data': 'Lade Stammdaten ...',
  'current-data': 'Lade Daten des Turniers ...',
};

export default function App() {
  const bootstrapPhase = useBootstrap();

  return bootstrapPhase === 'ready' ? (
    <Suspense fallback={<SplashScreen />}>
      <Toaster containerClassName="-mt-2" position="top-right" />
      <RouterProvider router={router} />
    </Suspense>
  ) : (
    <SplashScreen message={bootstrapMessages[bootstrapPhase]} />
  );
}
