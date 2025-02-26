import type { Player } from '@haus23/tipprunde-model';
import { atom, useAtomValue } from 'jotai';
import { observe } from 'jotai-effect';
import { atomFamily } from 'jotai/utils';

import { collection, orderByAsc } from '@/lib/firebase/repository';
import { store } from '@/utils/store';

import {
  currentOptionalChampionshipAtom,
  useChampionship,
} from './championship';

export const playersAtom = atomFamily((championshipId: string) =>
  atom<{ players: Player[]; isSynced: boolean }>({
    players: [],
    isSynced: false,
  }),
);

observe((get, set) => {
  const currentChampionship = get(currentOptionalChampionshipAtom);
  if (currentChampionship) {
    const { isSynced } = get(playersAtom(currentChampionship.id));
    if (!isSynced) {
      console.log(`Subscription: players for ${currentChampionship.id}`);
      collection<Player>(
        `championships/${currentChampionship.id}/players`,
        orderByAsc('nr'),
      ).subscribe((players) => {
        set(playersAtom(currentChampionship.id), {
          players,
          isSynced: true,
        });
      });
    }
  }
}, store);

export function usePlayers() {
  const { championship } = useChampionship();
  const { players } = useAtomValue(playersAtom(championship.id));

  return { players };
}
