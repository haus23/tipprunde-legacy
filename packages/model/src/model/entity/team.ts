import * as v from 'valibot';

import { IdSchema } from '../id';

// Firebase collection path: /teams

export const TeamSchema = v.object({
  id: IdSchema,
  name: v.pipe(v.string(), v.nonEmpty('Kann nicht leer sein.')),
  shortname: v.pipe(v.string(), v.nonEmpty('Kann nicht leer sein.')),
});

export type TeamInput = v.InferInput<typeof TeamSchema>;
export type Team = v.InferOutput<typeof TeamSchema>;
