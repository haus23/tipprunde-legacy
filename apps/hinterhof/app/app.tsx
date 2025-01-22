import { Route, Routes } from 'react-router';

import { SplashScreen } from './components/splash-screen';
import { useAuth } from './utils/state/auth';

import AppShell from './routes/app-shell';
import LoginRoute from './routes/auth/login';
import LogoutRoute from './routes/auth/logout';
import DashboardRoute from './routes/dashboard';

export default function App() {
  const auth = useAuth();

  if (auth.isPending) {
    return <SplashScreen />;
  }

  return (
    <Routes>
      <Route element={<AppShell />}>
        <Route index element={<DashboardRoute />} />
      </Route>
      <Route path="/login" element={<LoginRoute />} />
      <Route path="/logout" element={<LogoutRoute />} />
    </Routes>
  );
}
