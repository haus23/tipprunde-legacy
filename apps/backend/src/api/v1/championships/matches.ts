import type { MatchesInput } from '@haus23/tipprunde-model';
import type { Request, Response } from 'express';

import { getMatches } from '#app/lib/queries/championships/matches.ts';
import { getRounds } from '#app/lib/queries/championships/rounds.ts';
import { getLeagues } from '#app/lib/queries/leagues.ts';
import { getTeams } from '#app/lib/queries/teams.ts';
import { validateChampionship } from '#app/lib/util/validate-championship.ts';

export async function handler(req: Request, res: Response) {
  const championship = await validateChampionship(req);

  const matches = await getMatches(championship);
  const leagues = await getLeagues();
  const teams = await getTeams();

  // Collect effective leagues
  const currentLeagueIds = new Set(
    matches.map((m) => m.leagueId).filter((id) => id !== undefined),
  );
  const currentLeagues = new Map(
    leagues.filter((t) => currentLeagueIds.has(t.id)).map((t) => [t.id, t]),
  );

  // Collect effective teams
  const currentTeamIds = new Set(
    matches.flatMap((m) =>
      [m.hometeamId, m.awayteamId].filter((id) => id !== undefined),
    ),
  );
  const currentTeams = new Map(
    teams.filter((t) => currentTeamIds.has(t.id)).map((t) => [t.id, t]),
  );

  res.json({
    rounds: await getRounds(championship),
    matches: matches,
    leagues: Object.fromEntries(currentLeagues),
    teams: Object.fromEntries(currentTeams),
  } satisfies MatchesInput);
}
