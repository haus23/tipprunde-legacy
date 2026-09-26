import {
  type ChampionshipPlayer,
  calculateRanking as calculateRankingEntries,
  type Tip,
} from 'lib';
import { useChampionshipPlayers } from './use-championship-players';
import { useCurrentChampionship } from './use-current-championship';
import { useTips } from './use-tips';

type RankingUpdates = {
  tips?: readonly Tip[];
  players?: readonly ChampionshipPlayer[];
  includeExtraPoints?: boolean;
};

export function useRanking() {
  const { currentChampionship } = useCurrentChampionship();
  const { championshipPlayers, updateChampionshipPlayer } =
    useChampionshipPlayers();
  const { tips } = useTips();

  const calculateRanking = async ({
    tips: updatedTips = [],
    players: updatedPlayers = [],
    includeExtraPoints = currentChampionship?.extraPointsPublished ?? false,
  }: RankingUpdates = {}) => {
    const tipsById = new Map(tips.map((tip) => [tip.id, tip]));
    for (const tip of updatedTips) tipsById.set(tip.id, tip);

    const playersById = new Map(
      championshipPlayers.map((player) => [player.id, player]),
    );
    for (const player of updatedPlayers) playersById.set(player.id, player);

    const ranking = calculateRankingEntries(
      [...playersById.values()],
      [...tipsById.values()],
      { includeExtraPoints },
    );

    await Promise.all(
      ranking.map((entry) => updateChampionshipPlayer(entry.id, entry)),
    );
  };

  return { calculateRanking };
}
