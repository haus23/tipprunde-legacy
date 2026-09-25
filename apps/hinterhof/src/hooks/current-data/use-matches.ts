import {
  calculateMatchResults,
  createEntityWithGeneratedId,
  type Match,
  type Round,
  type RuleSet,
  type Tip,
  updateEntity,
} from 'lib';
import { useCurrentDataStore } from '#/state/current-data-store';
import { useRules } from '../master-data/use-rules';
import { useCurrentChampionship } from './use-current-championship';
import { useRounds } from './use-rounds';
import { useTips } from './use-tips';

export function useMatches() {
  const { currentChampionship } = useCurrentChampionship();
  const { rounds } = useRounds();
  const { rules } = useRules();

  const { tips, updateTip } = useTips();

  const matches = useCurrentDataStore((state) => state.matches);

  const createMatch = async (match: Omit<Match, 'id'>) =>
    createEntityWithGeneratedId<Match>(
      `championships/${currentChampionship?.id}/matches`,
      match,
    );

  const updateMatch = async (match: Match) =>
    updateEntity<Match>(
      `championships/${currentChampionship?.id}/matches`,
      match,
    );

  const updateMatchResult = async (
    match: Match,
    result: string,
    tipUpdates: readonly Tip[] = [],
  ) => {
    const tipsById = new Map(tips.map((tip) => [tip.id, tip]));
    for (const tip of tipUpdates) tipsById.set(tip.id, tip);
    const matchTips = [...tipsById.values()].filter(
      (tip) => tip.matchId === match.id,
    );
    const round = rounds.find((r) => r.id === match.roundId) as Round;

    const { match: updatedMatch, tips: updatedTips } = calculateMatchResults(
      { ...match, result },
      matchTips,
      rules.find((r) => r.id === currentChampionship?.rulesId) as RuleSet,
      { isDoubleRound: round.isDoubleRound },
    );
    await Promise.all([
      updateMatch(updatedMatch),
      ...updatedTips.filter((t, ix) => t !== matchTips[ix]).map(updateTip),
    ]);
    return { match: updatedMatch, tips: updatedTips };
  };

  return { matches, createMatch, updateMatch, updateMatchResult };
}
