import { User } from 'firebase/auth';
import { atom } from 'recoil';

import { auth } from '@/firebase/auth';

export const authState = atom<User | null>({
  key: 'authState',
  effects: [
    ({ setSelf }) => {
      auth.onAuthStateChanged((user) => {
        setSelf(user);
      });
    },
  ],
});
