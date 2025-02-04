import { RouterProvider, createBrowserRouter } from 'react-router';

import { useAuth } from './utils/state/auth';

import { LoginScreen } from './components/screens/login-screen';
import { SplashScreen } from './components/screens/splash-screen';

import AppShell from './routes/app-shell';
import DashboardRoute from './routes/dashboard';
import ProfileRoute from './routes/profile';

export const router = createBrowserRouter([
  {
    element: <AppShell />,
    children: [
      { index: true, element: <DashboardRoute /> },
      {
        path: 'turniere',
        lazy: () => import('./routes/master-data/championships/_route'),
      },
      {
        path: 'spieler',
        lazy: () => import('./routes/master-data/players/_route'),
      },
      {
        path: 'teams',
        lazy: () => import('./routes/master-data/teams/_route'),
      },
      { path: 'profil', element: <ProfileRoute /> },
    ],
  },
]);

export default function App() {
  const auth = useAuth();

  if (!auth.isAuthenticated) {
    return <SplashScreen />;
  }

  if (auth.user === null) {
    return <LoginScreen />;
  }

  return <RouterProvider router={router} />;
}
