import type { Championship } from '@haus23/tipprunde-model';
import { atom, useAtom, useAtomValue } from 'jotai';

import { invariant } from '@/utils/invariant';

export const currentChampionshipAtom = atom<Championship>();

// TODO: Can i derive from the championshipsAtom??
export function useOptionalChampionship() {
  return useAtomValue(currentChampionshipAtom);
}

export function useChampionship() {
  const [championship, setChampionship] = useAtom(currentChampionshipAtom);
  invariant(typeof championship !== 'undefined');
  return { championship, setChampionship };
}
