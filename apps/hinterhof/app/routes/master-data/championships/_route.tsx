import { Card } from '@/components/ui/card';
import { DataTable } from '@/components/ui/data-table';
import { Heading } from '@/components/ui/heading';
import { useChampionships } from '@/utils/state/championships';
import { useChampionship } from '@/utils/state/current-championship/championship';
import type { OnChangeFn, RowSelectionState } from '@tanstack/react-table';
import { columns } from './column-defs';

function ChampionshipsRoute() {
  const { championships } = useChampionships();

  const { championship, setChampionship } = useChampionship();

  const currentRowSelection = {
    [championship.id]: true,
  };
  const changeRowSelection: OnChangeFn<RowSelectionState> = (updater) => {
    if (typeof updater === 'function') {
      const newRowSelection = updater(currentRowSelection || {});
      setChampionship(
        championships.find((c) => c.id === Object.keys(newRowSelection)[0]),
      );
    }
  };
  return (
    <div className="grid gap-y-4">
      <header>
        <Heading>Turniere</Heading>
      </header>
      <Card>
        <DataTable
          columns={columns}
          data={championships}
          getRowId={(row) => row.id}
          rowSelection={currentRowSelection}
          onRowSelectionChange={changeRowSelection}
        />
      </Card>
    </div>
  );
}

export { ChampionshipsRoute as Component };
