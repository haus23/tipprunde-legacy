import { z } from 'zod';
import { Tip } from '../../entity/championship/tip';

export const CurrentTips = z.array(
  z.object({
    matchId: z.string(),
    hometeam: z.string().optional(),
    awayteam: z.string().optional(),
    result: z.string(),
    tips: z.record(Tip),
  }),
);

export type CurrentTips = z.infer<typeof CurrentTips>;
