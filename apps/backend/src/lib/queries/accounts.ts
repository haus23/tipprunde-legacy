import type { Account } from '@haus23/tipprunde-types';

import { cachedFunction } from '../cached.ts';
import { db, modelConverter } from '../firebase/index.ts';

export const getAccounts = cachedFunction(
  async () => {
    console.info(`[${new Date().toLocaleString()}] Querying accounts`);

    const snapshot = await db
      .collection('players')
      .withConverter(modelConverter<Account>())
      .get();
    return snapshot.docs.map((doc) => doc.data());
  },
  {
    name: 'accounts',
    getKey: () => 'list',
  },
);
