import * as v from 'valibot';

import { IdSchema } from '../../id';

export const RoundSchema = v.object({
  id: IdSchema,
  nr: v.pipe(v.number(), v.integer(), v.minValue(1)),
  published: v.optional(v.boolean(), false),
  tipsPublished: v.optional(v.boolean(), false),
  isDoubleRound: v.optional(v.boolean(), false),
  completed: v.optional(v.boolean(), false),
});

export type RoundInput = v.InferInput<typeof RoundSchema>;
export type Round = v.InferOutput<typeof RoundSchema>;
