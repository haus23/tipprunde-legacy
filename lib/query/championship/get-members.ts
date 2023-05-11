import type { Member } from '@haus23/tipprunde-types';
import { db, modelConverter } from '~/lib/firebase';

export async function getMembers(championshipId: string) {
  console.info(`[${new Date().toLocaleString()}] Querying current members ${championshipId}`);

  const snapshot = await db
    .collection(`championships/${championshipId}/players`)
    .orderBy('rank', 'asc')
    .withConverter(modelConverter<Member>())
    .get();
  return snapshot.docs.map((doc) => doc.data());
}
