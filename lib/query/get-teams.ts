import { Team } from '@haus23/tipprunde-types';
import consola from 'consola';
import { db, modelConverter } from '~/lib/firebase';

export const getTeams = cachedFunction(
  async () => {
    consola.info(`[${new Date().toLocaleString()}] Querying teams`);
    const snapshot = await db.collection('teams').withConverter(modelConverter<Team>()).get();
    return snapshot.docs.map((doc) => doc.data());
  },
  { getKey: () => 'teams', maxAge: 60 * 60 }
);
