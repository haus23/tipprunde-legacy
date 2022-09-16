import { useRecoilState, useRecoilValue } from 'recoil';
import { authState } from '@/states/auth-state';
import { User } from '@/model/user';
import { profileState } from '@/states/profile-state';
import { updateProfile } from 'firebase/auth';
import { auth } from '@/firebase/auth';
import { Role } from '@/model/profile';
import { patchEntity } from '@/firebase/db/repository/patch-entity';

export function useProfile() {
  const user = useRecoilValue(authState) as User;
  const [profile, setProfile] = useRecoilState(profileState(user));

  const updateDisplayName = async (displayName: string) => {
    await updateProfile(auth.currentUser!, { displayName });
    setProfile({ ...profile, displayName });
  };

  const updateRole = async (role: Role) => {
    await patchEntity('users', profile, { role });
    setProfile({ ...profile, role });
  };

  return { profile, updateDisplayName, updateRole };
}
