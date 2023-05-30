import type { Tip } from '@haus23/tipprunde-types';
import { db, modelConverter } from '~/lib/firebase';

export async function getTips(championshipId: string) {
  console.info(`[${new Date().toLocaleString()}] Querying tips ${championshipId}`);

  const snapshot = await db
    .collection(`championships/${championshipId}/tips`)
    .withConverter(modelConverter<Tip>())
    .get();
  return snapshot.docs.map((doc) => doc.data());
}
