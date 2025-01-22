import { Navigate } from 'react-router';
import { signOut } from '#/lib/firebase/auth';

export default function LogoutRoute() {
  signOut();

  return <Navigate to="/" />;
}
