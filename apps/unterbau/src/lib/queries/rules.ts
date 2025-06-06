import type { RulesetInput } from '@haus23/tipprunde-model';

import { cachedFunction } from '../cached.ts';
import { db, modelConverter } from '../firebase/index.ts';

export const getRules = cachedFunction(
  async () => {
    console.info(`[${new Date().toLocaleString()}] Querying rules`);

    const snapshot = await db
      .collection('rules')
      .withConverter(modelConverter<RulesetInput>())
      .get();
    return snapshot.docs.map((doc) => doc.data());
  },
  {
    name: 'rules',
    getKey: () => 'list',
  },
);
