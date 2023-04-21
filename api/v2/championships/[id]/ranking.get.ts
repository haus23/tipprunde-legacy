import { Rank } from '@haus23/tipprunde-types';
import { z } from 'zod';
import { getRanks } from '~/lib/query/championship/get-ranks';
import { getPlayers } from '~/lib/query/get-players';
import { getChampionshipId } from '~/lib/util/get-championship-id';

export default cachedEventHandler(
  async (event) => {
    const championshipId = await getChampionshipId(event);

    const players = await getPlayers();
    const ranks = await getRanks(championshipId);

    const ranking = ranks?.map(
      (r) => ({ ...r, playerName: z.string().parse(players?.find((p) => p.id === r.playerId)?.name) } satisfies Rank)
    );

    return ranking;
  },
  { name: 'championships/ranking', getKey: getChampionshipId }
);
