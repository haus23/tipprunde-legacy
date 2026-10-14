import type { Championship } from '@haus23/tipprunde-model';
import { Suspense, use, useEffect } from 'react';
import { Navigate, Outlet } from 'react-router';

import { useCurrentChampionship } from '#/hooks/current-data/use-current-championship';
import { ensureCurrentData } from '#/state/current-data-store';
import { useSessionStore } from '#/state/session-store';

function CurrentDataOutlet({
  championshipId,
}: {
  championshipId: Championship['id'];
}) {
  use(ensureCurrentData(championshipId));
  return <Outlet />;
}

export default function CurrentShell() {
  const { currentChampionship } = useCurrentChampionship();
  const setCurrentChampionshipId = useSessionStore(
    (state) => state.setCurrentChampionshipId,
  );

  // Remember the championship for routes without it in the URL
  useEffect(() => {
    if (currentChampionship) setCurrentChampionshipId(currentChampionship.id);
  }, [currentChampionship, setCurrentChampionshipId]);

  // Unknown championship in the URL: start over with the latest one
  if (!currentChampionship) return <Navigate to="/" replace />;

  return (
    <div className="relative">
      <h2 className="font-semibold text-2xl">{currentChampionship.name}</h2>
      <Suspense
        fallback={<p className="mt-4 text-gray-500">Lade Turnier ...</p>}
      >
        <CurrentDataOutlet championshipId={currentChampionship.id} />
      </Suspense>
    </div>
  );
}
