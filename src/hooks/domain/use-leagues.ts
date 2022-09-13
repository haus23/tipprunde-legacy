import { useRecoilValue } from 'recoil';

import { createWithSequence } from '@/firebase/db/repository/create-entity';
import { update } from '@/firebase/db/repository/update-entity';
import { League } from '@/model/domain/league';
import { leaguesState } from '@/states/domain/leagues-state';

export function useLeagues() {
  const leagues = useRecoilValue(leaguesState);

  const createLeague = (league: League) =>
    createWithSequence<League>('leagues', 'league', league);

  const updateLeague = (league: League) => update('leagues', league);

  return { leagues, createLeague, updateLeague };
}
