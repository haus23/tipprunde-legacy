import type { Account } from '@haus23/tipprunde-model';
import { useQuery } from 'convex/react';
import { anyApi } from 'convex/server';
import { useEffect } from 'react';
import { create } from 'zustand';
import { useAccounts } from './app/accounts';

type AuthState = {
  user: Account | null;
  isAuthenticated: boolean;
  syncAuth: (user: Account | undefined) => void;
  prepareAuth: (user: Account) => void;
  logIn: () => void;
  logOut: () => void;
};

export const useAuthStore = create<AuthState>()((set) => ({
  user: null,
  isAuthenticated: false,
  syncAuth: (user) => set(() => ({ user, isAuthenticated: !!user })),
  prepareAuth: (user) => set(() => ({ user, isAuthenticated: false })),
  logIn: () => set(() => ({ isAuthenticated: true })),
  logOut: () => set(() => ({ isAuthenticated: false, user: null })),
}));

export function useConvexUser() {
  const accounts = useAccounts();
  const syncAuth = useAuthStore((state) => state.syncAuth);
  const user = useQuery(anyApi.users.current);

  useEffect(() => {
    const account = accounts.find((acc) => acc.email === user?.email);
    syncAuth(account);
  }, [user, accounts, syncAuth]);

  return user;
}
