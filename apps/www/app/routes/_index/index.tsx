import type { PlayerWithAccount } from '@haus23/tipprunde-model';
import { useSuspenseQuery } from '@tanstack/react-query';
import { createFileRoute, useLoaderData } from '@tanstack/react-router';
import { type ColumnDef, createColumnHelper } from '@tanstack/react-table';
import { CalendarIcon } from 'lucide-react';
import { Suspense, useMemo } from 'react';

import { DataTable } from '#/components/ui/data-table';
import { Link } from '#/components/ui/link';
import { currentTipsQuery, playersQuery } from '#/utils/queries';
import { CurrentTips } from './-current-tips';

export const Route = createFileRoute('/_index/')({
  loader: async ({ context: { queryClient, championship } }) => {
    queryClient.prefetchQuery(currentTipsQuery(championship));
  },
  component: RankingComponent,
});

const columnHelper = createColumnHelper<PlayerWithAccount>();

function RankingComponent() {
  const { championship } = useLoaderData({ from: '__root__' });
  const ranking = useSuspenseQuery(playersQuery(championship.id));

  const columns = useMemo(() => {
    const rankColumn = columnHelper.accessor('rank', {
      header: 'Platz',
      cell: ({ cell, table, row }) =>
        cell.getValue() ===
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
          to="/spieler"
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
    return (
      championship.completed
        ? [rankColumn, nameColumn, extraPointsColumn, pointsColumn]
        : [rankColumn, nameColumn, pointsColumn, currentTipsColumn]
    ) as ColumnDef<PlayerWithAccount>[];
  }, [championship]);

  return (
    <div>
      <div className="mx-2 sm:mx-0">
        <h1 className="font-medium text-xl">
          <span className="hidden md:inline">{championship.name} - </span>
          <span>
            {championship.completed ? 'Abschlusstabelle' : 'Aktuelle Tabelle'}
          </span>
        </h1>
      </div>
      <div className="mt-4">
        <DataTable columns={columns} data={ranking.data} />
      </div>
    </div>
  );
}
