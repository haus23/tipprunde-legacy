import * as v from 'valibot';

import { SlugIdSchema } from '../shared/id';

export const LeagueSchema = v.object({
  id: SlugIdSchema,
  name: v.pipe(v.string(), v.nonEmpty()),
  shortname: v.pipe(v.string(), v.nonEmpty()),
});

export type LeagueInput = v.InferInput<typeof LeagueSchema>;
export type League = v.InferOutput<typeof LeagueSchema>;
