import { z } from 'zod';
import { Match } from '../../entity/match';
import { Tip } from '../../entity/tip';
import { Team } from '../../entity/team';

export const MatchTips = Match.extend({
  tips: z.record(Tip),
  teams: z.record(Team),
});

export type MatchTips = z.infer<typeof MatchTips>;
