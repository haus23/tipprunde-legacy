import type { League } from '@haus23/tipprunde-model';
import type { ColumnDef } from '@tanstack/react-table';
import { PenIcon } from 'lucide-react';

import { Button } from '@/components/ui/button';

export const actions = {
  onEditClick: (league: League) => {},
};

export const columns: ColumnDef<League>[] = [
  {
    accessorKey: 'name',
    header: 'Name',
  },
  {
    accessorKey: 'shortname',
    header: 'Kürzel',
  },
  {
    id: 'actions',
    cell: ({ row }) => {
      const league = row.original;
      return (
        <div className="text-right">
          <Button
            variant="outline"
            size="icon"
            onClick={() => actions.onEditClick(league)}
          >
            <PenIcon />
          </Button>
        </div>
      );
    },
  },
];
