import type { Round } from '@haus23/tipprunde-model';
import { atom, useAtomValue } from 'jotai';
import { observe } from 'jotai-effect';
import { atomFamily } from 'jotai/utils';

import {
  collection,
  createEntity,
  orderByAsc,
} from '@/lib/firebase/repository';
import { store } from '@/utils/store';

import {
  currentOptionalChampionshipAtom,
  useChampionship,
} from './championship';

export const roundsAtom = atomFamily((championshipId: string) =>
  atom<{ rounds: Round[]; isSynced: boolean }>({ rounds: [], isSynced: false }),
);

observe((get, set) => {
  const currentChampionship = get(currentOptionalChampionshipAtom);
  if (currentChampionship) {
    const { isSynced } = get(roundsAtom(currentChampionship.id));
    if (!isSynced) {
      console.log(`Subscription: rounds for ${currentChampionship.id}`);
      collection<Round>(
        `championships/${currentChampionship.id}/rounds`,
        orderByAsc('nr'),
      ).subscribe((rounds) => {
        set(roundsAtom(currentChampionship.id), { rounds, isSynced: true });
      });
    }
  }
}, store);

export function useRounds() {
  const { championship } = useChampionship();
  const { rounds } = useAtomValue(roundsAtom(championship.id));

  const createRound = (nr: number, isDoubleRound: boolean) =>
    createEntity<Round>(`championships/${championship.id}/rounds`, {
      id: '',
      nr,
      isDoubleRound,
      published: false,
      tipsPublished: false,
      completed: false,
    });

  return { rounds, createRound };
}
