import { z } from 'zod';
import { Result } from '~/primitives';

// Firebase collection path: /championships/[id]/tips

export const Tip = z.object({
  id: z.string(),
  tip: Result,
  joker: z.boolean(),
  points: z.number(),
  lonelyHit: z.boolean().optional(),
  matchId: z.string(),
  playerId: z.string(),
});

export type Tip = z.infer<typeof Tip>;
