import { clearCache } from '@/utils/clear-cache';
import { useChampionshipPlayers } from './use-championship-players';
import { useCurrentChampionship } from './use-current-championship';
import { useTips } from './use-tips';

type RankingData = {
  id: string;
  rank: number;
  points: number;
  extraPoints: number;
  totalPoints: number;
};

export function useRanking() {
  const { currentChampionship } = useCurrentChampionship();
  const { championshipPlayers, updateChampionshipPlayer } =
    useChampionshipPlayers();
  const { tips } = useTips();

  const calculateRanking = async () => {
    const ranking: RankingData[] = [];

    for (const cp of championshipPlayers) {
      const playerPoints = tips
        .filter((t) => t.playerId === cp.id)
        .reduce((sum, t) => sum + t.points, 0);
      ranking.push({
        id: cp.id,
        points: playerPoints,
        extraPoints: cp.extraPoints,
        totalPoints: playerPoints + cp.extraPoints,
        rank: 0,
      });
    }

    let currentRank = 1;
    let currentPoints = 0;
    ranking
      .sort((a, b) => b.totalPoints - a.totalPoints)
      .forEach((rd, ix) => {
        if (rd.totalPoints !== currentPoints) {
          rd.rank = ix + 1;
          currentPoints = rd.totalPoints;
          currentRank = rd.rank;
        } else {
          rd.rank = currentRank;
        }
      });

    await Promise.all(ranking.map((rd) => updateChampionshipPlayer(rd.id, rd)));
    clearCache(
      `standings:${currentChampionship?.id}`,
      currentChampionship?.name || 'aktuellen Stand',
    );
  };

  return { calculateRanking };
}
