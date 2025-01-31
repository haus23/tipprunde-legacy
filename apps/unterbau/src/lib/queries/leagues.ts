import type { LeagueInput } from '@haus23/tipprunde-model';

import { cachedFunction } from '../cached.ts';
import { db, modelConverter } from '../firebase/index.ts';

export const getLeagues = cachedFunction(
  async () => {
    console.info(`[${new Date().toLocaleString()}] Querying leagues`);

    const snapshot = await db
      .collection('leagues')
      .withConverter(modelConverter<LeagueInput>())
      .get();
    return snapshot.docs.map((doc) => doc.data());
  },
  {
    name: 'leagues',
    getKey: () => 'list',
  },
);
