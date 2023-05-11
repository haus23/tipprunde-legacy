import { z } from 'zod';

// Firebase collection path: /championships/[id]/players

export const Member = z.object({
  id: z.string(),
  rank: z.number(),
  playerId: z.string(),
  points: z.number(),
  extraPoints: z.number(),
  totalPoints: z.number(),
});

export type Member = z.infer<typeof Member>;
