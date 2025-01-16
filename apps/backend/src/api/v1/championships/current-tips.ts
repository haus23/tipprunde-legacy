import type { Request, Response } from 'express';

import type { CurrentTipsInput } from '@haus23/tipprunde-model';
import { getMatches } from '#app/lib/queries/championships/matches.ts';
import { getTips } from '#app/lib/queries/championships/tips.ts';
import { getTeams } from '#app/lib/queries/teams.ts';
import { validateChampionship } from '#app/lib/util/validate-championship.ts';

export async function handler(req: Request, res: Response) {
  const championship = await validateChampionship(req);

  if (championship.completed) {
    res.json([]);
    return;
  }

  const matches = (await getMatches(championship)).filter(
    (m) => m.date !== undefined,
  );
  const teams = await getTeams();
  const tips = await getTips(championship);

  const sortedByDate = matches.toSorted((a, b) =>
    (a.date ?? '').localeCompare(b.date ?? ''),
  );
  const sortedByPlayed = [
    ...sortedByDate.filter((m) => m.result),
    ...sortedByDate.filter((m) => !m.result),
  ];

  const lastMatchIx = sortedByPlayed.findLastIndex((m) => m.result);

  const currentSliceStart = Math.min(
    Math.max(0, lastMatchIx - 1),
    sortedByPlayed.length - 4,
  );
  const currentSlice = sortedByPlayed.slice(
    currentSliceStart,
    currentSliceStart + 4,
  );

  const currentTips = currentSlice.map((match) => {
    const tipsPerMatch = new Map(
      tips.filter((t) => t.matchId === match.id).map((t) => [t.playerId, t]),
    );
    return {
      matchId: match.id,
      hometeam: teams.find((t) => t.id === match.hometeamId)?.shortname,
      awayteam: teams.find((t) => t.id === match.awayteamId)?.shortname,
      result: match.result,
      tips: Object.fromEntries(tipsPerMatch),
    };
  }) satisfies CurrentTipsInput;

  res.json(currentTips);
}
