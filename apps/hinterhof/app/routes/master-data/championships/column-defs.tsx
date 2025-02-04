import { Checkbox } from '@/components/ui/checkbox';
import type { Championship } from '@haus23/tipprunde-model';
import type { ColumnDef } from '@tanstack/react-table';

export const columns: ColumnDef<Championship>[] = [
  {
    id: 'select-current',
    header: 'Aktuell',
    cell: ({ row }) => (
      <Checkbox
        className="my-2"
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Aktuelles Turnier"
      />
    ),
  },
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
