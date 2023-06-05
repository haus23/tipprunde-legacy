import type { Team } from '@haus23/tipprunde-types';
import { db, modelConverter } from '~/lib/firebase';
import { config } from '../config';

export const getTeams = cachedFunction(
  async () => {
    console.info(`[${new Date().toLocaleString()}] Querying teams`);

    const snapshot = await db.collection('teams').withConverter(modelConverter<Team>()).get();
    return snapshot.docs.map((doc) => doc.data());
  },
  {
    maxAge: config.cacheAge.long,
    name: 'teams',
    getKey: () => 'all',
  }
);
