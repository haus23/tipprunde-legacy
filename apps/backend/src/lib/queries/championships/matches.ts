import type { ChampionshipInput, MatchInput } from '@haus23/tipprunde-model';
import { cachedFunction } from '#app/lib/cached.ts';
import { db, modelConverter } from '#app/lib/firebase/index.ts';

export const getMatches = cachedFunction(
  async (championship: ChampionshipInput) => {
    console.info(
      `[${new Date().toLocaleString()}] Querying matches ${championship.id}`,
    );

    const snapshot = await db
      .collection(`championships/${championship.id}/matches`)
      .orderBy('nr', 'asc')
      .withConverter(modelConverter<MatchInput>())
      .get();
    return snapshot.docs.map((doc) => doc.data());
  },
  {
    getBase: (championship) => (championship.completed ? 'archive' : ''),
    name: 'championships',
    getKey: (championship) => `${championship.id}:matches`,
  },
);
