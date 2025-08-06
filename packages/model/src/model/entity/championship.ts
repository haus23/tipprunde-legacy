import * as v from 'valibot';

import { ChampionshipIdSchema } from '../../primitives';
import { IdSchema } from '../id';
import { UpdatedAtSchema } from '../updatedAt';

export const ChampionshipSchema = v.object({
  id: ChampionshipIdSchema,
  name: v.pipe(v.string(), v.nonEmpty()),
  nr: v.pipe(v.number(), v.integer(), v.minValue(1)),
  rulesId: IdSchema,
  published: v.optional(v.boolean(), false),
  extraPointsPublished: v.optional(v.boolean(), false),
  completed: v.optional(v.boolean(), false),
  updated_at: v.optional(UpdatedAtSchema),
});

export type ChampionshipInput = v.InferInput<typeof ChampionshipSchema>;
export type Championship = v.InferOutput<typeof ChampionshipSchema>;
