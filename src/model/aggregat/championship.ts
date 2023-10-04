import { z } from 'zod';
import { ChampionshipId } from '../../primitives';

export const Championship = z.object({
  id: ChampionshipId,
  name: z.string(),
  nr: z.number().positive(),
  rulesId: z.string(),
  published: z.boolean(),
  extraPointsPublished: z.boolean(),
  completed: z.boolean(),
});

export type Championship = z.infer<typeof Championship>;
