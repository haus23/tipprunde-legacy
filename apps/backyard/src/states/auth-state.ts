import { atom } from 'recoil';
import { Profile } from '@/model/profile';

export const authState = atom<Profile | null>({
  key: 'authState',
});
