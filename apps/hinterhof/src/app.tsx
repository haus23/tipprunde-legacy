import { auth } from 'lib';
import { Suspense, useEffect, useState } from 'react';
import { Toaster } from 'react-hot-toast';
import { createBrowserRouter } from 'react-router';
import { RouterProvider } from 'react-router/dom';
import { SplashScreen } from 'ui-legacy';

import appRoutes from './app.routes';
import { useSessionStore } from './state/session-store';

const router = createBrowserRouter(appRoutes);

export default function App() {
  const [isAuthenticated, setAuthenticated] = useState(false);
  const setProfile = useSessionStore((state) => state.setProfile);

  useEffect(
    () =>
      auth.onAuthStateChanged((user) => {
        setProfile(
          user !== null
            ? {
                uid: user.uid,
                email: user.email,
                displayName: user.displayName,
                photoURL: user.photoURL,
              }
            : null,
        );
        setAuthenticated(true);
      }),
    [setProfile],
  );

  return isAuthenticated ? (
    <Suspense fallback={<SplashScreen />}>
      <Toaster containerClassName="-mt-2" position="top-right" />
      <RouterProvider router={router} />
    </Suspense>
  ) : null;
}
