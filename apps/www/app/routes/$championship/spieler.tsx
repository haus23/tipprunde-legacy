import { useSuspenseQuery } from '@tanstack/react-query';
import { createFileRoute, useLoaderData } from '@tanstack/react-router';
import * as v from 'valibot';

import { matchesQuery, playerTipsQuery, playersQuery } from '#/utils/queries';

export const Route = createFileRoute('/$championship/spieler')({
  validateSearch: v.object({
    name: v.optional(v.string()),
  }),
  loaderDeps: ({ search: { name } }) => ({ accountId: name }),
  loader: async ({
    deps: { accountId },
    context: { queryClient, championship },
  }) => {
    const players = await queryClient.ensureQueryData(
      playersQuery(championship.id),
    );
    const account =
      players.find((p) => p.account.id === accountId)?.account ||
      players[0].account;

    queryClient.prefetchQuery(playerTipsQuery(championship.id, account.id));
    return { account };
  },
  component: PlayersComponent,
});

function PlayersComponent() {
  const { championship } = useLoaderData({ from: '__root__' });
  const { account } = Route.useLoaderData();

  const { data: matches } = useSuspenseQuery(matchesQuery(championship.id));
  const { data: tipps } = useSuspenseQuery(
    playerTipsQuery(championship.id, account.id),
  );
  return (
    <div>
      <h1 className="text-2xl">Spieler {account.name}</h1>
      <ul>
        {matches.matches.map((m) => (
          <li key={m.id}>{tipps.tips[m.id].tip}</li>
        ))}
      </ul>
    </div>
  );
}
