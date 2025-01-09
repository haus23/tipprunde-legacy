import type { Profile } from '@/model/profile';
import { atom } from 'recoil';

export const authState = atom<Profile | null>({
  key: 'authState',
});
