import { Profile } from '@/model/profile';
import { atom } from 'jotai';

export const profileState = atom<Profile | null>(null);
