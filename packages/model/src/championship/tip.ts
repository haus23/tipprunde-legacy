import * as v from 'valibot';

import { ResultSchema } from '../primitives';
import { DocumentIdSchema } from '../shared/document-id';

export const TipSchema = v.object({
  id: DocumentIdSchema,
  tip: ResultSchema,
  joker: v.boolean(),
  points: v.optional(v.pipe(v.number(), v.minValue(0))),
  lonelyHit: v.optional(v.boolean()),
  matchId: DocumentIdSchema,
  playerId: DocumentIdSchema,
});

export type TipInput = v.InferInput<typeof TipSchema>;
export type Tip = v.InferOutput<typeof TipSchema>;
