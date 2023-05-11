import { z } from 'zod';
import { Match } from '~/model/entity/championship/match';
import { Tip } from '~/model/entity/championship/tip';
import { Team } from '~/model/entity/team';

export const CurrentMatches = z.object({
  matches: z.array(
    Match.extend({
      tips: z.record(Tip),
    })
  ),
  teams: z.record(Team),
});

export type CurrentMatches = z.infer<typeof CurrentMatches>;
