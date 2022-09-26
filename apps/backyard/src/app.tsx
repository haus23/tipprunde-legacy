import { Suspense } from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';

import { Toaster } from 'react-hot-toast';

import { SplashScreen } from 'ui';

import appRoutes from './app.routes';
const router = createBrowserRouter(appRoutes);

export default function App() {
  return (
    <Suspense fallback={<SplashScreen />}>
      <Toaster containerClassName="-mt-2" position="top-right" />
      <RouterProvider router={router} />
    </Suspense>
  );
}
