import { ChampionshipPlayer } from '@haus23/tipprunde-types';
import { db, modelConverter } from '~/lib/firebase';
import { cachedQuery } from '~/lib/util/cached-query';

export const getRanks = cachedQuery(
  async function (championshipId: string) {
    const snapshot = await db
      .collection(`championships/${championshipId}/players`)
      .orderBy('rank', 'asc')
      .withConverter(modelConverter<ChampionshipPlayer>())
      .get();
    return snapshot.docs.map((doc) => doc.data());
  },
  {
    name: 'aggregats',
    getKey: (championshipId) => `championships/${championshipId}/players`,
  }
);
