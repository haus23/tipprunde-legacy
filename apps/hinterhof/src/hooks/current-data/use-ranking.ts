import {
  type ChampionshipPlayer,
  calculateRanking as calculateRankingEntries,
  type Match,
  type Tip,
} from '@haus23/tipprunde-model';
import { useCurrentDataStore } from '#/state/current-data-store';
import { useChampionshipPlayers } from './use-championship-players';
import { useCurrentChampionship } from './use-current-championship';
import { useTips } from './use-tips';

type RankingUpdates = {
  tips?: readonly Tip[];
  matches?: readonly Match[];
  players?: readonly ChampionshipPlayer[];
  includeExtraPoints?: boolean;
};

export function useRanking() {
  const { currentChampionship } = useCurrentChampionship();
  const {
    championshipPlayers,
    removeChampionshipPlayerRanking,
    updateChampionshipPlayer,
  } = useChampionshipPlayers();
  const { tips } = useTips();
  const matches = useCurrentDataStore((state) => state.matches);

  const calculateRanking = async ({
    tips: updatedTips = [],
    matches: updatedMatches = [],
    players: updatedPlayers = [],
    includeExtraPoints = currentChampionship?.extraPointsPublished ?? false,
  }: RankingUpdates = {}) => {
    const tipsById = new Map(tips.map((tip) => [tip.id, tip]));
    for (const tip of updatedTips) tipsById.set(tip.id, tip);

    const playersById = new Map(
      championshipPlayers.map((player) => [player.id, player]),
    );
    for (const player of updatedPlayers) playersById.set(player.id, player);

    const matchesById = new Map(matches.map((match) => [match.id, match]));
    for (const match of updatedMatches) matchesById.set(match.id, match);

    const ranking = calculateRankingEntries(
      [...playersById.values()],
      [...tipsById.values()],
      {
        includeExtraPoints,
        hasEvaluatedMatches: [...matchesById.values()].some(
          (match) => match.result.length > 0,
        ),
      },
    );

    if (!ranking) {
      await Promise.all(
        [...playersById.values()].map(removeChampionshipPlayerRanking),
      );
      return;
    }

    await Promise.all(
      ranking.map((entry) => updateChampionshipPlayer(entry.id, entry)),
    );
  };

  return { calculateRanking };
}
