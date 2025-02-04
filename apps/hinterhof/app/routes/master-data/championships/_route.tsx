import { Card } from '@/components/ui/card';
import { DataTable } from '@/components/ui/data-table';
import { Heading } from '@/components/ui/heading';
import { useChampionships } from '@/utils/state/championships';
import type { OnChangeFn, RowSelectionState } from '@tanstack/react-table';
import { columns } from './column-defs';

export default function ChampionshipsRoute() {
  const { championships, currentChampionship, setCurrentChampionship } =
    useChampionships();

  const currentRowSelection = currentChampionship && {
    [currentChampionship.id]: true,
  };
  const changeRowSelection: OnChangeFn<RowSelectionState> = (updater) => {
    if (typeof updater === 'function') {
      const newRowSelection = updater(currentRowSelection || {});
      setCurrentChampionship(
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
