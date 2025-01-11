import type {
  ChampionshipInput,
  PlayerInput,
  TipInput,
} from '@haus23/tipprunde-model';
import { cachedFunction } from '#app/lib/cached.ts';
import { db, modelConverter } from '#app/lib/firebase/index.ts';

const getTips = cachedFunction(
  async (championship: ChampionshipInput) => {
    console.info(
      `[${new Date().toLocaleString()}] Querying tips ${championship.id}`,
    );

    const snapshot = await db
      .collection(`championships/${championship.id}/tips`)
      .withConverter(modelConverter<TipInput>())
      .get();
    return snapshot.docs.map((doc) => doc.data());
  },
  {
    getBase: (championship) => (championship.completed ? 'archive' : ''),
    name: 'championships',
    getKey: (championship) => `${championship.id}:tips`,
  },
);

export async function getTipsByPlayer(
  player: PlayerInput,
  championship: ChampionshipInput,
) {
  const tips = await getTips(championship);

  return tips.filter((t) => t.playerId === player.id);
}
