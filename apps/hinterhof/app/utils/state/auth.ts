import { atom, useAtomValue } from 'jotai';
import type { User } from '#/lib/firebase/auth';

type AuthState =
  | {
      isPending: true;
      user: null;
    }
  | {
      isPending: false;
      user: User | null;
    };

export const authAtom = atom<AuthState>({ isPending: true, user: null });

export function useAuth() {
  return useAtomValue(authAtom);
}
