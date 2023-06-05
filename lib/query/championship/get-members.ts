import type { Member } from '@haus23/tipprunde-types';
import { config } from '~/lib/config';
import { db, modelConverter } from '~/lib/firebase';

export const getMembers = cachedFunction(
  async (championshipId: string) => {
    console.info(`[${new Date().toLocaleString()}] Querying members ${championshipId}`);

    const snapshot = await db
      .collection(`championships/${championshipId}/players`)
      .orderBy('rank', 'asc')
      .withConverter(modelConverter<Member>())
      .get();
    return snapshot.docs.map((doc) => doc.data());
  },
  {
    maxAge: config.cacheAge.short,
    name: 'ranks',
    getKey: (championshipId: string) => championshipId,
  }
);
