import { useRecoilState } from 'recoil';
import { updateProfile } from 'lib';

import { authState } from '@/state/auth-state';
import { Profile } from '@/model/profile';

export function useProfile() {
  const [profile, setProfile] = useRecoilState(authState);

  const updateDisplayName = async (displayName: string) => {
    await updateProfile({ displayName });
    setProfile((p) => (p ? { ...p, displayName } : null));
  };

  return { profile: profile as Profile, updateDisplayName };
}
