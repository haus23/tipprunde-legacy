import { Suspense } from 'react';
import { ReactLocation, Router } from '@tanstack/react-location';

import { Provider } from 'jotai';
import { SplashScreen } from 'ui';

import appRoutes from './app.routes';
const location = new ReactLocation();

function App() {
  return (
    <Provider>
      <Suspense fallback={<SplashScreen />}>
        <Router location={location} routes={appRoutes} />
      </Suspense>
    </Provider>
  );
}

export default App;
