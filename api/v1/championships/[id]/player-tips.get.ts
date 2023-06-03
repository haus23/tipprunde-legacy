import type { PlayerTips, Tip } from '@haus23/tipprunde-types';
import { getMembers } from '~/lib/query/championship/get-members';
import { getTipsByPlayer } from '~/lib/query/championship/get-tips';
import { getChampionshipId } from '~/lib/util/get-championship-id';

export default defineEventHandler(async (event) => {
  const championshipId = await getChampionshipId(event);
  const accountId = getQuery(event).name;

  const members = (await getMembers(championshipId)) || [];
  const player = members.find((p) => p.playerId === accountId) || members[0];

  const tips = await getTipsByPlayer(championshipId, player.id);
  const tipsByMatch = new Map(tips.map((t) => [t.matchId, t]));
  return { playerId: player.id, tips: Object.fromEntries(tipsByMatch) } satisfies PlayerTips;
});
