import { Account, Player } from '@haus23/tipprunde-types';
import { getMembers } from '~/lib/query/championship/get-members';
import { getAccounts } from '~/lib/query/get-accounts';
import { getChampionshipId } from '~/lib/util/get-championship-id';

export default defineEventHandler(async (event) => {
  const championshipId = await getChampionshipId(event);

  const accounts = await getAccounts();
  const members = await getMembers(championshipId);

  const players = members?.map(
    (r) => ({ ...r, player: Account.parse(accounts?.find((p) => p.id === r.playerId)) } satisfies Player)
  );

  return players;
});
