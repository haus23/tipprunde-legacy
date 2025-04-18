import { type League, createEntity, updateEntity } from 'lib';
import { useRecoilValue } from 'recoil';

import { leaguesState } from '@/state/master-data/leagues-state';

export function useLeagues() {
  const leagues = useRecoilValue(leaguesState);

  const createLeague = (league: League) =>
    createEntity<League>('leagues', league);

  const updateLeague = (league: League) => updateEntity('leagues', league);

  return { leagues, createLeague, updateLeague };
}
