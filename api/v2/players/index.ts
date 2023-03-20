import { Player } from '@haus23/tipprunde-types';
import { db, modelConverter } from '~/lib/firebase';
import { cachedQuery } from '~/lib/util/cached-query';

export default eventHandler(() => {
  const getPlayers = cachedQuery(
    async function () {
      console.log('Querying');
      const snapshot = await db.collection('players').withConverter(modelConverter<Player>()).get();
      return snapshot.docs.map((doc) => doc.data());
    },
    {
      name: 'entities',
      getKey: () => 'players',
    }
  );
  return getPlayers();
});
