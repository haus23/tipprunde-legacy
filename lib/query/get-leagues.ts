import type { League } from '@haus23/tipprunde-types';
import { db, modelConverter } from '~/lib/firebase';

export async function getLeagues() {
  console.info(`[${new Date().toLocaleString()}] Querying leagues`);

  const snapshot = await db.collection('leagues').withConverter(modelConverter<League>()).get();
  return snapshot.docs.map((doc) => doc.data());
}
