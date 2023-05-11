import { CurrentMatches, Tip } from '@haus23/tipprunde-types';
import { getMatches } from '~/lib/query/championship/get-matches';
import { getTips } from '~/lib/query/championship/get-tips';
import { getTeams } from '~/lib/query/get-teams';
import { getChampionshipId } from '~/lib/util/get-championship-id';

export default defineEventHandler(async (event) => {
  const championshipId = await getChampionshipId(event);

  const matches = (await getMatches(championshipId)) || [];
  const tips = (await getTips(championshipId)) || [];
  const teams = (await getTeams()) || [];
  const teamsMap = new Map(teams.map((t) => [t.id, t]));

  // sort matches by date
  matches.sort((a, b) => a.date.localeCompare(b.date));
  // find last match with result
  const lastMatchIx = matches.findLastIndex((m) => m.result);

  let currentSliceStart = Math.min(Math.max(0, lastMatchIx - 1), matches.length - 4);
  const currentSlice = matches.slice(currentSliceStart, currentSliceStart + 4);

  // Collect teams in currentSlice
  const currentTeamIds = new Set(currentSlice.map((m) => [m.hometeamId, m.awayteamId]).flat());
  const currentTeams = new Map(teams.filter((t) => currentTeamIds.has(t.id)).map((t) => [t.id, t]));

  // add teams and the tips by players
  const currentMatches = {
    matches: currentSlice.map((match) => {
      const tipsPerMatch = new Map(tips.filter((t) => t.matchId === match.id).map((t) => [t.playerId, t]));
      return {
        ...match,
        tips: Object.fromEntries(tipsPerMatch),
      };
    }),
    teams: Object.fromEntries(currentTeams),
  } satisfies CurrentMatches;

  return currentMatches;
});
