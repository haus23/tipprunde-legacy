import { z } from 'zod';

export const ChampionshipId = z
  .string()
  .regex(/^[a-z]{2}\d{4}$/, 'Bad championship id');
export type ChampionshipId = z.infer<typeof ChampionshipId>;

export const MatchDate = z
  .string()
  .regex(/^\d{4}-[01]\d-[0-3]\d$|^$/, 'Bad date format');
export type MatchDate = z.infer<typeof MatchDate>;

export const Result = z
  .string()
  .regex(/^\d{1,2}:\d{1,2}$|^$/, 'Bad match result or tip');
export type Result = z.infer<typeof Result>;
