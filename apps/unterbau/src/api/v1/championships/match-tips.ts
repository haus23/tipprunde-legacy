import type { MatchTipsInput } from '@haus23/tipprunde-model';
import type { Request, Response } from 'express';

import { getTipsByMatch } from '#app/lib/queries/championships/tips.ts';
import { validateChampionship } from '#app/lib/util/validate-championship.ts';
import { validateMatch } from '#app/lib/util/validate-match.ts';

export async function handler(req: Request, res: Response) {
  const championship = await validateChampionship(req);
  const match = await validateMatch(req, championship);

  const tips = await getTipsByMatch(match, championship);
  const tipsPerPlayer = new Map(tips.map((t) => [t.playerId, t]));

  res.json({
    matchId: match.id,
    tips: Object.fromEntries(tipsPerPlayer),
  } satisfies MatchTipsInput);
}
