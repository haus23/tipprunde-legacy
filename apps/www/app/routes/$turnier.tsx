import { Outlet, createFileRoute, notFound } from '@tanstack/react-router';
import { Suspense } from 'react';

import { AppShell } from '#/components/app/app-shell';
import { NotFoundComponent } from '#/components/app/error';
import { SplashScreen } from '#/components/app/splash-screen';
import { matchesQuery, playersQuery } from '#/utils/queries';

export const Route = createFileRoute('/$turnier')({
  beforeLoad: ({ context: { championships }, params: { turnier } }) => {
    const championship = championships.find((c) => c.id === turnier);

    if (!championship)
      throw notFound({ data: 'Hoppla, so etwas gibt es bei uns nicht!' });

    return { championship };
  },
  loader: ({ context: { championship, queryClient } }) => {
    queryClient.prefetchQuery(playersQuery(championship.id));
    queryClient.prefetchQuery(matchesQuery(championship.id));

    return { championship };
  },
  component: RouteComponent,
  notFoundComponent: NotFoundComponent,
});

function RouteComponent() {
  return (
    <AppShell>
      <Suspense fallback={<SplashScreen />}>
        <Outlet />
      </Suspense>
    </AppShell>
  );
}
