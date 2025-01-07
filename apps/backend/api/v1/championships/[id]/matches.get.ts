import { Matches } from '@haus23/tipprunde-types';
import { getChampionshipId } from '~/lib/util/get-championship-id';
import { getMatches } from '~/lib/query/championship/get-matches';
import { getRounds } from '~/lib/query/championship/get-rounds';
import { getLeagues } from '~/lib/query/get-leagues';
import { getTeams } from '~/lib/query/get-teams';

export default defineEventHandler(async (event) => {
  const championshipId = await getChampionshipId(event);

  const rounds = (await getRounds(championshipId)) || [];
  const matches = (await getMatches(championshipId)) || [];
  const leagues = (await getLeagues()) || [];
  const teams = (await getTeams()) || [];

  // Collect teams
  const currentTeamIds = new Set(matches.map((m) => [m.hometeamId, m.awayteamId]).flat());
  const currentTeams = new Map(teams.filter((t) => currentTeamIds.has(t.id)).map((t) => [t.id, t]));

  // Collect leagues leagues
  const currentLeagueIds = new Set(matches.map((m) => m.leagueId));
  const currentLeagues = new Map(leagues.filter((t) => currentLeagueIds.has(t.id)).map((t) => [t.id, t]));

  const allMatches = {
    rounds,
    matches,
    teams: Object.fromEntries(currentTeams),
    leagues: Object.fromEntries(currentLeagues),
  } satisfies Matches;

  return allMatches;
});
