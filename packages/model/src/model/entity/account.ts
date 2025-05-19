import * as v from 'valibot';

import { IdSchema } from '../id';
import { UpdatedAtSchema } from '../updatedAt';

// Firebase collection path: /players

export const AccountSchema = v.object({
  id: IdSchema,
  name: v.pipe(v.string(), v.nonEmpty()),
  email: v.optional(
    v.union([v.literal(''), v.pipe(v.string(), v.email())]),
    '',
  ),
  updated_at: v.optional(UpdatedAtSchema),
});

export type AccountInput = v.InferInput<typeof AccountSchema>;
export type Account = v.InferOutput<typeof AccountSchema>;
