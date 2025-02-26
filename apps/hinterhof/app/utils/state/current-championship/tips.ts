import type { Tip } from '@haus23/tipprunde-model';
import { atom, useAtomValue } from 'jotai';
import { observe } from 'jotai-effect';
import { atomFamily } from 'jotai/utils';

import { collection, orderByAsc } from '@/lib/firebase/repository';
import { store } from '@/utils/store';

import {
  currentOptionalChampionshipAtom,
  useChampionship,
} from './championship';

export const tipsAtom = atomFamily((championshipId: string) =>
  atom<{ tips: Tip[]; isSynced: boolean }>({
    tips: [],
    isSynced: false,
  }),
);

observe((get, set) => {
  const currentChampionship = get(currentOptionalChampionshipAtom);
  if (currentChampionship) {
    const { isSynced } = get(tipsAtom(currentChampionship.id));
    if (!isSynced) {
      console.log(`Subscription: tips for ${currentChampionship.id}`);
      collection<Tip>(`championships/${currentChampionship.id}/tips`).subscribe(
        (tips) => {
          set(tipsAtom(currentChampionship.id), {
            tips,
            isSynced: true,
          });
        },
      );
    }
  }
}, store);

export function useTips() {
  const { championship } = useChampionship();
  const { tips } = useAtomValue(tipsAtom(championship.id));

  return { tips };
}
