import type { Match } from '@haus23/tipprunde-model';
import { useSuspenseQuery } from '@tanstack/react-query';
import { createFileRoute, useLoaderData } from '@tanstack/react-router';
import { type ColumnDef, createColumnHelper } from '@tanstack/react-table';
import { useMemo } from 'react';
import * as v from 'valibot';

import { DataTable } from '#/components/ui/data-table';
import { ListBoxItem } from '#/components/ui/listbox';
import { Select } from '#/components/ui/select';
import { formatDate } from '#/utils/misc';
import { matchesQuery, playerTipsQuery, playersQuery } from '#/utils/queries';

const columnHelper = createColumnHelper<Match>();

export const Route = createFileRoute('/spieler_')({
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
  const { data: players } = useSuspenseQuery(playersQuery(championship.id));
  const { account } = Route.useLoaderData();

  const {
    data: { matches, rounds, teams },
  } = useSuspenseQuery(matchesQuery(championship.id));
  const { data: tips } = useSuspenseQuery(
    playerTipsQuery(championship.id, account.id),
  );

  const columns = useMemo(
    () =>
      [
        columnHelper.accessor('nr', {
          header: 'Nr',
        }),
        columnHelper.accessor('date', {
          header: 'Datum',
          cell: ({ cell }) =>
            formatDate(cell.getValue(), { shortIfCurrent: true }),
        }),
        columnHelper.display({
          id: 'match',
          header: 'Spiel',
          cell: ({ row }) => (
            <>
              <span className="hidden md:inline">
                {teams[row.original.hometeamId]?.name || 'TBA'} -
                {teams[row.original.awayteamId]?.name || 'TBA'}
              </span>
              <span className="md:hidden">
                {teams[row.original.hometeamId]?.shortname || 'TBA'} -
                {teams[row.original.awayteamId]?.shortname || 'TBA'}
              </span>
            </>
          ),
        }),
        columnHelper.accessor('result', {
          header: 'Ergebnis',
        }),
        columnHelper.display({
          id: 'tip',
          header: 'Tipp',
          cell: ({ row }) => tips.tips[row.original.id]?.tip,
        }),
        columnHelper.display({
          id: 'points',
          header: 'Punkte',
          cell: ({ row }) =>
            row.original.result && (tips.tips[row.original.id]?.points ?? 0),
        }),
      ] as ColumnDef<Match>[],
    [teams, tips],
  );

  return (
    <div>
      <h1 className="text-2xl">Spieler {account.name}</h1>
      <Select label="Spieler" defaultSelectedKey={account.id} items={players}>
        {(p) => <ListBoxItem id={p.account.id}>{p.account.name}</ListBoxItem>}
      </Select>
      {rounds.map((r) => {
        const matchesInRound = matches.filter((m) => m.roundId === r.id);
        return (
          <div key={r.id}>
            <h3>Runde {r.nr}</h3>
            <DataTable columns={columns} data={matchesInRound} />
          </div>
        );
      })}
    </div>
  );
}
