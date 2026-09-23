import { createEntity, type League, updateEntity } from 'lib';
import { useMasterDataStore } from '@/state/master-data-store';

export function useLeagues() {
  const leagues = useMasterDataStore((state) => state.leagues);

  const createLeague = (league: League) =>
    createEntity<League>('leagues', league);

  const updateLeague = (league: League) => updateEntity('leagues', league);

  return { leagues, createLeague, updateLeague };
}
