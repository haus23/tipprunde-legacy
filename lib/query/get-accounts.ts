import type { Account } from '@haus23/tipprunde-types';
import { db, modelConverter } from '~/lib/firebase';

export const getAccounts = cachedFunction(
  async () => {
    console.info(`[${new Date().toLocaleString()}] Querying accounts`);

    const snapshot = await db.collection('players').withConverter(modelConverter<Account>()).get();
    return snapshot.docs.map((doc) => doc.data());
  },
  {
    maxAge: 60 * 60 * 24,
    name: 'accounts',
    getKey: () => 'all',
  }
);
