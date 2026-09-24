import * as v from 'valibot';

import { MatchSchema } from '../../entity/championship/match';
import { RoundSchema } from '../../entity/championship/round';
import { LeagueSchema } from '../../entity/league';
import { TeamSchema } from '../../entity/team';

export const MatchesSchema = v.object({
  rounds: v.array(RoundSchema),
  matches: v.array(MatchSchema),
  teams: v.record(v.string(), TeamSchema),
  leagues: v.record(v.string(), LeagueSchema),
});

export type MatchesInput = v.InferInput<typeof MatchesSchema>;
export type Matches = v.InferOutput<typeof MatchesSchema>;
