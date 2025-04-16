import type { Tip } from '@haus23/tipprunde-model';
import { useSuspenseQuery } from '@tanstack/react-query';
import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { type ColumnDef, createColumnHelper } from '@tanstack/react-table';
import {
  CheckIcon,
  ChevronDownIcon,
  ChevronUpIcon,
  ChevronsUpDownIcon,
  TriangleAlertIcon,
} from 'lucide-react';
import { useMemo } from 'react';
import { Collection, type Key } from 'react-aria-components';
import * as v from 'valibot';
import { Button } from '#/components/ui/button';
import { DataTable } from '#/components/ui/data-table';
import { Header } from '#/components/ui/header';
import { Link } from '#/components/ui/link';
import { ListBoxItem, ListBoxSection } from '#/components/ui/listbox';
import { Popover } from '#/components/ui/popover';
import { Select } from '#/components/ui/select';
import { useChampionship } from '#/utils/app/championship';
import { formatDate } from '#/utils/misc';
import { matchTipsQuery, matchesQuery, playersQuery } from '#/utils/queries';

export const Route = createFileRoute('/$turnier/spiele')({
  validateSearch: v.object({
    nr: v.optional(v.number()),
  }),
  loaderDeps: ({ search: { nr } }) => ({ nr }),
  loader: async ({ deps: { nr }, context: { queryClient, championship } }) => {
    const matches = await queryClient.ensureQueryData(
      matchesQuery(championship.id),
    );

    const match =
      matches.matches.find((m) => m.nr === nr) ||
      matches.matches
        .toSorted((a, b) => (a.date ?? '').localeCompare(b.date ?? ''))
        .findLast((m) => m.result) ||
      matches.matches[0];

    queryClient.prefetchQuery(matchTipsQuery(championship.id, match.nr));
    return { match };
  },
  component: MatchesComponent,
});

const columnHelper = createColumnHelper<Tip>();

