import { useRecoilValue } from 'recoil';

import { createWithSequence } from '@/firebase/db/repository/create-entity';
import { updateEntity } from '@/firebase/db/repository/update-entity';
import { Team } from '@/model/domain/team';
import { teamsState } from '@/states/domain/teams-state';

export function useTeams() {
  const teams = useRecoilValue(teamsState);

  const createTeam = (team: Team) =>
    createWithSequence<Team>('teams', 'team', team);

  const updateTeam = (team: Team) => updateEntity('teams', team);

  return { teams, createTeam, updateTeam };
}
