import { ChampionshipPlayer, collection, Player } from 'lib';
import { useAppQuery } from './use-app-query';
import { useCurrentChampionship } from './use-current-championship';

export function useRanking() {
  const championship = useCurrentChampionship();

  const { data: masterPlayers } = useAppQuery(
    ['players'],
    collection<Player>('players').get
  );

  const playersHash = masterPlayers.reduce(
    (hash, player) => ({ ...hash, [player.id]: player }),
    {} as Record<string, Player>
  );

  const { data: playersRaw } = useAppQuery(
    ['players', { championship }],
    collection<ChampionshipPlayer>(`championships/${championship?.id}/players`)
      .get
  );

  const players = playersRaw
    .map((cp) => ({
      ...cp,
      name: playersHash[cp.playerId].name,
    }))
    .sort((a, b) => b.rank - a.rank);

  return {
    players,
  };
}
