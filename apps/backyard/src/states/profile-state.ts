import { getEntity } from '@/firebase/db/repository/get-entity';
import { Profile } from '@/model/profile';
import { User } from '@/model/user';
import { atomFamily } from 'recoil';

export const profileState = atomFamily<Profile, User>({
  key: 'profileState',
  default: async (user) => {
    let profileData: Profile;
    try {
      profileData = await getEntity<Profile>('users', user.uid);
    } catch {
      // No profile for user by now
      profileData = { ...user, id: user.uid, role: 'Keine', playerId: '' };
    }

    return { ...user, ...profileData };
  },
});
