import { z } from 'zod';
import { Match } from '../../entity/match';
import { Tip } from '../../entity/tip';

export const MatchTips = Match.extend({
  tips: z.record(Tip),
});

export type MatchTips = z.infer<typeof MatchTips>;
