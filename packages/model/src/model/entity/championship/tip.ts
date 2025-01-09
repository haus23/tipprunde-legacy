import * as v from 'valibot';

import { ResultSchema } from '../../../primitives';
import { IdSchema } from '../../id';

// Firebase collection path: /championships/[id]/tips

export const TipSchema = v.object({
  id: IdSchema,
  tip: v.optional(ResultSchema, ''),
  joker: v.optional(v.boolean(), false),
  points: v.optional(v.pipe(v.number(), v.minValue(0)), 0),
  lonelyHit: v.optional(v.boolean(), false),
  matchId: IdSchema,
  playerId: IdSchema,
});

export type TipInput = v.InferInput<typeof TipSchema>;
export type Tip = v.InferOutput<typeof TipSchema>;
