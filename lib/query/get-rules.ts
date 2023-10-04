import type { Rule } from '@haus23/tipprunde-types';
import { db, modelConverter } from '~/lib/firebase';
import { config } from '../config';

export const getRules = cachedFunction(
  async () => {
    console.info(`[${new Date().toLocaleString()}] Querying rules`);

    const snapshot = await db.collection('rules').withConverter(modelConverter<Rule>()).get();
    return snapshot.docs.map((doc) => doc.data());
  },
  {
    maxAge: config.cacheAge.long,
    name: 'rules',
    getKey: () => 'all',
  }
);
