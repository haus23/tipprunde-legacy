import type { Team } from '@haus23/tipprunde-model';
import { atom, useAtom, useAtomValue } from 'jotai';
import { atomEffect } from 'jotai-effect';
import { collection } from '#/lib/repository/collection';

const teamsAtom = atom<Team[]>([]);
const teamsSubscriptionEffect = atomEffect((get, set) =>
  collection<Team>('teams').subscribe((teams) => {
    console.log('Setting teams masterdata');
    set(teamsAtom, teams);
  }),
);

export function useTeams() {
  useAtom(teamsSubscriptionEffect);
  return useAtomValue(teamsAtom);
}
