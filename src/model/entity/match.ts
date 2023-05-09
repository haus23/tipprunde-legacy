import { z } from 'zod';
import { MatchDate } from '../../primitives';

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
