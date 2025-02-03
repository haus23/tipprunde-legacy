import type { Account } from '@haus23/tipprunde-model';
import type { ColumnDef } from '@tanstack/react-table';
import { PenIcon } from 'lucide-react';

import { Button } from '@/components/ui/button';

export const actions = {
  onEditClick: (account: Account) => {},
};

export const columns: ColumnDef<Account>[] = [
  {
    accessorKey: 'name',
    header: 'Name',
  },
  {
    accessorKey: 'email',
    header: 'Email',
  },
  {
    id: 'actions',
    cell: ({ row }) => {
      const account = row.original;
      return (
        <div className="text-right">
          <Button
            variant="outline"
            size="icon"
            onClick={() => actions.onEditClick(account)}
          >
            <PenIcon />
          </Button>
        </div>
      );
    },
  },
];
