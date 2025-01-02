import type { Team } from '@haus23/tipprunde-types';

import { env } from '#app/env.ts';
import { cachedFunction } from '../cached.ts';
import { db, modelConverter } from '../firebase/index.ts';

export const getTeams = cachedFunction(
  async () => {
    console.info(`[${new Date().toLocaleString()}] Querying teams`);

    const snapshot = await db
      .collection('teams')
      .withConverter(modelConverter<Team>())
      .get();
    return snapshot.docs.map((doc) => doc.data());
  },
  {
    name: 'teams',
    getKey: () => 'list',
  },
);
