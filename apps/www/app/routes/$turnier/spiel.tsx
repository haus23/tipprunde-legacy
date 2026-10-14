import type { Tip } from '@haus23/tipprunde-model';
import { useSuspenseQuery } from '@tanstack/react-query';
import { createFileRoute, useNavigate } from '@tanstack/react-router';
import {
  ChevronDownIcon,
  ChevronsUpDownIcon,
  ChevronUpIcon,
  TriangleAlertIcon,
} from 'lucide-react';
import { useMemo, useState } from 'react';
import * as v from 'valibot';
import { EmptyView } from '#/components/app/empty-view';
import { Button } from '#/components/ui/button';
import { Link } from '#/components/ui/link';
import { Popover } from '#/components/ui/popover';
import { Select } from '#/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '#/components/ui/table';
import { useChampionship } from '#/utils/app/championship';
import { formatDate } from '#/utils/misc';
import { matchesQuery, matchTipsQuery, playersQuery } from '#/utils/queries';

export const Route = createFileRoute('/$turnier/spiel')({
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

    if (match) {
      queryClient.prefetchQuery(matchTipsQuery(championship.id, match.nr));
    }
    return { match };
  },
  component: MatchesRoute,
});

// The tips table sorts by player, tip or points. Like before, a click cycles
// through the first direction, the opposite one and no sorting.
type SortColumn = 'player' | 'tip' | 'points';
type Sort = { column: SortColumn; direction: 'asc' | 'desc' };
type SortValue = string | number | undefined;

const firstDirection: Record<SortColumn, Sort['direction']> = {
  player: 'asc',
  tip: 'asc',
  points: 'desc',
};

const sortValues: Record<
  SortColumn,
  (tip: Partial<Tip>, playerNames: Map<string, string>) => SortValue
> = {
  player: (tip, playerNames) => playerNames.get(tip.playerId ?? ''),
  tip: (tip) => tip.tip || undefined,
  points: (tip) => tip.points,
};

const compare: Record<
  SortColumn,
  (a: NonNullable<SortValue>, b: NonNullable<SortValue>) => number
> = {
  player: (a, b) => (a < b ? -1 : a > b ? 1 : 0),
  // Home wins first (by goal difference, then by home goals)
  tip: (a, b) => {
    const [aHome, aAway] = String(a).split(':').map(Number);
    const [bHome, bAway] = String(b).split(':').map(Number);
    return (aHome - aAway - (bHome - bAway) || aHome - bHome) * -1;
  },
  points: (a, b) => Number(a) - Number(b),
};

function MatchesRoute() {
  const { match } = Route.useLoaderData();

  if (!match) {
    return (
      <div>
        <h1 className="mx-4 font-medium text-xl sm:mx-0">Spiele</h1>
        <EmptyView>Noch keine Spiele.</EmptyView>
      </div>
    );
  }

  return <MatchesComponent match={match} />;
}