function MatchesComponent() {
  const championship = useChampionship();
  const navigate = useNavigate({ from: Route.fullPath });

  const { match } = Route.useLoaderData();
  function selectMatch(key: Key) {
    navigate({ search: (prev) => ({ ...prev, nr: Number(key) }) });
  }

  const { data: players } = useSuspenseQuery(playersQuery(championship.id));
  const {
    data: { tips },
  } = useSuspenseQuery(matchTipsQuery(championship.id, match.nr));

  const {
    data: { matches, rounds, teams, leagues },
  } = useSuspenseQuery(matchesQuery(championship.id));

  const matchTips = useMemo(
    () => players.map((p) => tips[p.id] || { playerId: p.id }),
    [players, tips],
  );

  const columns = useMemo(
    () =>
      [
        columnHelper.accessor(
          (row) => players.find((p) => p.id === row.playerId)?.account.name,
          {
            id: 'player',
            header: (info) => (
              <Button
                onPress={info.header.column.getToggleSortingHandler()}
                className="p-1 text-xs uppercase"
                variant="primary"
              >
                <span>Spieler</span>
                {info.column.getIsSorted() ? (
                  info.column.getIsSorted() === 'asc' ? (
                    <ChevronUpIcon className="size-4" />
                  ) : (
                    <ChevronDownIcon className="size-4" />
                  )
                ) : (
                  <ChevronsUpDownIcon className="size-4" />
                )}
              </Button>
            ),
            cell: (info) => (
              <Link
                className="block py-1"
                to="/$turnier/spieler"
                params={{ turnier: championship.id }}
                search={{
                  name: players.find((p) => p.id === info.row.original.playerId)
                    ?.account.id,
                }}
              >
                {info.getValue()}
              </Link>
            ),
            sortingFn: 'textCaseSensitive',
            meta: {
              thClasses: 'text-left py-1',
              tdClasses: 'w-full',
            },
          },
        ),
        columnHelper.accessor('tip', {
          header: (info) => (
            <Button
              onPress={info.header.column.getToggleSortingHandler()}
              className="p-1 text-xs uppercase"
              variant="primary"
            >
              <span>Tipp</span>
              {info.column.getIsSorted() ? (
                info.column.getIsSorted() === 'asc' ? (
                  <ChevronUpIcon className="size-4" />
                ) : (
                  <ChevronDownIcon className="size-4" />
                )
              ) : (
                <ChevronsUpDownIcon className="size-4" />
              )}
            </Button>
          ),
          cell: ({ row }) => {
            const tip = row.original;
            return (
              <>
                <span>{tip?.tip}</span>
                {(tip?.joker || tip?.lonelyHit) && (
                  <span className="-right-2 -translate-y-1.5 absolute">
                    <Popover offset={4} triggerLabel="Zusatzinfos zum Tipp">
                      <div className="px-4 py-2">
                        {tip?.joker === true && <p>Joker</p>}
                        {tip?.lonelyHit === true && (
                          <p>Einziger richtiger Tipp</p>
                        )}
                      </div>
                    </Popover>
                  </span>
                )}
              </>
            );
          },
          sortingFn: (rowA, rowB) => {
            const [aHome, aAway] = rowA.original.tip.split(':').map(Number);
            const [bHome, bAway] = rowB.original.tip.split(':').map(Number);

            return (aHome - aAway - (bHome - bAway) || aHome - bHome) * -1;
          },
          sortUndefined: 'last',
          meta: {
            cellClasses: 'px-6 md:px-6',
            tdClasses: 'relative text-center tabular-nums',
          },
        }),
        columnHelper.accessor('points', {
          header: (info) => (
            <Button
              onPress={info.header.column.getToggleSortingHandler()}
              className="p-1 text-xs uppercase"
              variant="primary"
            >
              <span>Punkte</span>
              {info.column.getIsSorted() ? (
                info.column.getIsSorted() === 'asc' ? (
                  <ChevronUpIcon className="size-4" />
                ) : (
                  <ChevronDownIcon className="size-4" />
                )
              ) : (
                <ChevronsUpDownIcon className="size-4" />
              )}
            </Button>
          ),
          cell: (info) =>
            matches.find((m) => m.id === info.row.original.matchId)?.result
              ? info.getValue()
              : undefined,
          sortingFn: 'basic',
          sortUndefined: 'last',
          meta: {
            tdClasses: 'text-center tabular-nums',
          },
        }),
      ] as ColumnDef<Tip>[],
    [players, matches, championship],
  );

  return (
    <div>
      <div className="mx-2 flex items-center gap-x-2 sm:mx-0 sm:gap-x-4">
        <h1 className="font-medium text-xl tracking-tight sm:tracking-normal">
          <span className="hidden sm:inline">{championship.name} - </span>
          <span>Tipps für</span>
        </h1>
        <Select
          aria-label="Spielauswahl"
          name="match"
          defaultSelectedKey={match.nr}
          onSelectionChange={selectMatch}
          items={rounds}
        >
          {(r) => (
            <ListBoxSection id={r.id}>
              <Header className="px-1 pt-4 text-gray-11/85 text-sm">
                Runde {r.nr}
              </Header>
              <Collection items={matches.filter((m) => m.roundId === r.id)}>
                {(m) => {
                  const matchStr = `${teams[m.hometeamId]?.shortname || '(noch offen)'} - ${teams[m.awayteamId]?.shortname || '(noch offen)'}`;
                  return (
                    <ListBoxItem id={m.nr} textValue={matchStr}>
                      {({ isSelected }) => (
                        <>
                          <div className="flex items-center gap-x-2">
                            <span>{matchStr}</span>
                            {m.result !== '' && (
                              <span className="font-semibold text-gray-11/80 text-sm group-[.select-value]:hidden">{`(${m.points} Pkt)`}</span>
                            )}
                          </div>
                          {isSelected && <CheckIcon className="size-5" />}
                        </>
                      )}
                    </ListBoxItem>
                  );
                }}
              </Collection>
            </ListBoxSection>
          )}
        </Select>
      </div>
      <div className="mx-2 mt-6 max-w-3xl text-sm md:mx-auto">
        <div className="flex w-full justify-between">
          <div className="space-y-1">
            <p className="font-medium text-xs uppercase">Wann</p>
            <p className="font-semibold text-accent-12">
              {formatDate(match.date)}
            </p>
          </div>
          <div className="space-y-1">
            <p className="font-medium text-xs uppercase">Wo</p>
            <p className="font-semibold text-accent-12">
              {leagues[match.leagueId]?.name}
            </p>
          </div>
          <div className="space-y-1">
            <p className="font-medium text-xs uppercase">Ergebnis</p>
            <p className="text-center font-semibold text-accent-12">
              {match.result}
            </p>
          </div>
          <div className="space-y-1">
            <p className="font-medium text-xs uppercase">Punkte</p>
            <p className="text-center font-semibold text-accent-12">
              {match.result && match.points}
            </p>
          </div>
        </div>
        {rounds.find((r) => r.id === match.roundId)?.isDoubleRound ? (
          <div className="mt-4 flex items-center justify-center gap-x-2 text-gray-11">
            <span className="sm:hidden">
              <Popover
                triggerIcon={TriangleAlertIcon}
                triggerLabel="Doppel-Punkte Rundeninfo"
              >
                <div className="px-4 py-2">
                  Alle erzielten Punkte werden verdoppelt.
                </div>
              </Popover>
            </span>
            <span>Das Spiel läuft in einer Doppelrunde.</span>
            <span className="hidden sm:block">
              Alle erzielten Punkte werden verdoppelt.
            </span>
          </div>
        ) : null}
      </div>
      <DataTable
        columns={columns}
        data={matchTips}
        className="mt-6 text-sm"
        getRowClasses={(row) => {
          const tip = row.original;
          return tip?.joker || tip?.lonelyHit ? 'bg-accent-4' : '';
        }}
      />
    </div>
  );
}
