import { Championship } from 'lib';
import { atom, selector } from 'recoil';
import { championshipsState } from './domain/championships-state';

const currentChampionshipInnerState = atom<Championship | undefined>({
  key: 'currentChampionshipInnerState',
  default: undefined,
});

export const currentChampionshipState = selector<Championship | undefined>({
  key: 'currentChampionshipState',
  get: ({ get }) => {
    const alreadySet = get(currentChampionshipInnerState);
    if (alreadySet) return alreadySet;

    const allChampionships = get(championshipsState);
    return allChampionships.at(0);
  },
  set: ({ set }, value) => set(currentChampionshipInnerState, value),
});
