import { Card } from '@/components/ui/card';
import { DataTable } from '@/components/ui/data-table';
import { Heading } from '@/components/ui/heading';
import { useAccounts } from '@/utils/state/accounts';

import { columns } from './columns-defs';

export default function PlayersRoute() {
  const { accounts } = useAccounts();

  return (
    <div>
      <header className="flex items-center justify-between">
        <Heading className="grow">Spieler</Heading>
      </header>

      <Card className="mt-4">
        <DataTable
          columns={columns}
          data={accounts}
          withPagination
          withFilter
        />
      </Card>
    </div>
  );
}
