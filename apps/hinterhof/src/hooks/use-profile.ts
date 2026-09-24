import { updateProfile } from 'lib';
import type { Profile } from '#/model/profile';
import { useSessionStore } from '#/state/session-store';

export function useProfile() {
  const profile = useSessionStore((state) => state.profile);
  const setProfile = useSessionStore((state) => state.setProfile);

  const updateDisplayName = async (displayName: string) => {
    await updateProfile({ displayName });
    if (profile) setProfile({ ...profile, displayName });
  };

  return { profile: profile as Profile, updateDisplayName };
}
