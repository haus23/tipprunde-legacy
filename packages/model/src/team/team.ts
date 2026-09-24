import * as v from 'valibot';

import { SlugIdSchema } from '../shared/id';

export const TeamSchema = v.object({
  id: SlugIdSchema,
  name: v.pipe(v.string(), v.nonEmpty()),
  shortname: v.pipe(v.string(), v.nonEmpty()),
});

export type TeamInput = v.InferInput<typeof TeamSchema>;
export type Team = v.InferOutput<typeof TeamSchema>;
