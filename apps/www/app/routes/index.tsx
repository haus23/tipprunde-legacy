import type { PlayerWithAccount } from '@haus23/tipprunde-model';
import { useSuspenseQuery } from '@tanstack/react-query';
import { createFileRoute, useLoaderData } from '@tanstack/react-router';
import { type ColumnDef, createColumnHelper } from '@tanstack/react-table';
import { useMemo } from 'react';

import { DataTable } from '#/components/ui/data-table';
import { playersQuery } from '#/utils/queries';

export const Route = createFileRoute('/')({
  component: RankingComponent,
});

const columnHelper = createColumnHelper<PlayerWithAccount>();

function RankingComponent() {
  const { championship } = useLoaderData({ from: '__root__' });
  const ranking = useSuspenseQuery(playersQuery(championship.id));

  const columns = useMemo(
    () =>
      [
        columnHelper.accessor('rank', {
          header: 'Platz',
          cell: ({ cell, table, row }) =>
            cell.getValue() ===
            (table.getCoreRowModel().rows[row.index - 1]?.original.rank || 0)
              ? ''
              : `${cell.getValue()}.`,
        }),
        columnHelper.accessor('account.name', { header: 'Name' }),
        columnHelper.accessor('totalPoints', { header: 'Punkte' }),
      ] as ColumnDef<PlayerWithAccount>[],
    [],
  );

  return (
    <div>
      <h1 className="mx-2 text-2xl sm:mx-0">
        <span className="hidden md:inline">{championship.name} - </span>
        <span>
          {championship.completed ? 'Abschlusstabelle' : 'Aktuelle Tabelle'}
        </span>
      </h1>
      <DataTable columns={columns} data={ranking.data} />
    </div>
  );
}
