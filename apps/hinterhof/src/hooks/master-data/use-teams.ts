import { type Team, createEntity, updateEntity } from 'lib';
import { useRecoilValue } from 'recoil';

import { teamsState } from '@/state/master-data/teams-state';

export function useTeams() {
  const teams = useRecoilValue(teamsState);

  const createTeam = (team: Team) => createEntity<Team>('teams', team);

  const updateTeam = (team: Team) => updateEntity('teams', team);

  return { teams, createTeam, updateTeam };
}
