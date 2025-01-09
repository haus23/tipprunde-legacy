import type { PlayerWithAccountInput } from '@haus23/tipprunde-model';
import type { Request, Response } from 'express';

import { getAccounts } from '#app/lib/queries/accounts.ts';
import { getPlayers } from '#app/lib/queries/championships/players.ts';
import { validateChampionship } from '#app/lib/util/validate-championship.ts';
import { ValidationError } from '#app/lib/util/validation-error.ts';

export async function handler(req: Request, res: Response) {
  const championship = await validateChampionship(req);

  const accounts = await getAccounts();
  const members = await getPlayers(championship);

  const players = members?.map((r) => {
    const account = accounts.find((p) => p.id === r.playerId);
    if (!account)
      throw new ValidationError({
        statusCode: 500,
        error: 'No account for player!',
      });

    return {
      ...r,
      account,
    } satisfies PlayerWithAccountInput;
  });

  res.json(players);
}
