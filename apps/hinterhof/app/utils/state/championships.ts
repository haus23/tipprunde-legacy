import type { Championship } from '@haus23/tipprunde-model';
import { atom, useAtom, useAtomValue } from 'jotai';
import { observe } from 'jotai-effect';

import { collection, orderByDesc } from '@/lib/firebase/repository';

import { invariant } from '../invariant';
import { store } from '../store';

export const championshipsAtom = atom<Championship[]>([]);

observe((get, set) => {
  collection<Championship>('championships', orderByDesc('nr')).subscribe(
    (championships) => {
      console.log('Subscription: championships');
      set(championshipsAtom, championships);
    },
  );
}, store);

export const currentChampionshipAtom = atom<Championship>();

export function useOptionalChampionship() {
  return useAtomValue(currentChampionshipAtom);
}

export function useChampionship() {
  const [championship, setChampionship] = useAtom(currentChampionshipAtom);
  invariant(typeof championship !== 'undefined');
  return { championship, setChampionship };
}

export function useChampionships() {
  return { championships: useAtomValue(championshipsAtom) };
}
