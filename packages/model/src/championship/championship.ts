import * as v from 'valibot';

import { SlugIdSchema } from '../shared/id';
import { ChampionshipIdSchema } from './championship-id';

export const ChampionshipSchema = v.object({
  id: ChampionshipIdSchema,
  name: v.pipe(v.string(), v.nonEmpty()),
  nr: v.pipe(v.number(), v.integer(), v.minValue(1)),
  rulesId: SlugIdSchema,
  published: v.boolean(),
  extraPointsPublished: v.boolean(),
  completed: v.boolean(),
});

export type ChampionshipInput = v.InferInput<typeof ChampionshipSchema>;
export type Championship = v.InferOutput<typeof ChampionshipSchema>;
