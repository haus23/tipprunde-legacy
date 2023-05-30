import { z } from 'zod';
import { Match } from '~/model/entity/championship/match';
import { Round } from '~/model/entity/championship/round';
import { League } from '~/model/entity/league';
import { Team } from '~/model/entity/team';

export const CurrentMatches = z.object({
  rounds: z.array(Round),
  matches: z.array(Match),
  teams: z.record(Team),
  leagues: z.record(League),
});

export type CurrentMatches = z.infer<typeof CurrentMatches>;
