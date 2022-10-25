import { useRecoilValue } from 'recoil';
import { matchesState } from '@/state/current-data/matches-state';

import { useCurrentChampionship } from './use-current-championship';
import {
  calculateMatchResults,
  ChampionshipRules,
  createEntity,
  Match,
  updateEntity,
} from 'lib';
import { useTips } from './use-tips';
import { useRules } from '../master-data/use-rules';

export function useMatches() {
  const { currentChampionship } = useCurrentChampionship();
  const { rules } = useRules();

  const { tips, updateTip } = useTips();

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

  const updateMatchResult = async (match: Match, result: string) => {
    const matchTips = tips.filter((t) => t.matchId === match.id);
    const { match: updatedMatch, tips: updatedTips } = calculateMatchResults(
      { ...match, result },
      matchTips,
      rules.find(
        (r) => r.id === currentChampionship?.rulesId
      ) as ChampionshipRules
    );
    await Promise.all([
      updateMatch(updatedMatch),
      ...updatedTips.filter((t, ix) => t !== matchTips[ix]).map(updateTip),
    ]);
  };

  return { matches, createMatch, updateMatch, updateMatchResult };
}
