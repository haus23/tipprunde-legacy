import { Championship } from '@haus23/tipprunde-types';
import consola from 'consola';
import { db, modelConverter } from '~/lib/firebase';

export async function getChampionships() {
  consola.info(`[${new Date().toLocaleString()}] Querying championships`);

  const snapshot = await db
    .collection('championships')
    .where('published', '==', true)
    .orderBy('nr', 'desc')
    .withConverter(modelConverter<Championship>())
    .get();
  return snapshot.docs.map((doc) => doc.data());
}
