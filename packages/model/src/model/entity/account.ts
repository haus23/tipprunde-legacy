import * as v from 'valibot';

import { IdSchema } from '../id';

// Firebase collection path: /players

export const AccountSchema = v.object({
  id: IdSchema,
  name: v.pipe(v.string(), v.nonEmpty()),
  email: v.optional(
    v.union([v.literal(''), v.pipe(v.string(), v.email())]),
    '',
  ),
});

export type AccountInput = v.InferInput<typeof AccountSchema>;
export type Account = v.InferOutput<typeof AccountSchema>;
