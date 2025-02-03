import type { Team } from '@haus23/tipprunde-model';
import type { ColumnDef } from '@tanstack/react-table';
import { PenIcon } from 'lucide-react';

import { Button } from '@/components/ui/button';

export const actions = {
  onEditClick: (team: Team) => {},
};

export const columns: ColumnDef<Team>[] = [
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
      const team = row.original;
      return (
        <div className="text-right">
          <Button
            variant="outline"
            size="icon"
            onClick={() => actions.onEditClick(team)}
          >
            <PenIcon />
          </Button>
        </div>
      );
    },
  },
];
