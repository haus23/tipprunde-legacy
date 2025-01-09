import { Suspense, useState } from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { useSetRecoilState } from 'recoil';

import { auth } from 'lib';
import { SplashScreen } from 'ui';

import appRoutes from './app.routes';
import { authState } from './state/auth-state';
const router = createBrowserRouter(appRoutes);

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
        : null
    );
    setAuthenticated(true);
  });

  return isAuthenticated ? (
    <Suspense fallback={<SplashScreen />}>
      <Toaster containerClassName="-mt-2" position="top-right" />
      <RouterProvider router={router} />
    </Suspense>
  ) : null;
}
