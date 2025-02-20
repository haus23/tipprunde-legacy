import type { Championship } from '@haus23/tipprunde-model';
import { atom, useAtomValue } from 'jotai';
import { observe } from 'jotai-effect';

import { collection, orderByDesc } from '@/lib/firebase/repository';

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

export function useChampionships() {
  return { championships: useAtomValue(championshipsAtom) };
}
