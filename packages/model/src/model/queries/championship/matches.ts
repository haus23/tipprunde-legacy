import { z } from 'zod';
import { Match } from '../../entity/championship/match';
import { Round } from '../../entity/championship/round';
import { League } from '../../entity/league';
import { Team } from '../../entity/team';

export const Matches = z.object({
  rounds: z.array(Round),
  matches: z.array(Match),
  teams: z.record(Team),
  leagues: z.record(League),
});

export type Matches = z.infer<typeof Matches>;
