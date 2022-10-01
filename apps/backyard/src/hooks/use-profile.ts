import { useRecoilState } from 'recoil';
import { updateProfile } from 'lib';

import { authState } from '@/states/auth-state';
import { Profile } from '@/model/profile';

export function useProfile() {
  const [profile, setProfile] = useRecoilState(authState);

  const updateDisplayName = async (displayName: string) => {
    await updateProfile({ displayName });
    setProfile({ ...profile!, displayName });
  };

  return { profile: profile as Profile, updateDisplayName };
}
