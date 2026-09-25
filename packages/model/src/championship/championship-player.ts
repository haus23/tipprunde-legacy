import * as v from 'valibot';

import { DocumentIdSchema } from '../shared/document-id';
import { SlugIdSchema } from '../shared/id';

export const ChampionshipPlayerSchema = v.object({
  id: DocumentIdSchema,
  playerId: SlugIdSchema,
  nr: v.pipe(v.number(), v.integer(), v.minValue(1)),
  rank: v.pipe(v.number(), v.integer(), v.minValue(1)),
  points: v.number(),
  extraPoints: v.number(),
  totalPoints: v.number(),
});

export type ChampionshipPlayerInput = v.InferInput<
  typeof ChampionshipPlayerSchema
>;
export type ChampionshipPlayer = v.InferOutput<typeof ChampionshipPlayerSchema>;
