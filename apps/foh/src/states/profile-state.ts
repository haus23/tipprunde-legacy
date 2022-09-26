import { getEntity } from '@/firebase/db/repository/get-entity';
import { Profile } from '@/model/profile';
import { User } from '@/model/user';
import { atomFamily } from 'recoil';

export const profileState = atomFamily<Profile, User>({
  key: 'profileState',
  default: async (user) => {
    const profileData = await getEntity<Profile>('users', user.uid);
    return { ...user, ...profileData };
  },
});
