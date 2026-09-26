import type { ChampionshipPlayer } from '../championship-player';
import type { Tip } from '../tip';

export type RankingEntry = Pick<
  ChampionshipPlayer,
  'id' | 'rank' | 'points' | 'extraPoints' | 'totalPoints'
>;

type RankingTip = Pick<Tip, 'playerId'> & Partial<Pick<Tip, 'points'>>;

export function calculateRanking(
  players: readonly ChampionshipPlayer[],
  tips: readonly RankingTip[],
  options: { includeExtraPoints: boolean },
): RankingEntry[] {
  const pointsByPlayer = new Map<string, number>();

  for (const tip of tips) {
    pointsByPlayer.set(
      tip.playerId,
      (pointsByPlayer.get(tip.playerId) ?? 0) + (tip.points ?? 0),
    );
  }

  const ranking = players
    .map((player) => {
      const points = pointsByPlayer.get(player.id) ?? 0;
      const totalPoints =
        points + (options.includeExtraPoints ? player.extraPoints : 0);
      return {
        id: player.id,
        points,
        extraPoints: player.extraPoints,
        totalPoints,
        rank: 0,
      };
    })
    .sort((a, b) => b.totalPoints - a.totalPoints);

  let currentRank = 1;
  let currentPoints: number | undefined;

  for (const [index, entry] of ranking.entries()) {
    if (entry.totalPoints !== currentPoints) {
      currentRank = index + 1;
      currentPoints = entry.totalPoints;
    }
    entry.rank = currentRank;
  }

  return ranking;
}
