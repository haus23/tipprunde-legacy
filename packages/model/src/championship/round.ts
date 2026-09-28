import * as v from 'valibot';

import { DocumentIdSchema } from '../shared/document-id';

export const RoundSchema = v.object({
  id: DocumentIdSchema,
  nr: v.pipe(v.number(), v.integer(), v.minValue(1)),
  isDoubleRound: v.pipe(
    v.optional(v.boolean(), false),
    v.description(
      'Kennzeichnet eine Runde mit doppelter Wertung. Die Verdopplung gilt beim entsprechenden Runden-Regelwerk zusätzlich zu einem gesetzten Joker.',
    ),
  ),
});

export type RoundInput = v.InferInput<typeof RoundSchema>;
export type Round = v.InferOutput<typeof RoundSchema>;
