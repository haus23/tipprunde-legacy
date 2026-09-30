import { lazy, Suspense } from 'react';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router';
import { SplashScreen } from 'ui-legacy';

import { useSessionStore } from '#/state/session-store';
import Login from './app/login';
import { useAuthBootstrap } from './app.auth-bootstrap';

const AuthenticatedApp = lazy(() => import('./app.authenticated'));

function UnauthenticatedApp() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default function App() {
  const isAuthResolved = useAuthBootstrap();
  const profile = useSessionStore((state) => state.profile);

  if (!isAuthResolved) {
    return <SplashScreen message="Prüfe Anmeldung ..." />;
  }

  return profile ? (
    <Suspense fallback={<SplashScreen message="Lade Anwendung ..." />}>
      <AuthenticatedApp />
    </Suspense>
  ) : (
    <UnauthenticatedApp />
  );
}
