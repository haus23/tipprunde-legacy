import { useRouteLoaderData } from 'react-router-dom';
import { useAtom } from 'jotai';

import { auth, patchEntity, updateProfile } from 'lib';

import { Role } from '@/model/profile';
import { profileState } from '@/states/profile-state';

// TODO:
// Der Hook wirkt gefühlt sehr tricky, sollte also aber mal überdacht werden.

export function useProfile() {
  const firebaseUser = auth.currentUser!;

  const { users } = useRouteLoaderData('root') as {
    users: { id: string; role: Role; playerId: string }[];
  };

  const [profile, setProfile] = useAtom(profileState);

  if (profile === null) {
    const user = users.find((u) => u.id === firebaseUser.uid);
    setProfile({
      id: firebaseUser.uid,
      email: firebaseUser.email || '',
      displayName: firebaseUser.displayName || '',
      photoURL: firebaseUser.photoURL || '',
      role: user?.role || 'Keine',
      playerId: user?.playerId || '',
    });
  }

  const updateDisplayName = async (displayName: string) => {
    await updateProfile({ displayName });
    setProfile({ ...profile!, displayName });
  };

  const updateRole = async (role: Role) => {
    await patchEntity('users', profile!, { role });
    setProfile({ ...profile!, role });
  };

  return { profile, updateDisplayName, updateRole };
}