function MatchesComponent({
  match,
}: {
  match: NonNullable<ReturnType<typeof Route.useLoaderData>['match']>;
}) {
  const championship = useChampionship();
  const navigate = useNavigate({ from: Route.fullPath });

  function selectMatch(nr: string) {
    navigate({ search: (prev) => ({ ...prev, nr: Number(nr) }) });
  }

  const { data: players } = useSuspenseQuery(playersQuery(championship.id));
  const {
    data: { tips },
  } = useSuspenseQuery(matchTipsQuery(championship.id, match.nr));

  const {
    data: { matches, rounds, teams, leagues },
  } = useSuspenseQuery(matchesQuery(championship.id));

  const matchTips = useMemo(
    () => players.map((p): Partial<Tip> => tips[p.id] || { playerId: p.id }),
    [players, tips],
  );
  const playerNames = useMemo(
    () => new Map(players.map((p) => [p.id, p.account.name])),
    [players],
  );

  const [sort, setSort] = useState<Sort | null>(null);

  const sortedTips = useMemo(() => {
    if (!sort) return matchTips;
    const value = sortValues[sort.column];
    const direction = sort.direction === 'asc' ? 1 : -1;
    return matchTips.toSorted((a, b) => {
      const valueA = value(a, playerNames);
      const valueB = value(b, playerNames);
      // Rows without a value stay at the end in both directions
      if (valueA === undefined || valueB === undefined) {
        return valueA === valueB ? 0 : valueA === undefined ? 1 : -1;
      }
      return compare[sort.column](valueA, valueB) * direction;
    });
  }, [matchTips, playerNames, sort]);

  function toggleSort(column: SortColumn) {
    const first = firstDirection[column];
    setSort((prev) =>
      prev?.column !== column
        ? { column, direction: first }
        : prev.direction === first
          ? { column, direction: first === 'asc' ? 'desc' : 'asc' }
          : null,
    );
  }

  function sortHeader(column: SortColumn, label: string) {
    const direction = sort?.column === column ? sort.direction : undefined;
    return (
      <Button
        onClick={() => toggleSort(column)}
        className="gap-x-1 p-1 font-medium text-xs uppercase hover:bg-selected"
        variant="plain"
      >
        <span>{label}</span>
        {direction === 'asc' ? (
          <ChevronUpIcon className="size-4" aria-hidden="true" />
        ) : direction === 'desc' ? (
          <ChevronDownIcon className="size-4" aria-hidden="true" />
        ) : (
          <ChevronsUpDownIcon
            className="size-4 opacity-50"
            aria-hidden="true"
          />
        )}
      </Button>
    );
  }

  function ariaSort(column: SortColumn) {
    if (sort?.column !== column) return undefined;
    return sort.direction === 'asc' ? 'ascending' : 'descending';
  }

  const matchResult = matches.find((m) => m.id === match.id)?.result;

  return (
    <div>
      <div className="mx-4 flex items-center gap-x-2 sm:mx-0 sm:gap-x-4">
        <h1 className="font-medium text-xl tracking-tight sm:tracking-normal">
          <span className="hidden sm:inline">{championship.name} - </span>
          <span>Tipps für</span>
        </h1>
        <Select
          aria-label="Spielauswahl"
          name="match"
          value={String(match.nr)}
          onValueChange={selectMatch}
          groups={rounds.map((r) => ({
            value: r.id,
            label: `Runde ${r.nr}`,
            options: matches
              .filter((m) => m.roundId === r.id)
              .map((m) => ({
                value: String(m.nr),
                label: `${teams[m.hometeamId]?.shortname || '(noch offen)'} – ${teams[m.awayteamId]?.shortname || '(noch offen)'}`,
                detail:
                  m.result !== '' ? (
                    <span className="font-semibold text-muted-foreground/80 text-sm">{`(${m.points ?? 0} Pkt)`}</span>
                  ) : undefined,
              })),
          }))}
        />
      </div>
      <div className="mx-4 mt-6 max-w-3xl text-sm md:mx-auto">
        <div className="flex w-full justify-between">
          <div className="space-y-1">
            <p className="font-medium text-xs uppercase">Wann</p>
            <p className="font-semibold text-accent-strong">
              {formatDate(match.date)}
            </p>
          </div>
          <div className="space-y-1">
            <p className="font-medium text-xs uppercase">Wo</p>
            <p className="font-semibold text-accent-strong">
              {leagues[match.leagueId]?.name}
            </p>
          </div>
          <div className="space-y-1">
            <p className="font-medium text-xs uppercase">Ergebnis</p>
            <p className="text-center font-semibold text-accent-strong">
              {match.result}
            </p>
          </div>
          <div className="space-y-1">
            <p className="font-medium text-xs uppercase">Punkte</p>
            <p className="text-center font-semibold text-accent-strong">
              {match.result ? (match.points ?? 0) : null}
            </p>
          </div>
        </div>
        {rounds.find((r) => r.id === match.roundId)?.isDoubleRound ? (
          <div className="mt-4 flex items-center justify-center gap-x-2 text-muted-foreground">
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
      <div className="mt-6 text-sm">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead
                className="py-1 text-left max-sm:first:pl-3"
                aria-sort={ariaSort('player')}
              >
                {sortHeader('player', 'Spieler')}
              </TableHead>
              <TableHead className="px-6 md:px-6" aria-sort={ariaSort('tip')}>
                {sortHeader('tip', 'Tipp')}
              </TableHead>
              <TableHead aria-sort={ariaSort('points')}>
                {sortHeader('points', 'Punkte')}
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sortedTips.map((tip) => {
              const player = players.find((p) => p.id === tip.playerId);
              return (
                <TableRow
                  key={tip.playerId}
                  className={
                    tip.joker || tip.lonelyHit ? 'bg-highlight' : undefined
                  }
                >
                  <TableCell className="w-full max-sm:first:pl-2">
                    <Link
                      className="block py-1"
                      to="/$turnier/spieler"
                      params={{ turnier: championship.id }}
                      search={{ name: player?.account.id }}
                    >
                      {player?.account.name}
                    </Link>
                  </TableCell>
                  <TableCell className="px-6 tabular-nums md:px-6">
                    {/* Tip centered, the info icon next to it without moving it */}
                    <div className="grid grid-cols-[1fr_auto_1fr] items-center">
                      <span />
                      <span>{tip.tip}</span>
                      <span className="justify-self-start">
                        {(tip.joker || tip.lonelyHit) && (
                          <Popover
                            offset={4}
                            triggerLabel="Zusatzinfos zum Tipp"
                            triggerClassName="-my-1.5"
                          >
                            <div className="px-4 py-2">
                              {tip.joker === true && <p>Joker</p>}
                              {tip.lonelyHit === true && (
                                <p>Einziger richtiger Tipp</p>
                              )}
                            </div>
                          </Popover>
                        )}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="text-center tabular-nums">
                    {matchResult ? tip.points : undefined}
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
