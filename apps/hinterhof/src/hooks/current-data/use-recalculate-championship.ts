import { useMatches } from './use-matches';
import { useRanking } from './use-ranking';

export function useRecalculateChampionship() {
  const { matches, updateMatchResult } = useMatches();
  const { calculateRanking } = useRanking();

  const recalculateChampionship = async () => {
    const calculations = await Promise.all(
      matches.map((match) => updateMatchResult(match, match.result)),
    );
    await calculateRanking(calculations.flatMap(({ tips }) => tips));
  };

  return { recalculateChampionship };
}
