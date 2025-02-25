import type { Championship } from '@haus23/tipprunde-model';
import { atom, useAtom, useAtomValue } from 'jotai';

import { invariant } from '@/utils/invariant';

export const currentOptionalChampionshipAtom = atom<Championship>();

export const currentChampionshipAtom = atom((get) => {
  const championship = get(currentOptionalChampionshipAtom);
  invariant(typeof championship !== 'undefined');
  return championship;
});

export function useOptionalChampionship() {
  return useAtomValue(currentOptionalChampionshipAtom);
}

export function useChampionship() {
  const [_, setChampionship] = useAtom(currentOptionalChampionshipAtom);
  const championship = useAtomValue(currentChampionshipAtom);

  return { championship, setChampionship };
}
