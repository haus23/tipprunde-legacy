import type { Match } from '@haus23/tipprunde-types';
import consola from 'consola';
import { db, modelConverter } from '~/lib/firebase';

export const getMatches = cachedFunction(
  async (championshipId: string) => {
    consola.info(`[${new Date().toLocaleString()}] Querying current matches ${championshipId}`);

    const snapshot = await db
      .collection(`championships/${championshipId}/matches`)
      .orderBy('nr', 'asc')
      .withConverter(modelConverter<Match>())
      .get();
    return snapshot.docs.map((doc) => doc.data());
  },
  { getKey: (championshipId) => `${championshipId}/matches`, maxAge: 60 * 60 }
);
