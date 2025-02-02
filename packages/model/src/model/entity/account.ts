import * as v from 'valibot';

import { IdSchema } from '../id';

// Firebase collection path: /players

export const AccountSchema = v.object({
  id: IdSchema,
  name: v.pipe(v.string(), v.trim(), v.nonEmpty('Kann nicht leer sein.')),
  email: v.optional(
    v.union([
      v.literal(''),
      v.pipe(v.string(), v.email('Ungültige Email-Adresse.')),
    ]),
    '',
  ),
});

export type AccountInput = v.InferInput<typeof AccountSchema>;
export type Account = v.InferOutput<typeof AccountSchema>;
