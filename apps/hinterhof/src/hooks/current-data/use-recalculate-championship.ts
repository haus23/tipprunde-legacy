import { invalidateCache } from '#/utils/invalidate-cache';
import { useCurrentChampionship } from './use-current-championship';
import { useMatches } from './use-matches';
import { useRanking } from './use-ranking';

export function useRecalculateChampionship() {
  const { currentChampionship } = useCurrentChampionship();
  const { matches, updateMatchResult } = useMatches();
  const { calculateRanking } = useRanking();

  const recalculateChampionship = async () => {
    if (!currentChampionship) return;

    const calculations = await Promise.all(
      matches.map((match) => updateMatchResult(match, match.result)),
    );
    await calculateRanking({
      matches: calculations.map(({ match }) => match),
      tips: calculations.flatMap(({ tips }) => tips),
    });
    await invalidateCache([
      { type: 'championship', id: currentChampionship.id },
    ]);
  };

  return { recalculateChampionship };
}
