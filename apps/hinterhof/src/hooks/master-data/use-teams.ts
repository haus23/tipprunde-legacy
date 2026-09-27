import type { Team } from '@haus23/tipprunde-model';
import { createEntity, updateEntity } from 'lib';
import { useMasterDataStore } from '#/state/master-data-store';

export function useTeams() {
  const teams = useMasterDataStore((state) => state.teams);

  const createTeam = (team: Team) => createEntity<Team>('teams', team);

  const updateTeam = (team: Team) => updateEntity('teams', team);

  return { teams, createTeam, updateTeam };
}
