import { z } from 'zod';
import { Tip } from '~/model/entity/championship/tip';

export const MatchTips = z.object({
  matchId: z.string(),
  tips: z.record(Tip),
});

export type MatchTips = z.infer<typeof MatchTips>;
