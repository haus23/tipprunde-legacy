import { atom, useAtomValue } from 'jotai';

import type { User } from '@/lib/firebase/auth';

export type AuthState = {
  isAuthenticated: boolean;
  user: User | null;
};

export const authAtom = atom<AuthState>({
  isAuthenticated: false,
  user: null,
});

export function useAuth() {
  return useAtomValue(authAtom);
}

export function useUser() {
  const authState = useAtomValue(authAtom);
  if (authState.user === null) {
    throw new Error('Unauthenticated user');
  }

  return authState.user;
}
