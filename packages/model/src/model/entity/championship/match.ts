import { z } from 'zod';
import { MatchDate } from '~/primitives';

// Firebase collection path: /championships/[id]/matches

export const Match = z.object({
  id: z.string(),
  nr: z.number(),
  date: MatchDate,
  result: z.string(),
  points: z.number(),
  roundId: z.string(),
  leagueId: z.string(),
  hometeamId: z.string(),
  awayteamId: z.string(),
});

export type Match = z.infer<typeof Match>;
