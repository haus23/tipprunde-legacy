import type { Championship } from '@haus23/tipprunde-model';
import { championshipIdRegEx } from '@haus23/tipprunde-model';
import { Suspense, use, useEffect } from 'react';
import { Outlet, useParams } from 'react-router';

import NotFound from '#/app/not-found';
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
  const { turnier } = useParams();
  const { currentChampionship } = useCurrentChampionship();
  const setCurrentChampionshipId = useSessionStore(
    (state) => state.setCurrentChampionshipId,
  );

  // Remember the championship for routes without it in the URL
  useEffect(() => {
    if (currentChampionship) setCurrentChampionshipId(currentChampionship.id);
  }, [currentChampionship, setCurrentChampionshipId]);

  // The first path segment can be any unknown page, too
  if (!currentChampionship) {
    return (
      <NotFound
        message={
          turnier && championshipIdRegEx.test(turnier)
            ? `Ein Turnier „${turnier}“ gibt es nicht.`
            : undefined
        }
      />
    );
  }

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
