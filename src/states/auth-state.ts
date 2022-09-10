import { atom } from 'recoil';

import { auth } from '@/firebase/auth';
import { User } from '@/model/user';

export const authState = atom<User | null>({
  key: 'authState',
  effects: [
    ({ setSelf }) => {
      auth.onAuthStateChanged((user) => {
        if (user) {
          const { email, displayName, photoURL } = user;
          setSelf({ email, displayName, photoURL });
        } else {
          setSelf(null);
        }
      });
    },
  ],
});
