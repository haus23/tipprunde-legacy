import * as v from 'valibot';

import { DocumentIdSchema } from '../shared/document-id';

export const RoundSchema = v.object({
  id: DocumentIdSchema,
  nr: v.pipe(v.number(), v.integer(), v.minValue(1)),
  isDoubleRound: v.optional(v.boolean(), false),
});

export type RoundInput = v.InferInput<typeof RoundSchema>;
export type Round = v.InferOutput<typeof RoundSchema>;
