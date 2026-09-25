import * as v from 'valibot';

import { MatchDateSchema, ResultSchema } from '../primitives';
import { DocumentIdSchema } from '../shared/document-id';
import { SlugIdSchema } from '../shared/id';

const OptionalSlugReferenceSchema = v.nullish(
  v.union([v.literal(''), SlugIdSchema]),
  '',
);

export const MatchSchema = v.object({
  id: DocumentIdSchema,
  nr: v.pipe(v.number(), v.integer(), v.minValue(1)),
  date: v.optional(MatchDateSchema, ''),
  result: v.optional(ResultSchema, ''),
  points: v.optional(v.pipe(v.number(), v.minValue(0)), 0),
  roundId: DocumentIdSchema,
  leagueId: OptionalSlugReferenceSchema,
  hometeamId: OptionalSlugReferenceSchema,
  awayteamId: OptionalSlugReferenceSchema,
});

export type MatchInput = v.InferInput<typeof MatchSchema>;
export type Match = v.InferOutput<typeof MatchSchema>;
