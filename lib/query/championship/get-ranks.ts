import type { ChampionshipPlayer } from '@haus23/tipprunde-types';
import { db, modelConverter } from '~/lib/firebase';

export async function getRanks(championshipId: string) {
  console.info(`[${new Date().toLocaleString()}] Querying current ranking ${championshipId}`);

  const snapshot = await db
    .collection(`championships/${championshipId}/players`)
    .orderBy('rank', 'asc')
    .withConverter(modelConverter<ChampionshipPlayer>())
    .get();
  return snapshot.docs.map((doc) => doc.data());
}
