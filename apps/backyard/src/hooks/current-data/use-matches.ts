import { useRecoilValue } from 'recoil';
import { matchesState } from '@/state/current-data/matches-state';

import { useCurrentChampionship } from './use-current-championship';
import { createEntity, Match, updateEntity } from 'lib';

export function useMatches() {
  const { currentChampionship } = useCurrentChampionship();
  const matches = useRecoilValue(matchesState(currentChampionship?.id));

  const createMatch = async (match: Match) =>
    createEntity<Match>(
      `championships/${currentChampionship?.id}/matches`,
      match
    );

  const updateMatch = async (match: Match) =>
    updateEntity<Match>(
      `championships/${currentChampionship?.id}/matches`,
      match
    );
  return { matches, createMatch, updateMatch };
}
