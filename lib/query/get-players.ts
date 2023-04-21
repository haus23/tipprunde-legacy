import { Player } from '@haus23/tipprunde-types';
import { db, modelConverter } from '~/lib/firebase';

export async function getPlayers() {
  const snapshot = await db.collection('players').withConverter(modelConverter<Player>()).get();
  return snapshot.docs.map((doc) => doc.data());
}
