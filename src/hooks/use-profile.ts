import { useRecoilValue } from 'recoil';
import { authState } from '@/states/auth-state';

export function useProfile() {
  const user = useRecoilValue(authState);

  return { profile: user! };
}
