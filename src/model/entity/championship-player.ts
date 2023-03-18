import { z } from 'zod';

export const ChampionshipPlayer = z.object({
  id: z.string(),
  playerId: z.string(),
  nr: z.number(),
  points: z.number(),
  extraPoints: z.number(),
  totalPoints: z.number(),
  rank: z.number(),
});

export type ChampionshipPlayer = z.infer<typeof ChampionshipPlayer>;
