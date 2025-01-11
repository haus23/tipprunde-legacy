import type { ChampionshipInput, RoundInput } from '@haus23/tipprunde-model';
import { cachedFunction } from '#app/lib/cached.ts';
import { db, modelConverter } from '#app/lib/firebase/index.ts';

export const getRounds = cachedFunction(
  async (championship: ChampionshipInput) => {
    console.info(
      `[${new Date().toLocaleString()}] Querying rounds ${championship.id}`,
    );

    const snapshot = await db
      .collection(`championships/${championship.id}/rounds`)
      .orderBy('nr', 'asc')
      .withConverter(modelConverter<RoundInput>())
      .get();
    return snapshot.docs.map((doc) => doc.data());
  },
  {
    getBase: (championship) => (championship.completed ? 'archive' : ''),
    name: 'championships',
    getKey: (championship) => `${championship.id}:rounds`,
  },
);
