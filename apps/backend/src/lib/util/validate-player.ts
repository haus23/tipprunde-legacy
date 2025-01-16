import type { ChampionshipInput } from '@haus23/tipprunde-model';
import type { Request } from 'express';

import { getAccounts } from '../queries/accounts.ts';
import { getPlayers } from '../queries/championships/players.ts';
import { ValidationError } from './validation-error.ts';

/**
 * Validates accountId in request
 *
 * @param req The request object
 * @param championship Championship to lookup the account
 * @returns Player
 */
export async function validatePlayer(
  req: Request,
  championship: ChampionshipInput,
) {
  const { name: accountId } = req.query;
  const players = await getPlayers(championship);

  if (players.length === 0) {
    throw new ValidationError({
      statusCode: 400,
      error: 'Championship has no players',
    });
  }

  if (!accountId) {
    return players[0];
  }

  // Validate account
  const accounts = await getAccounts();
  const account = accounts.find((acc) => acc.id === accountId);

  if (!account) {
    throw new ValidationError({
      statusCode: 406,
      error: 'Unknown account',
    });
  }

  // Validate account is playing this championship
  const player = players.find((p) => p.playerId === account.id);

  if (!player) {
    throw new ValidationError({
      statusCode: 404,
      error: 'No player with this name in the championship',
    });
  }

  return player;
}
