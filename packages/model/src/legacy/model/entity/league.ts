import * as v from 'valibot';

import { IdSchema } from '../id';

// Firebase collection path: /leagues

export const LeagueSchema = v.object({
  id: IdSchema,
  name: v.pipe(v.string(), v.nonEmpty()),
  shortname: v.pipe(v.string(), v.nonEmpty()),
});

export type LeagueInput = v.InferInput<typeof LeagueSchema>;
export type League = v.InferOutput<typeof LeagueSchema>;
