import { useAuth } from '@/hooks/use-auth';

export default function Logout() {
  const { signOut } = useAuth();

  signOut();

  return null;
}
