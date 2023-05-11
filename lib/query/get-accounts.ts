import type { Account } from '@haus23/tipprunde-types';
import { db, modelConverter } from '~/lib/firebase';

export async function getAccounts() {
  console.info(`[${new Date().toLocaleString()}] Querying accounts`);

  const snapshot = await db.collection('players').withConverter(modelConverter<Account>()).get();
  return snapshot.docs.map((doc) => doc.data());
}
