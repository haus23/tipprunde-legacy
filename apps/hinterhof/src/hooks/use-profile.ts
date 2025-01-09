import { updateProfile } from 'lib';
import { useRecoilState } from 'recoil';

import type { Profile } from '@/model/profile';
import { authState } from '@/state/auth-state';

export function useProfile() {
  const [profile, setProfile] = useRecoilState(authState);

  const updateDisplayName = async (displayName: string) => {
    await updateProfile({ displayName });
    setProfile((p) => (p ? { ...p, displayName } : null));
  };

  return { profile: profile as Profile, updateDisplayName };
}
