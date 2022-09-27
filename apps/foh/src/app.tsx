import { ReactLocation, Router } from '@tanstack/react-location';
import { appRoutes, LocationGenerics } from './app.routes';

const location = new ReactLocation<LocationGenerics>();

function App() {
  return <Router location={location} routes={appRoutes} />;
}

export default App;
