import type { Championship } from '@haus23/tipprunde-model';
import { championshipIdRegEx } from '@haus23/tipprunde-model';
import { Suspense, use, useEffect } from 'react';
import { Navigate, Outlet, useLocation, useParams } from 'react-router';

import NotFound from '#/app/not-found';
import { useChampionshipPlayers } from '#/hooks/current-data/use-championship-players';
import { useCurrentChampionship } from '#/hooks/current-data/use-current-championship';
import { useMatches } from '#/hooks/current-data/use-matches';
import { useRounds } from '#/hooks/current-data/use-rounds';
import { ensureCurrentData } from '#/state/current-data-store';
import { useSessionStore } from '#/state/session-store';
import { championshipPages } from './championship-pages';

function CurrentDataOutlet({
  championshipId,
}: {
  championshipId: Championship['id'];
}) {
  use(ensureCurrentData(championshipId));
  const { pathname } = useLocation();
  const { rounds } = useRounds();
  const { matches } = useMatches();
  const { championshipPlayers } = useChampionshipPlayers();

  // A page without its data yet (e.g. tips without matches, also after
  // switching the championship) falls back to the dashboard.
  const page = championshipPages.find(
    ({ path }) => path === pathname.split('/')[2],
  );
  if (page && !page.available(rounds, matches, championshipPlayers)) {
    return <Navigate to={`/${championshipId}`} replace />;
  }

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
    <Suspense
      fallback={<p className="mt-5 text-muted-foreground">Lade Turnier ...</p>}
    >
      <CurrentDataOutlet championshipId={currentChampionship.id} />
    </Suspense>
  );
}
