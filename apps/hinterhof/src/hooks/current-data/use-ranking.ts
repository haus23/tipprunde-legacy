import { calculateRanking as calculateRankingEntries, type Tip } from 'lib';
import { clearCache } from '#/utils/clear-cache';
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
    clearCache(
      `${currentChampionship?.id}`,
      currentChampionship?.name || 'aktuellen Stand',
    );
  };

  return { calculateRanking };
}
