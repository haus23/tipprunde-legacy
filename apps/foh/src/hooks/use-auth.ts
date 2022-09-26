import { useRecoilValue } from 'recoil';
import { authState } from '@/states/auth-state';
import { signIn, signOut } from '@/firebase/auth';

export function useAuth() {
  const auth = useRecoilValue(authState);

  return { isAuthenticated: auth !== null, signIn, signOut };
}
