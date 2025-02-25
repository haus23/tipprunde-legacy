import { RouterProvider, createBrowserRouter } from 'react-router';

import { useAuth } from './utils/state/auth';

import { LoginScreen } from './components/screens/login-screen';
import { SplashScreen } from './components/screens/splash-screen';

import AppShell from './routes/app-shell';
import { loader } from './routes/app-shell.loader';
import DashboardRoute from './routes/dashboard';
import ProfileRoute from './routes/profile';

export const router = createBrowserRouter([
  {
    element: <AppShell />,
    loader: loader,
    shouldRevalidate: () => false,
    hydrateFallbackElement: <SplashScreen />,
    handle: {
      title: 'Hinterhof',
    },
    children: [
      {
        index: true,
        element: <DashboardRoute />,
        handle: {
          title: 'Dashboard',
        },
      },
      {
        path: ':championshipId',
        handle: { title: '$championshipId$' },
        children: [
          {
            path: '',
            lazy: () => import('./routes/current-data/current-data'),
          },
          {
            path: 'spiele',
            lazy: () => import('./routes/current-data/matches/_route'),
            handle: {
              title: 'Spiele',
            },
          },
          {
            path: 'ergebnisse',
            lazy: () => import('./routes/current-data/results/_route'),
            handle: {
              title: 'Ergebnisse',
            },
          },
        ],
      },
      {
        path: 'stammdaten',
        handle: {
          title: 'Stammdaten',
        },
        children: [
          {
            path: '',
            lazy: () => import('./routes/master-data/master-data'),
          },
          {
            path: 'turniere',
            lazy: () => import('./routes/master-data/championships/_route'),
            handle: {
              title: 'Turniere',
            },
          },
          {
            path: 'spieler',
            lazy: () => import('./routes/master-data/players/_route'),
            handle: {
              title: 'Spieler',
            },
          },
          {
            path: 'teams',
            lazy: () => import('./routes/master-data/teams/_route'),
            handle: {
              title: 'Teams',
            },
          },
          {
            path: 'ligen',
            lazy: () => import('./routes/master-data/leagues/_route'),
            handle: {
              title: 'Ligen',
            },
          },
          {
            path: 'regelwerke',
            lazy: () => import('./routes/master-data/rulesets/_route'),
            handle: {
              title: 'Regelwerke',
            },
          },
        ],
      },
      {
        path: 'profil',
        element: <ProfileRoute />,
        handle: {
          title: 'Profil',
        },
      },
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
