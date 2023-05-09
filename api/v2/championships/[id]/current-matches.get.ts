import { MatchTips, Tip } from '@haus23/tipprunde-types';
import { getMatches } from '~/lib/query/championship/get-matches';
import { getTips } from '~/lib/query/championship/get-tips';
import { getChampionshipId } from '~/lib/util/get-championship-id';

export default defineEventHandler(async (event) => {
  const championshipId = await getChampionshipId(event);

  const matches = (await getMatches(championshipId)) || [];
  const tips = (await getTips(championshipId)) || [];

  // sort matches by date
  matches.sort((a, b) => a.date.localeCompare(b.date));
  // find last match with result
  const lastMatchIx = matches.findLastIndex((m) => m.result);

  let currentSliceStart = Math.min(Math.max(0, lastMatchIx - 1), matches.length - 4);
  const currentMatches = matches.slice(currentSliceStart, currentSliceStart + 4);

  // add tips by players
  const matchesWithTips = currentMatches.map((match) => {
    const tipsPerMatch = tips.filter((t) => t.matchId === match.id);
    return {
      ...match,
      tips: tipsPerMatch.reduce((accu, t) => ({ ...accu, [t.playerId]: t }), {} as Record<string, Tip>),
    };
  }) satisfies MatchTips[];

  return matchesWithTips;
});
