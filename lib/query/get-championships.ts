import type { Championship } from '@haus23/tipprunde-types';
import { db, modelConverter } from '~/lib/firebase';
import { config } from '../config';

export const getChampionships = cachedFunction(
  async () => {
    console.info(`[${new Date().toLocaleString()}] Querying championships`);

    const snapshot = await db
      .collection('championships')
      .where('published', '==', true)
      .orderBy('nr', 'desc')
      .withConverter(modelConverter<Championship>())
      .get();
    return snapshot.docs.map((doc) => doc.data());
  },
  {
    maxAge: config.cacheAge.long,
    name: 'championships',
    getKey: () => 'all',
  }
);
