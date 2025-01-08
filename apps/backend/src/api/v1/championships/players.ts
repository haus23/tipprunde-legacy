import { Account, type PlayerWithAccount } from '@haus23/tipprunde-model';
import type { Request, Response } from 'express';

import { getAccounts } from '#app/lib/queries/accounts.ts';
import { getPlayers } from '#app/lib/queries/championships/players.ts';
import { validateChampionship } from '#app/lib/util/validate-championship.ts';

export async function handler(req: Request, res: Response) {
  const championship = await validateChampionship(req);

  const accounts = await getAccounts();
  const members = await getPlayers(championship);

  const players = members?.map(
    (r) =>
      ({
        ...r,
        account: Account.parse(accounts?.find((p) => p.id === r.playerId)),
      }) satisfies PlayerWithAccount,
  );

  res.json(players);
}
