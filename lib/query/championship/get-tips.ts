import type { Tip } from '@haus23/tipprunde-types';
import { db, modelConverter } from '~/lib/firebase';

export const getTips = cachedFunction(
  async (championshipId: string) => {
    console.info(`[${new Date().toLocaleString()}] Querying tips ${championshipId}`);

    const snapshot = await db
      .collection(`championships/${championshipId}/tips`)
      .withConverter(modelConverter<Tip>())
      .get();
    return snapshot.docs.map((doc) => doc.data());
  },
  {
    maxAge: 10 * 60,
    name: 'tips',
    getKey: (championshipId: string) => championshipId,
  }
);

export async function getTipsByPlayer(championshipId: string, playerId: string) {
  const tips = await getTips(championshipId);

  if (!tips) {
    throw new Error('Error reading tips');
  }

  return tips.filter((t) => t.playerId === playerId);
}

export async function getTipsByMatch(championshipId: string, matchId: string) {
  const tips = await getTips(championshipId);

  if (!tips) {
    throw new Error('Error reading tips');
  }

  return tips.filter((t) => t.matchId === matchId);
}
