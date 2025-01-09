import type { TeamInput } from '@haus23/tipprunde-model';

import { cachedFunction } from '../cached.ts';
import { db, modelConverter } from '../firebase/index.ts';

export const getTeams = cachedFunction(
  async () => {
    console.info(`[${new Date().toLocaleString()}] Querying teams`);

    const snapshot = await db
      .collection('teams')
      .withConverter(modelConverter<TeamInput>())
      .get();
    return snapshot.docs.map((doc) => doc.data());
  },
  {
    name: 'teams',
    getKey: () => 'list',
  },
);
