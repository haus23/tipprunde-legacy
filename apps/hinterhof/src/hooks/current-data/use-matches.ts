import {
  type ChampionshipRules,
  calculateMatchResults,
  createEntity,
  type Match,
  type Round,
  updateEntity,
} from 'lib';
import { useCurrentDataStore } from '@/state/current-data-store';
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

  const createMatch = async (match: Match) =>
    createEntity<Match>(
      `championships/${currentChampionship?.id}/matches`,
      match,
    );

  const updateMatch = async (match: Match) =>
    updateEntity<Match>(
      `championships/${currentChampionship?.id}/matches`,
      match,
    );

  const updateMatchResult = async (match: Match, result: string) => {
    const matchTips = tips.filter((t) => t.matchId === match.id);
    const round = rounds.find((r) => r.id === match.roundId) as Round;

    const { match: updatedMatch, tips: updatedTips } = calculateMatchResults(
      { ...match, result },
      matchTips,
      rules.find(
        (r) => r.id === currentChampionship?.rulesId,
      ) as ChampionshipRules,
      { isDoubleRound: round.isDoubleRound },
    );
    await Promise.all([
      updateMatch(updatedMatch),
      ...updatedTips.filter((t, ix) => t !== matchTips[ix]).map(updateTip),
    ]);
  };

  return { matches, createMatch, updateMatch, updateMatchResult };
}
