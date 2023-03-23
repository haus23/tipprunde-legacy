import { Championship } from '@haus23/tipprunde-types';
import { db, modelConverter } from '~/lib/firebase';
import { cachedQuery } from '~/lib/util/cached-query';

export const getChampionships = cachedQuery(
  async function () {
    const snapshot = await db
      .collection('championships')
      .where('published', '==', true)
      .orderBy('nr', 'desc')
      .withConverter(modelConverter<Championship>())
      .get();
    return snapshot.docs.map((doc) => doc.data());
  },
  {
    name: 'aggregats',
    getKey: () => 'championships',
  }
);
