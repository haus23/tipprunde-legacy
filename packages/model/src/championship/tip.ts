import * as v from 'valibot';

import { ResultSchema } from '../primitives';
import { DocumentIdSchema } from '../shared/document-id';

export const TipSchema = v.object({
  id: DocumentIdSchema,
  tip: ResultSchema,
  joker: v.pipe(
    v.boolean(),
    v.description(
      'Kennzeichnet einen gesetzten Joker, der die reguläre Punktzahl des Tipps verdoppelt.',
    ),
  ),
  points: v.pipe(
    v.optional(v.pipe(v.number(), v.minValue(0))),
    v.description(
      'Berechnete Punktzahl einschließlich Joker-, Runden- und möglichem Alleintreffer-Bonus. Fehlt, solange das Spiel nicht ausgewertet wurde.',
    ),
  ),
  lonelyHit: v.pipe(
    v.optional(v.boolean()),
    v.description(
      'Ist ausschließlich true, wenn nur dieser Tipp für das Spiel Punkte erzielt hat und deshalb den Alleintreffer-Bonus erhält.',
    ),
  ),
  matchId: DocumentIdSchema,
  playerId: DocumentIdSchema,
});

export type TipInput = v.InferInput<typeof TipSchema>;
export type Tip = v.InferOutput<typeof TipSchema>;
