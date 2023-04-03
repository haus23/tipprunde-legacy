import { Rank } from '@haus23/tipprunde-types';
import { getRanks } from '~/lib/query/aggregat/championship/get-ranks';
import { getPlayers } from '~/lib/query/entity/get-players';
import { getChampionshipId } from '~/lib/util/get-championship-id';

export default eventHandler(async (event) => {
  const championshipId = await getChampionshipId(event);

  const players = await getPlayers();
  const ranks = await getRanks(championshipId);

  const ranking = ranks?.map(
    (r) => ({ ...r, playerName: players?.find((p) => p.id === r.playerId)?.name! } satisfies Rank)
  );

  return ranking;
});
