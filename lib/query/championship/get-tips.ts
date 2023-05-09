import type { Tip } from '@haus23/tipprunde-types';
import consola from 'consola';
import { db, modelConverter } from '~/lib/firebase';

export const getTips = cachedFunction(
  async (championshipId: string) => {
    consola.info(`[${new Date().toLocaleString()}] Querying current tips ${championshipId}`);

    const snapshot = await db
      .collection(`championships/${championshipId}/tips`)
      .withConverter(modelConverter<Tip>())
      .get();
    return snapshot.docs.map((doc) => doc.data());
  },
  { getKey: (championshipId) => `${championshipId}/tips`, maxAge: 60 * 60 }
);
