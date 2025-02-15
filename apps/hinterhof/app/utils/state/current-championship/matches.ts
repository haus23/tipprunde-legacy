import type { Match } from '@haus23/tipprunde-model';
import { atom, useAtomValue } from 'jotai';
import { observe } from 'jotai-effect';
import { atomFamily } from 'jotai/utils';

import { collection, orderByAsc } from '@/lib/firebase/repository';
import { store } from '@/utils/store';

import { currentChampionshipAtom, useChampionship } from '../championships';

const matchesAtom = atomFamily((id: string) =>
  atom<{ matches: Match[]; isSynced: boolean }>({
    matches: [],
    isSynced: false,
  }),
);

observe((get, set) => {
  const currentChampionship = get(currentChampionshipAtom);
  if (currentChampionship) {
    const { isSynced } = get(matchesAtom(currentChampionship.id));
    if (!isSynced) {
      collection<Match>(
        `championships/${currentChampionship.id}/matches`,
        orderByAsc('nr'),
      ).subscribe((matches) => {
        console.log(`Query matches for ${currentChampionship.id}`);
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
