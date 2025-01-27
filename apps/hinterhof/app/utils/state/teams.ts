import type { Team } from '@haus23/tipprunde-model';
import { atom, useAtom, useAtomValue } from 'jotai';
import { atomEffect } from 'jotai-effect';
import {
  collection,
  createEntity,
  updateEntity,
} from '#/lib/firebase/repository';

const teamsAtom = atom<Team[]>([]);
const teamsSubscriptionEffect = atomEffect((get, set) =>
  collection<Team>('teams').subscribe((teams) => {
    console.log('Setting teams masterdata');
    set(teamsAtom, teams);
  }),
);

export function useTeams() {
  useAtom(teamsSubscriptionEffect);

  const createTeam = (team: Team) => createEntity<Team>('teams', team);
  const updateTeam = (team: Team) => updateEntity('teams', team);

  return { teams: useAtomValue(teamsAtom), createTeam, updateTeam };
}
