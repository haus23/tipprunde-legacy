import type { Match } from '@haus23/tipprunde-model';
import { atom, useAtomValue } from 'jotai';
import { observe } from 'jotai-effect';
import { atomFamily } from 'jotai/utils';

import { collection, orderByAsc } from '@/lib/firebase/repository';
import { store } from '@/utils/store';

import {
  currentOptionalChampionshipAtom,
  useChampionship,
} from './championship';

export const matchesAtom = atomFamily((id: string) =>
  atom<{ matches: Match[]; isSynced: boolean }>({
    matches: [],
    isSynced: false,
  }),
);

observe((get, set) => {
  const currentChampionship = get(currentOptionalChampionshipAtom);
  if (currentChampionship) {
    const { isSynced } = get(matchesAtom(currentChampionship.id));
    if (!isSynced) {
      console.log(`Subscription: matches for ${currentChampionship.id}`);
      collection<Match>(
        `championships/${currentChampionship.id}/matches`,
        orderByAsc('nr'),
      ).subscribe((matches) => {
        set(matchesAtom(currentChampionship.id), { matches, isSynced: true });
      });
    }
  }
}, store);

export function useMatches() {
  const { championship } = useChampionship();
  const { matches } = useAtomValue(matchesAtom(championship.id));

  return { matches };
}
