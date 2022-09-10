import { useRecoilValue } from 'recoil';
import { authState } from '@/states/auth-state';

export function useAuth() {
  const auth = useRecoilValue(authState);

  return { isAuthenticated: auth !== null };
}
