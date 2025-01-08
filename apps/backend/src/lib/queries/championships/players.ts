import type { Championship, Player } from '@haus23/tipprunde-model';
import { cachedFunction } from '#app/lib/cached.ts';
import { db, modelConverter } from '#app/lib/firebase/index.ts';

export const getPlayers = cachedFunction(
  async (championship: Championship) => {
    console.info(
      `[${new Date().toLocaleString()}] Querying members ${championship.id}`,
    );

    const snapshot = await db
      .collection(`championships/${championship.id}/players`)
      .orderBy('rank', 'asc')
      .withConverter(modelConverter<Player>())
      .get();
    return snapshot.docs.map((doc) => doc.data());
  },
  {
    getBase: (championship) => (championship.completed ? 'archive' : ''),
    name: 'championships',
    getKey: (championship) => `${championship.id}:players`,
  },
);
