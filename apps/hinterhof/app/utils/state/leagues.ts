import type { League } from '@haus23/tipprunde-model';
import { atom, useAtomValue } from 'jotai';
import { observe } from 'jotai-effect';

import {
  collection,
  createEntity,
  updateEntity,
} from '@/lib/firebase/repository';
import { store } from '../store';

const leaguesAtom = atom<League[]>([]);

observe((get, set) => {
  collection<League>('leagues').subscribe((leagues) => {
    console.log('Setting leagues masterdata');
    set(leaguesAtom, leagues);
  });
}, store);

export function useLeagues() {
  const createLeague = (league: League) =>
    createEntity<League>('leagues', league);
  const updateLeague = (league: League) => updateEntity('leagues', league);

  return { leagues: useAtomValue(leaguesAtom), createLeague, updateLeague };
}
