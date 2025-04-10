import type { PlayerWithAccount } from '@haus23/tipprunde-model';
import { useSuspenseQuery } from '@tanstack/react-query';
import { createFileRoute, useLoaderData } from '@tanstack/react-router';
import { type ColumnDef, createColumnHelper } from '@tanstack/react-table';
import { useMemo } from 'react';

import { CalendarDaysIcon } from 'lucide-react';
import { DataTable } from '#/components/ui/data-table';
import { playersQuery } from '#/utils/queries';

export const Route = createFileRoute('/')({
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
      meta: { thClasses: 'text-right' },
    });
    const nameColumn = columnHelper.accessor('account.name', {
      header: 'Name',
      meta: { thClasses: 'text-left' },
    });
    const extraPointsColumn = columnHelper.accessor('extraPoints', {
      header: 'Zusatzpunkte',
      meta: { thClasses: 'text-center' },
    });
    const pointsColumn = columnHelper.accessor('totalPoints', {
      header: 'Punkte',
      meta: { thClasses: 'text-center' },
    });
    const currentTipsColumn = columnHelper.display({
      id: 'current-tips',
      header: () => <span className="sr-only">Aktuelle Tips</span>,
      cell: () => <CalendarDaysIcon className="size-5" />,
    });
    return (
      championship.completed
        ? [rankColumn, nameColumn, extraPointsColumn, pointsColumn]
        : [rankColumn, nameColumn, pointsColumn, currentTipsColumn]
    ) as ColumnDef<PlayerWithAccount>[];
  }, [championship]);

  return (
    <div>
      <div>
        <h1 className="font-semibold text-xl">
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
