import { collection, orderByAsc } from '@/lib/firebase/repository';
import { store } from '@/utils/store';
import type { Match } from '@haus23/tipprunde-model';
import { atom, useAtom, useAtomValue } from 'jotai';
import { atomEffect, observe } from 'jotai-effect';
import { atomFamily } from 'jotai/utils';
import { useEffect } from 'react';
import { currentChampionshipAtom } from '../championships';

const currentChampionshipMatchesAtom = atomFamily((id: string) =>
  atom<Match[]>(),
);

observe((get, set) => {
  const currentChampionship = get(currentChampionshipAtom);
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
}, store);

export function useCurrentMatches() {
  const currentChampionship = useAtomValue(currentChampionshipAtom);
  const matches = useAtomValue(
    currentChampionshipMatchesAtom(currentChampionship.id),
  );

  return { matches };
}
