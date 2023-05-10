import type { Team } from '@haus23/tipprunde-types';
import { db, modelConverter } from '~/lib/firebase';

export async function getTeams() {
  console.info(`[${new Date().toLocaleString()}] Querying teams`);

  const snapshot = await db.collection('teams').withConverter(modelConverter<Team>()).get();
  return snapshot.docs.map((doc) => doc.data());
}
