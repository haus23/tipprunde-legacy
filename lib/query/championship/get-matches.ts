import type { Match } from '@haus23/tipprunde-types';
import { db, modelConverter } from '~/lib/firebase';

export async function getMatches(championshipId: string) {
  console.info(`[${new Date().toLocaleString()}] Querying current matches ${championshipId}`);

  const snapshot = await db
    .collection(`championships/${championshipId}/matches`)
    .orderBy('nr', 'asc')
    .withConverter(modelConverter<Match>())
    .get();
  return snapshot.docs.map((doc) => doc.data());
}
