import type { Match, MatchTips } from '@haus23/tipprunde-types';
import { getMatches } from '~/lib/query/championship/get-matches';
import { getTipsByMatch } from '~/lib/query/championship/get-tips';
import { getChampionshipId } from '~/lib/util/get-championship-id';

export default defineEventHandler(async (event) => {
  const championshipId = await getChampionshipId(event);
  const matchNr = getQuery(event).nr;

  const matches = (await getMatches(championshipId)) || [];
  let match: Match | undefined;

  // Without nr query: search the last played match or the first if none played
  if (!matchNr) {
    match = [...matches].sort((a, b) => a.date.localeCompare(b.date)).findLast((m) => m.result) || matches[0];
  } else {
    match = matches.find((m) => m.nr === Number(matchNr));
  }

  if (!match) {
    throw createError({
      status: 404,
      statusMessage: 'Not found',
      message: 'Unknown match nr'
    })
  };

  const tips = await getTipsByMatch(championshipId, match.id);
  const tipsByPlayer = new Map(tips.map((t) => [t.playerId, t]));
  return { matchId: match.id, tips: Object.fromEntries(tipsByPlayer) } satisfies MatchTips;
});
