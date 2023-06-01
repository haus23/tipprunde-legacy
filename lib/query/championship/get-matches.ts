import type { Match } from '@haus23/tipprunde-types';
import { db, modelConverter } from '~/lib/firebase';

export const getMatches = cachedFunction(
  async (championshipId: string) => {
    console.info(`[${new Date().toLocaleString()}] Querying matches ${championshipId}`);

    const snapshot = await db
      .collection(`championships/${championshipId}/matches`)
      .orderBy('nr', 'asc')
      .withConverter(modelConverter<Match>())
      .get();
    return snapshot.docs.map((doc) => doc.data());
  },
  {
    maxAge: 10 * 60,
    name: 'matches',
    getKey: (championshipId: string) => championshipId,
  }
);
