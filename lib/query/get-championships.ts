import { Championship } from '@haus23/tipprunde-types';
import { db, modelConverter } from '~/lib/firebase';

export const getChampionships = cachedFunction(
  async () => {
    const snapshot = await db
      .collection('championships')
      .where('published', '==', true)
      .orderBy('nr', 'desc')
      .withConverter(modelConverter<Championship>())
      .get();
    return snapshot.docs.map((doc) => doc.data());
  },
  { getKey: () => 'championships' }
);
