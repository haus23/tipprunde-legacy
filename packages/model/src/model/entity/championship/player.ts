import { z } from 'zod';

// Firebase collection path: /championships/[id]/players

export const Player = z.object({
  id: z.string(),
  rank: z.number(),
  playerId: z.string(),
  points: z.number(),
  extraPoints: z.number(),
  totalPoints: z.number(),
});

export type Player = z.infer<typeof Player>;
