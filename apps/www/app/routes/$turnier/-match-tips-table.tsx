import type {
  ChampionshipPlayerWithAccount,
  Tip,
} from '@haus23/tipprunde-model';
import {
  ChevronDownIcon,
  ChevronsUpDownIcon,
  ChevronUpIcon,
} from 'lucide-react';
import { useMemo, useState } from 'react';
import { TipCell } from '#/components/app/tip-cell';
import { Button } from '#/components/ui/button';
import { Link } from '#/components/ui/link';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '#/components/ui/table';

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

export function MatchTipsTable({
  championshipId,
  className,
  players,
  showPoints,
  tips: matchTips,
}: {
  championshipId: string;
  className?: string;
  players: ChampionshipPlayerWithAccount[];
  showPoints: boolean;
  tips: Partial<Tip>[];
}) {
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

  return (
    <div className={className}>
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
              <TableRow key={tip.playerId}>
                <TableCell className="w-full max-sm:first:pl-2">
                  <Link
                    className="block py-1"
                    to="/$turnier/spieler"
                    params={{ turnier: championshipId }}
                    search={{ name: player?.account.id }}
                  >
                    {player?.account.name}
                  </Link>
                </TableCell>
                <TipCell tip={tip} />
                <TableCell className="text-center tabular-nums">
                  {showPoints && tip.tip ? tip.points : undefined}
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}
