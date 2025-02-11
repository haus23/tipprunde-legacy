import type { Team } from '@haus23/tipprunde-model';
import { atom, useAtomValue } from 'jotai';
import { observe } from 'jotai-effect';

import {
  collection,
  createEntity,
  updateEntity,
} from '#/lib/firebase/repository';
import { store } from '../store';

const teamsAtom = atom<Team[]>([]);

observe((get, set) => {
  collection<Team>('teams').subscribe((teams) => {
    console.log('Subscription: teams');
    set(teamsAtom, teams);
  });
}, store);

export function useTeams() {
  const createTeam = (team: Team) => createEntity<Team>('teams', team);
  const updateTeam = (team: Team) => updateEntity('teams', team);

  return { teams: useAtomValue(teamsAtom), createTeam, updateTeam };
}
