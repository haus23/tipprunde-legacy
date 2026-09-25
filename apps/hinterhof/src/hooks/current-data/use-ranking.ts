import { calculateRanking as calculateRankingEntries } from 'lib';
import { clearCache } from '#/utils/clear-cache';
import { useChampionshipPlayers } from './use-championship-players';
import { useCurrentChampionship } from './use-current-championship';
import { useTips } from './use-tips';

export function useRanking() {
  const { currentChampionship } = useCurrentChampionship();
  const { championshipPlayers, updateChampionshipPlayer } =
    useChampionshipPlayers();
  const { tips } = useTips();

  const calculateRanking = async () => {
    const ranking = calculateRankingEntries(championshipPlayers, tips);

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
