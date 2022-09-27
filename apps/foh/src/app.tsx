import { Suspense } from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { Provider } from 'jotai';
import { SplashScreen } from 'ui';

import appRoutes from './app.routes';
const router = createBrowserRouter(appRoutes);

function App() {
  return (
    <Provider>
      <Suspense fallback={<SplashScreen />}>
        <RouterProvider router={router} />
      </Suspense>
    </Provider>
  );
}

export default App;
