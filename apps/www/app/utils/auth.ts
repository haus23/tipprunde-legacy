import type { Account } from '@haus23/tipprunde-model';
import { create } from 'zustand';

type AuthState = {
  user: Account | null;
  isAuthenticated: boolean;
  prepareAuth: (user: Account) => void;
  logIn: () => void;
  logOut: () => void;
};

export const useAuthStore = create<AuthState>()((set) => ({
  user: null,
  isAuthenticated: false,
  prepareAuth: (user) => set(() => ({ user, isAuthenticated: false })),
  logIn: () => set(() => ({ isAuthenticated: true })),
  logOut: () => set(() => ({ isAuthenticated: false, user: null })),
}));
