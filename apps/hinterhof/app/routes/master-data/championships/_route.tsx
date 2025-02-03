import { Card } from '@/components/ui/card';
import { DataTable } from '@/components/ui/data-table';
import { Heading } from '@/components/ui/heading';
import { useChampionships } from '@/utils/state/championships';
import { columns } from './column-defs';

export default function ChampionshipsRoute() {
  const { championships } = useChampionships();

  return (
    <div className="grid gap-y-4">
      <header>
        <Heading>Turniere</Heading>
      </header>
      <Card>
        <DataTable columns={columns} data={championships} />
      </Card>
    </div>
  );
}
