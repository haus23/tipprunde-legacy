import type { League } from '@haus23/tipprunde-types';
import { db, modelConverter } from '~/lib/firebase';
import { config } from '../config';

export const getLeagues = cachedFunction(
  async () => {
    console.info(`[${new Date().toLocaleString()}] Querying leagues`);

    const snapshot = await db.collection('leagues').withConverter(modelConverter<League>()).get();
    return snapshot.docs.map((doc) => doc.data());
  },
  {
    maxAge: config.cacheAge.long,
    name: 'leagues',
    getKey: () => 'all',
  }
);
