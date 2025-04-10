import type { Match } from '@haus23/tipprunde-model';
import { useSuspenseQuery } from '@tanstack/react-query';
import {
  createFileRoute,
  useLoaderData,
  useNavigate,
} from '@tanstack/react-router';
import { type ColumnDef, createColumnHelper } from '@tanstack/react-table';
import { useMemo } from 'react';
import type { Key } from 'react-aria-components';
import * as v from 'valibot';

import { CheckIcon } from 'lucide-react';
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
  const navigate = useNavigate({ from: Route.fullPath });
  const { data: players } = useSuspenseQuery(playersQuery(championship.id));

  const { account } = Route.useLoaderData();
  function selectAccount(key: Key) {
    navigate({ search: (prev) => ({ ...prev, name: String(key) }) });
  }

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
                {teams[row.original.hometeamId]?.name || '(noch offen)'} -
                {teams[row.original.awayteamId]?.name || '(noch offen)'}
              </span>
              <span className="md:hidden">
                {teams[row.original.hometeamId]?.shortname || '(noch offen)'} -
                {teams[row.original.awayteamId]?.shortname || '(noch offen)'}
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
      <div className="mx-2 flex items-center gap-x-4 sm:mx-0">
        <h1 className="font-medium text-xl">
          <span className="hidden sm:inline">{championship.name} - </span>
          <span>Tipps für</span>
        </h1>
        <Select
          aria-label="Spielerauswahl"
          defaultSelectedKey={account.id}
          onSelectionChange={selectAccount}
          items={players}
        >
          {(p) => (
            <ListBoxItem id={p.account.id} textValue={p.account.name}>
              {({ isSelected }) => (
                <>
                  <span>{p.account.name}</span>
                  {isSelected && <CheckIcon className="size-5" />}
                </>
              )}
            </ListBoxItem>
          )}
        </Select>
      </div>
      <div>
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
    </div>
  );
}
