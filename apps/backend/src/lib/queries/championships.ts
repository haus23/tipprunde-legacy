import type { Championship } from '@haus23/tipprunde-types';

import { cachedFunction } from '../cached.ts';
import { db, modelConverter } from '../firebase/index.ts';

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
    name: 'championships',
    getKey: () => 'list',
  },
);
