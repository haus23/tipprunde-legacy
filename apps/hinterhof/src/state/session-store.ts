import type { Championship } from '@haus23/tipprunde-model';
import { create } from 'zustand';

import type { Profile } from '#/firebase/auth';

type SessionState = {
  profile: Profile | null;
  currentChampionshipId: Championship['id'] | undefined;
  setProfile: (profile: Profile | null) => void;
  setCurrentChampionshipId: (id: Championship['id'] | undefined) => void;
};

export const useSessionStore = create<SessionState>((set) => ({
  profile: null,
  currentChampionshipId: undefined,
  setProfile: (profile) => set({ profile }),
  setCurrentChampionshipId: (id) => set({ currentChampionshipId: id }),
}));
