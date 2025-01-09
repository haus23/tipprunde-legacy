import * as v from 'valibot';

import { MatchDateSchema, ResultSchema } from '../../../primitives';
import { IdSchema, OptionalIdSchema } from '../../id';

// Firebase collection path: /championships/[id]/matches

export const MatchSchema = v.object({
  id: IdSchema,
  nr: v.pipe(v.number(), v.integer(), v.minValue(1)),
  date: v.optional(MatchDateSchema, ''),
  result: v.optional(ResultSchema, ''),
  points: v.optional(v.pipe(v.number(), v.minValue(0)), 0),
  roundId: IdSchema,
  leagueId: OptionalIdSchema,
  hometeamId: OptionalIdSchema,
  awayteamId: OptionalIdSchema,
});

export type MatchInput = v.InferInput<typeof MatchSchema>;
export type Match = v.InferOutput<typeof MatchSchema>;
