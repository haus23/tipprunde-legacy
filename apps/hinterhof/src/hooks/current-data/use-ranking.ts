import { calculateRanking as calculateRankingEntries, type Tip } from 'lib';
import { invalidateCache } from '#/utils/invalidate-cache';
import { useChampionshipPlayers } from './use-championship-players';
import { useCurrentChampionship } from './use-current-championship';
import { useTips } from './use-tips';

export function useRanking() {
  const { currentChampionship } = useCurrentChampionship();
  const { championshipPlayers, updateChampionshipPlayer } =
    useChampionshipPlayers();
  const { tips } = useTips();

  const calculateRanking = async (updatedTips: readonly Tip[] = []) => {
    const tipsById = new Map(tips.map((tip) => [tip.id, tip]));
    for (const tip of updatedTips) tipsById.set(tip.id, tip);

    const ranking = calculateRankingEntries(championshipPlayers, [
      ...tipsById.values(),
    ]);

    await Promise.all(
      ranking.map((entry) => updateChampionshipPlayer(entry.id, entry)),
    );
    if (currentChampionship) {
      await invalidateCache([
        { type: 'championship', id: currentChampionship.id },
      ]);
    }
  };

  return { calculateRanking };
}
