import type { Championship } from '@haus23/tipprunde-model';
import type { ColumnDef } from '@tanstack/react-table';

export const columns: ColumnDef<Championship>[] = [
  {
    accessorKey: 'nr',
    header: 'Nr',
  },
  {
    accessorKey: 'id',
    header: 'Kennung',
  },
  {
    accessorKey: 'name',
    header: 'Name',
  },
];
