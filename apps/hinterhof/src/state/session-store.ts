import type { Championship } from 'lib';
import { create } from 'zustand';

import type { Profile } from '#/model/profile';

type SessionState = {
  profile: Profile | null;
  currentChampionshipId: Championship['id'] | undefined;
  setProfile: (profile: Profile | null) => void;
  setCurrentChampionship: (championship: Championship | undefined) => void;
};

export const useSessionStore = create<SessionState>((set) => ({
  profile: null,
  currentChampionshipId: undefined,
  setProfile: (profile) => set({ profile }),
  setCurrentChampionship: (championship) =>
    set({ currentChampionshipId: championship?.id }),
}));
