import { z } from 'zod';
import { Match } from '../../entity/match';
import { Tip } from '../../entity/tip';
import { Team } from '../../entity/team';

export const CurrentMatches = z.object({
  matches: z.array(
    Match.extend({
      tips: z.record(Tip),
    })
  ),
  teams: z.record(Team),
});

export type CurrentMatches = z.infer<typeof CurrentMatches>;
