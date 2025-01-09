import { useRecoilValue } from 'recoil';
import { createEntity, Team, updateEntity } from 'lib';

import { teamsState } from '@/state/master-data/teams-state';

export function useTeams() {
  const teams = useRecoilValue(teamsState);

  const createTeam = (team: Team) => createEntity<Team>('teams', team);

  const updateTeam = (team: Team) => updateEntity('teams', team);

  return { teams, createTeam, updateTeam };
}
