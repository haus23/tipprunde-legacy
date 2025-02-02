import { RouterProvider, createBrowserRouter } from 'react-router';

import { useAuth } from './utils/state/auth';

import { LoginScreen } from './components/screens/login-screen';
import { SplashScreen } from './components/screens/splash-screen';

import AppShell from './routes/app-shell';
import DashboardRoute from './routes/dashboard';
import ChampionshipsRoute from './routes/master-data/championships';
import PlayersRoute from './routes/master-data/players/_route';
import TeamsRoute from './routes/master-data/teams/_route';
import ProfileRoute from './routes/profile';

export const router = createBrowserRouter([
  {
    element: <AppShell />,
    children: [
      { index: true, element: <DashboardRoute /> },
      { path: 'turniere', element: <ChampionshipsRoute /> },
      { path: 'spieler', element: <PlayersRoute /> },
      { path: 'teams', element: <TeamsRoute /> },
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
