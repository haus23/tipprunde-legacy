import * as v from 'valibot';

import { IdSchema } from '../../id';

// Firebase collection path: /championships/[id]/players

export const PlayerSchema = v.object({
  id: IdSchema,
  playerId: IdSchema,
  nr: v.pipe(v.number(), v.integer(), v.minValue(1)),
  rank: v.pipe(v.number(), v.integer(), v.minValue(1)),
  points: v.optional(v.number(), 0),
  extraPoints: v.optional(v.number(), 0),
  totalPoints: v.optional(v.number(), 0),
});

export type PlayerInput = v.InferInput<typeof PlayerSchema>;
export type Player = v.InferOutput<typeof PlayerSchema>;
