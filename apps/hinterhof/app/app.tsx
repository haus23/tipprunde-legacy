import { RouterProvider, createBrowserRouter } from 'react-router';

import { useAuth } from './utils/state/auth';

import { LoginScreen } from './components/screens/login-screen';
import { SplashScreen } from './components/screens/splash-screen';

import AppShell from './routes/app-shell';
import DashboardRoute from './routes/dashboard';

export const router = createBrowserRouter([
  {
    element: <AppShell />,
    children: [{ index: true, element: <DashboardRoute /> }],
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
