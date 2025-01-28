import type { Team } from '@haus23/tipprunde-model';
import type { ColumnDef } from '@tanstack/react-table';

export const columns: ColumnDef<Team>[] = [
  {
    accessorKey: 'name',
    header: 'Name',
  },
  {
    accessorKey: 'shortname',
    header: 'Kürzel',
  },
];
