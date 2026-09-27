import * as v from 'valibot';

import { MatchSchema } from '#model/championship/match';
import { RoundSchema } from '#model/championship/round';
import { LeagueSchema } from '#model/league/league';
import { TeamSchema } from '#model/team/team';

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
