import {
  ChampionshipPlayer,
  collection,
  Match,
  orderByAsc,
  Player,
  Round,
  Team,
  Tip,
} from 'lib';
import { useAppQuery } from './use-app-query';
import { useCollectionHash } from './use-collection-hash';
import { useCurrentChampionship } from './use-current-championship';

export function useRanking() {
  const championship = useCurrentChampionship();

  const playersHash = useCollectionHash<Player>('players');
  const teamsHash = useCollectionHash<Team>('teams');

  const { data: playersRaw } = useAppQuery(
    ['players', championship?.id],
    collection<ChampionshipPlayer>(`championships/${championship?.id}/players`)
      .get
  );
  const players = playersRaw
    .map((cp) => ({
      ...cp,
      name: playersHash[cp.playerId].name,
    }))
    .sort((a, b) => a.rank - b.rank);

  const { data: matchesRaw } = useAppQuery(
    ['matches', championship?.id],
    collection<Match>(
      `championships/${championship?.id}/matches`,
      orderByAsc('nr')
    ).get
  );

  const matches = matchesRaw.map((m) => ({
    ...m,
    hometeam: teamsHash[m.hometeamId],
    awayteam: teamsHash[m.awayteamId],
  }));

  const { data: tips } = useAppQuery(
    ['tips', championship?.id],
    collection<Tip>(`championships/${championship?.id}/tips`).get
  );

  const { data: rounds } = useAppQuery(
    ['rounds', championship?.id],
    collection<Round>(
      `championships/${championship?.id}/rounds`,
      orderByAsc('nr')
    ).get
  );

  return {
    players,
    matches,
    tips,
    rounds,
  };
}
