import * as v from 'valibot';

import { IdSchema } from '../id';
import { UpdatedAtSchema } from '../updatedAt';

// Firebase collection path: /teams

export const TeamSchema = v.object({
  id: IdSchema,
  name: v.pipe(v.string(), v.nonEmpty()),
  shortname: v.pipe(v.string(), v.nonEmpty()),
  updated_at: v.optional(UpdatedAtSchema),
});

export type TeamInput = v.InferInput<typeof TeamSchema>;
export type Team = v.InferOutput<typeof TeamSchema>;
