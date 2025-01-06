import type { Player } from '@haus23/tipprunde-types';
import type { QueryClient } from '@tanstack/react-query';
import { data } from 'react-router';
import { accountsQuery } from '#/backend/queries';

export async function getCurrentPlayer(
  queryClient: QueryClient,
  players: Player[],
  request: Request,
) {
  const accountId = new URL(request.url).searchParams.get('name');

  const player = players.find((p) => p.account.id === accountId);

  if (accountId && !player) {
    const accounts = await queryClient.ensureQueryData(accountsQuery());
    const account = accounts.find((acc) => acc.id === accountId);
    if (account) {
      throw data(`${account.name} hat diese Runde nicht gespielt.`);
    }
    throw data(`Keine Ahnung wer hinter '${accountId}' steckt...`);
  }

  return player ?? players[0];
}
