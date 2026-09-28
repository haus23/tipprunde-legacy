import { MemberSchema } from '@haus23/tipprunde-model';

import { cachedFunction } from '../cached.ts';
import { db, modelConverter } from '../firebase/index.ts';
import { toPublicMember } from '../util/to-public-member.ts';

const getCachedAccounts = cachedFunction(
  async () => {
    console.info(`[${new Date().toLocaleString()}] Querying accounts`);

    const snapshot = await db
      .collection('players')
      .withConverter(modelConverter(MemberSchema))
      .get();
    return snapshot.docs.map((doc) => toPublicMember(doc.data()));
  },
  {
    name: 'accounts',
    getKey: () => 'list',
  },
);

export async function getAccounts() {
  return (await getCachedAccounts()).map(toPublicMember);
}
