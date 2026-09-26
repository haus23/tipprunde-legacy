import * as v from 'valibot';

import { DocumentIdSchema } from '../shared/document-id';
import { SlugIdSchema } from '../shared/id';

export const ChampionshipPlayerSchema = v.object({
  id: DocumentIdSchema,
  playerId: SlugIdSchema,
  nr: v.pipe(v.number(), v.integer(), v.minValue(1)),
  rank: v.optional(v.pipe(v.number(), v.integer(), v.minValue(1))),
  points: v.optional(v.number()),
  extraPoints: v.optional(v.number()),
  totalPoints: v.optional(v.number()),
});

export type ChampionshipPlayerInput = v.InferInput<
  typeof ChampionshipPlayerSchema
>;
export type ChampionshipPlayer = v.InferOutput<typeof ChampionshipPlayerSchema>;
