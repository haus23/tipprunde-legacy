import type { PlayerTipsInput } from '@haus23/tipprunde-model';
import type { Request, Response } from 'express';

import { getTipsByPlayer } from '#app/lib/queries/championships/tips.ts';
import { validateChampionship } from '#app/lib/util/validate-championship.ts';
import { validatePlayer } from '#app/lib/util/validate-player.ts';

export async function handler(req: Request, res: Response) {
  const championship = await validateChampionship(req);
  const player = await validatePlayer(req, championship);

  const tips = await getTipsByPlayer(player, championship);
  const tipsPerMatch = new Map(tips.map((t) => [t.matchId, t]));

  res.json({
    playerId: player.id,
    tips: Object.fromEntries(tipsPerMatch),
  } satisfies PlayerTipsInput);
}
