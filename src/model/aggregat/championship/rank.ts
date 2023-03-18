import { z } from 'zod';

export const Rank = z.object({
  id: z.string(),
  rank: z.number(),
  playerId: z.string(),
  playerName: z.string(),
  points: z.number(),
  extraPoints: z.number(),
  totalPoints: z.number(),
});

export type Rank = z.infer<typeof Rank>;
