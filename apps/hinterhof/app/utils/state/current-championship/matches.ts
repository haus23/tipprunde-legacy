import type { Match } from '@haus23/tipprunde-model';
import { atom, useAtomValue } from 'jotai';
import { observe } from 'jotai-effect';
import { atomFamily } from 'jotai/utils';

import { collection, orderByAsc } from '@/lib/firebase/repository';
import { store } from '@/utils/store';

import { currentChampionshipAtom, useChampionship } from '../championships';

const currentChampionshipMatchesAtom = atomFamily((id: string) =>
  atom<Match[]>(),
);

observe((get, set) => {
  const currentChampionship = get(currentChampionshipAtom);
  if (currentChampionship) {
    const currentMatches = get(
      currentChampionshipMatchesAtom(currentChampionship.id),
    );
    if (typeof currentMatches === 'undefined') {
      collection<Match>(
        `championships/${currentChampionship.id}/matches`,
        orderByAsc('nr'),
      ).subscribe((matches) => {
        console.log(`Query matches for ${currentChampionship.id}`);
        set(currentChampionshipMatchesAtom(currentChampionship.id), matches);
      });
    }
  }
}, store);

export function useCurrentMatches() {
  const { championship } = useChampionship();
  const matches = useAtomValue(currentChampionshipMatchesAtom(championship.id));

  return { matches };
}
