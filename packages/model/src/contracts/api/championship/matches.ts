import * as v from 'valibot';

import { MatchSchema } from '../../../championship/match';
import { RoundSchema } from '../../../championship/round';
import { LeagueSchema } from '../../../league/league';
import { TeamSchema } from '../../../team/team';

export const ChampionshipMatchesSchema = v.object({
  rounds: v.array(RoundSchema),
  matches: v.array(MatchSchema),
  teams: v.record(v.string(), TeamSchema),
  leagues: v.record(v.string(), LeagueSchema),
});

export type ChampionshipMatchesInput = v.InferInput<
  typeof ChampionshipMatchesSchema
>;
export type ChampionshipMatches = v.InferOutput<
  typeof ChampionshipMatchesSchema
>;
