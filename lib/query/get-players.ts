import { Player } from '@haus23/tipprunde-types';
import consola from 'consola';
import { db, modelConverter } from '~/lib/firebase';

export async function getPlayers() {
  consola.info(`[${new Date().toLocaleString()}] Querying players`);

  const snapshot = await db.collection('players').withConverter(modelConverter<Player>()).get();
  return snapshot.docs.map((doc) => doc.data());
}
