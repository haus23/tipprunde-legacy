import { useRecoilValue } from 'recoil';
import { authState } from '@/states/auth-state';
import { User } from '@/model/user';
import { profileState } from '@/states/profile-state';

export function useProfile() {
  const user = useRecoilValue(authState) as User;
  const profile = useRecoilValue(profileState(user));
  return { profile };
}
