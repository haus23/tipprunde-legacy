import { Player } from '@haus23/tipprunde-types';
import { db, modelConverter } from '~/lib/firebase';

export default cachedEventHandler(async () => {
  const snapshot = await db.collection('players').withConverter(modelConverter<Player>()).get();
  return snapshot.docs.map((doc) => doc.data());
});
