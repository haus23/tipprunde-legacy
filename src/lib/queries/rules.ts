import type { Rule } from '@haus23/tipprunde-types';

import { env } from '#app/env.ts';
import { cachedFunction } from '../cached.ts';
import { db, modelConverter } from '../firebase/index.ts';

export const getRules = cachedFunction(
  async () => {
    console.info(`[${new Date().toLocaleString()}] Querying rules`);

    const snapshot = await db
      .collection('rules')
      .withConverter(modelConverter<Rule>())
      .get();
    return snapshot.docs.map((doc) => doc.data());
  },
  {
    maxAge: env.MAX_AGE,
    name: 'rules',
    getKey: () => 'list',
  },
);
