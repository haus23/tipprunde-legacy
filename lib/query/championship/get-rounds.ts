import type { Round } from '@haus23/tipprunde-types';
import { db, modelConverter } from '~/lib/firebase';

export const getRounds = cachedFunction(
  async (championshipId: string) => {
    console.info(`[${new Date().toLocaleString()}] Querying rounds ${championshipId}`);

    const snapshot = await db
      .collection(`championships/${championshipId}/rounds`)
      .orderBy('nr', 'asc')
      .withConverter(modelConverter<Round>())
      .get();
    return snapshot.docs.map((doc) => doc.data());
  },
  {
    maxAge: 10 * 60,
    name: 'rounds',
    getKey: (championshipId: string) => championshipId,
  }
);
