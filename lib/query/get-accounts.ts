import type { Account } from '@haus23/tipprunde-types';
import { db, modelConverter } from '~/lib/firebase';
import { config } from '../config';

export const getAccounts = cachedFunction(
  async () => {
    console.info(`[${new Date().toLocaleString()}] Querying accounts`);

    const snapshot = await db.collection('players').withConverter(modelConverter<Account>()).get();
    return snapshot.docs.map((doc) => doc.data());
  },
  {
    maxAge: config.cacheAge.long,
    name: 'accounts',
    getKey: () => 'all',
  }
);
