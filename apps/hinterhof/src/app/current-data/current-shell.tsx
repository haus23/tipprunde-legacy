import type { Championship } from '@haus23/tipprunde-model';
import { Suspense, use } from 'react';
import { Outlet } from 'react-router';

import { useCurrentChampionship } from '#/hooks/current-data/use-current-championship';
import { ensureCurrentData } from '#/state/current-data-store';

function CurrentDataOutlet({
  championshipId,
}: {
  championshipId?: Championship['id'];
}) {
  use(ensureCurrentData(championshipId));
  return <Outlet />;
}

export default function CurrentShell() {
  const { currentChampionship } = useCurrentChampionship();
  return (
    <div className="relative">
      <h2 className="font-semibold text-2xl">
        {currentChampionship?.name || 'Hinterhof'}
      </h2>
      <Suspense
        fallback={<p className="mt-4 text-gray-500">Lade Turnier ...</p>}
      >
        <CurrentDataOutlet championshipId={currentChampionship?.id} />
      </Suspense>
    </div>
  );
}
