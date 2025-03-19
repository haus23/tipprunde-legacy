import { ChampionshipIdSchema } from '@haus23/tipprunde-model';
import type { QueryClient } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { Outlet, createRootRouteWithContext } from '@tanstack/react-router';
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools';
import { Suspense } from 'react';
import * as v from 'valibot';

import { SplashScreen } from '#/components/splash-screen';
import {
  accountsQuery,
  championshipsQuery,
  matchesQuery,
  playersQuery,
} from '#/unterbau/queries';

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()(
  {
    validateSearch: v.object({
      turnier: v.optional(ChampionshipIdSchema),
    }),
    loaderDeps: ({ search: { turnier } }) => ({ championshipSlug: turnier }),
    loader: async ({
      deps: { championshipSlug },
      context: { queryClient },
    }) => {
      // Await fast data
      const championships = await queryClient.ensureQueryData(
        championshipsQuery(),
      );
      await queryClient.ensureQueryData(accountsQuery());

      const championship =
        championships.find((c) => c.id === championshipSlug) ||
        championships[0];

      // Slow data
      queryClient.prefetchQuery(playersQuery(championship.id));
      queryClient.prefetchQuery(matchesQuery(championship.id));

      return {
        championship,
      };
    },
    component: RootComponent,
  },
);

function RootComponent() {
  return (
    <>
      <div
        className="absolute inset-0 h-[480px] bg-gradient-to-b from-accent-4 to-transparent opacity-60"
        style={{ width: 'calc(100% + var(--removed-body-scroll-bar-size))' }}
      />
      <Suspense fallback={<SplashScreen />}>
        <div className="relative isolate min-h-svh w-full">
          <Outlet />
        </div>
      </Suspense>
      <TanStackRouterDevtools />
      <ReactQueryDevtools />
    </>
  );
}
