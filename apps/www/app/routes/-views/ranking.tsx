import type { Championship, PlayerWithAccount } from '@haus23/tipprunde-model';

import { DataTable } from '#/components/ui/data-table';

const columns = [
  { accessorKey: 'rank', header: 'Platz' },
  { accessorKey: 'account.name', header: 'Name' },
  { accessorKey: 'points', header: 'Punkte' },
];

namespace RankingView {
  export interface Props {
    championship: Championship;
    ranking: PlayerWithAccount[];
  }
}

export function RankingView({ championship, ranking }: RankingView.Props) {
  return (
    <div>
      <h1 className="mx-2 text-2xl sm:mx-0">
        <span className="hidden md:inline">{championship.name} - </span>
        <span>
          {championship.completed ? 'Abschlusstabelle' : 'Aktuelle Tabelle'}
        </span>
      </h1>
      <DataTable columns={columns} data={ranking} />
    </div>
  );
}
