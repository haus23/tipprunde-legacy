import type { ChampionshipPlayerWithAccount } from '@haus23/tipprunde-model';
import { useSuspenseQuery } from '@tanstack/react-query';
import { createFileRoute } from '@tanstack/react-router';
import type { ColumnDef } from '@tanstack/react-table';
import { createColumnHelper } from '@tanstack/react-table';
import { CalendarIcon } from 'lucide-react';
import { Suspense, useMemo } from 'react';

import { EmptyView } from '#/components/app/empty-view';
import { DataTable } from '#/components/ui/data-table';
import { Link } from '#/components/ui/link';
import { useChampionship } from '#/utils/app/championship';
import { currentTipsQuery, playersQuery } from '#/utils/queries';
import { CurrentTips } from './-current-tips';

export const Route = createFileRoute('/$turnier/')({
  loader: async ({ context: { queryClient, championship } }) => {
    queryClient.prefetchQuery(currentTipsQuery(championship));
  },
  component: RankingComponent,
});

const columnHelper = createColumnHelper<ChampionshipPlayerWithAccount>();

function RankingComponent() {
  const championship = useChampionship();
  const ranking = useSuspenseQuery(playersQuery(championship.id));
  const currentTips = useSuspenseQuery(currentTipsQuery(championship));
  const hasRanking = ranking.data.some((player) => player.rank !== undefined);
  const hasCurrentTips = currentTips.data.length > 0;

  const columns = useMemo(() => {
    const rankColumn = columnHelper.accessor('rank', {
      header: 'Platz',
      cell: ({ cell, table, row }) =>
        cell.getValue() === undefined
          ? '–'
          : cell.getValue() ===
              (table.getCoreRowModel().rows[row.index - 1]?.original.rank || 0)
            ? ''
            : `${cell.getValue()}.`,
      meta: {
        cellClasses: 'text-right',
        tdClasses: 'tabular-nums',
      },
    });
    const nameColumn = columnHelper.accessor('account.name', {
      header: 'Name',
      meta: {
        thClasses: 'text-left md:pl-6',
        tdClasses: 'w-full font-medium',
      },
      cell: (info) => (
        <Link
          className="block py-1"
          to="/$turnier/spieler"
          params={{ turnier: championship.id }}
          search={(prev) => ({ ...prev, name: info.row.original.playerId })}
        >
          {info.getValue()}
        </Link>
      ),
    });
    const extraPointsColumn = columnHelper.accessor('extraPoints', {
      header: () => (
        <>
          <span className="hidden sm:inline">Zusatzpunkte</span>
          <span className="sm:hidden">Zusatzpkt</span>
        </>
      ),
      meta: {
        tdClasses: 'text-center tabular-nums',
      },
      cell: (info) => info.getValue() || '',
    });
    const pointsColumn = columnHelper.accessor('totalPoints', {
      header: () => (
        <>
          <span className="hidden sm:inline">
            {championship.extraPointsPublished ? 'Gesamtpunkte' : 'Punkte'}
          </span>
          <span className="sm:hidden">
            {championship.extraPointsPublished ? 'Gesamt' : 'Punkte'}
          </span>
        </>
      ),
      meta: {
        tdClasses: 'text-center tabular-nums',
      },
      cell: (info) => info.getValue() ?? '',
    });
    const currentTipsColumn = columnHelper.display({
      id: 'current-tips',
      header: () => <span className="sr-only">Aktuelle Tips</span>,
      cell: (info) => (
        <Suspense
          fallback={
            <div className="p-1.5 text-gray-11">
              <CalendarIcon className="size-5" />
            </div>
          }
        >
          <CurrentTips player={info.row.original} />
        </Suspense>
      ),
    });

    if (!hasRanking) {
      return (
        championship.completed || !hasCurrentTips
          ? [nameColumn]
          : [nameColumn, currentTipsColumn]
      ) as ColumnDef<ChampionshipPlayerWithAccount>[];
    }

    return (
      championship.completed
        ? [rankColumn, nameColumn, extraPointsColumn, pointsColumn]
        : championship.extraPointsPublished
          ? [
              rankColumn,
              nameColumn,
              extraPointsColumn,
              pointsColumn,
              currentTipsColumn,
            ]
          : [rankColumn, nameColumn, pointsColumn, currentTipsColumn]
    ) as ColumnDef<ChampionshipPlayerWithAccount>[];
  }, [championship, hasCurrentTips, hasRanking]);

  return (
    <div>
      <div className="mx-2 sm:mx-0">
        <h1 className="font-medium text-xl">
          <span className="hidden md:inline">{championship.name} - </span>
          <span>
            {hasRanking
              ? championship.completed
                ? 'Abschlusstabelle'
                : 'Aktuelle Tabelle'
              : 'Mitspieler'}
          </span>
        </h1>
      </div>
      <div className="mt-4">
        {ranking.data.length > 0 ? (
          <DataTable columns={columns} data={ranking.data} />
        ) : (
          <EmptyView>Noch keine Mitspieler.</EmptyView>
        )}
      </div>
    </div>
  );
}
