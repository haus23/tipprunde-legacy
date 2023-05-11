import { z } from 'zod';

// Joined with Player entity

export const ChampionshipPlayer = z.object({
  id: z.string(),
  rank: z.number(),
  playerId: z.string(),
  playerName: z.string(),
  points: z.number(),
  extraPoints: z.number(),
  totalPoints: z.number(),
});

export type ChampionshipPlayer = z.infer<typeof ChampionshipPlayer>;
