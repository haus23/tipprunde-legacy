import { auth } from 'lib';
import { Suspense, useState } from 'react';
import { Toaster } from 'react-hot-toast';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { useSetRecoilState } from 'recoil';
import { SplashScreen } from 'ui-legacy';

import appRoutes from './app.routes';
import { authState } from './state/auth-state';

const router = createBrowserRouter(appRoutes, {
  future: {
    v7_fetcherPersist: true,
    v7_normalizeFormMethod: true,
    v7_partialHydration: true,
    v7_relativeSplatPath: true,
    v7_skipActionErrorRevalidation: true,
  },
});

export default function App() {
  const [isAuthenticated, setAuthenticated] = useState(false);
  const setAuthState = useSetRecoilState(authState);

  auth.onAuthStateChanged((user) => {
    setAuthState(
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
  });

  return isAuthenticated ? (
    <Suspense fallback={<SplashScreen />}>
      <Toaster containerClassName="-mt-2" position="top-right" />
      <RouterProvider router={router} future={{ v7_startTransition: true }} />
    </Suspense>
  ) : null;
}
