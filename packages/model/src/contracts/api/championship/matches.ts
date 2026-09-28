import * as v from 'valibot';

import { MatchSchema } from '#model/championship/match';
import { RoundSchema } from '#model/championship/round';
import { LeagueSchema } from '#model/league/league';
import { TeamSchema } from '#model/team/team';

export const ChampionshipMatchesSchema = v.object({
  rounds: v.array(RoundSchema),
  matches: v.array(MatchSchema),
  teams: v.pipe(
    v.record(v.string(), TeamSchema),
    v.title('Teams nach Team-ID'),
    v.description(
      'Objekt mit der Team-ID als Schlüssel und dem zugehörigen Team als Wert.',
    ),
  ),
  leagues: v.pipe(
    v.record(v.string(), LeagueSchema),
    v.title('Ligen nach Liga-ID'),
    v.description(
      'Objekt mit der Liga-ID als Schlüssel und der zugehörigen Liga als Wert.',
    ),
  ),
});

export type ChampionshipMatchesInput = v.InferInput<
  typeof ChampionshipMatchesSchema
>;
export type ChampionshipMatches = v.InferOutput<
  typeof ChampionshipMatchesSchema
>;
