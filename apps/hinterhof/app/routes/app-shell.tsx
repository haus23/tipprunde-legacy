import { Navigate, Outlet } from 'react-router';
import { useAuth } from '#/utils/state/auth';

export default function AppShell() {
  const auth = useAuth();

  if (!auth.user) {
    return <Navigate to={{ pathname: '/login' }} />;
  }

  return <Outlet />;
}
