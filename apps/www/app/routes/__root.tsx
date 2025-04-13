import { ChampionshipIdSchema } from '@haus23/tipprunde-model';
import type { QueryClient } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import {
  type NavigateOptions,
  Outlet,
  type ToOptions,
  createRootRouteWithContext,
  useRouter,
} from '@tanstack/react-router';
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools';
import { Suspense } from 'react';
import { RouterProvider } from 'react-aria-components';
import * as v from 'valibot';

import { ChampionshipSelect } from '#/components/championship-select';
import { AppHeader } from '#/routes/-app/app-header';
import { SplashScreen } from '#/routes/-app/splash-screen';
import {
  accountsQuery,
  championshipsQuery,
  matchesQuery,
  playersQuery,
} from '#/utils/queries';

import { AppShell } from './-app/app-shell';
import { AppSidebar } from './-app/app-sidebar';

export const Route = createRootRouteWithContext<{
  queryClient: QueryClient;
}>()({
  validateSearch: v.object({
    turnier: v.optional(ChampionshipIdSchema),
  }),
  loaderDeps: ({ search: { turnier } }) => ({ championshipSlug: turnier }),
  beforeLoad: async ({ search: { turnier }, context: { queryClient } }) => {
    const championships = await queryClient.ensureQueryData(
      championshipsQuery(),
    );
    const championship =
      championships.find((c) => c.id === turnier) || championships[0];
    return { championship };
  },
  loader: async ({ context: { queryClient, championship } }) => {
    // Await fast data
    await queryClient.ensureQueryData(accountsQuery());

    // Slow data
    queryClient.prefetchQuery(playersQuery(championship.id));
    queryClient.prefetchQuery(matchesQuery(championship.id));

    return {
      championship,
    };
  },
  component: RootComponent,
});

declare module 'react-aria-components' {
  interface RouterConfig {
    href: ToOptions['to'];
    routerOptions: Omit<NavigateOptions, 'to'>;
  }
}

function RootComponent() {
  const router = useRouter();

  return (
    <RouterProvider
      navigate={(to, options) => router.navigate({ to, ...options })}
      useHref={(to) => router.buildLocation({ to }).href}
    >
      <Suspense fallback={<SplashScreen />}>
        <div className="absolute inset-0 h-[480px] bg-gradient-to-b from-accent-4 to-background opacity-60" />
        <AppShell className="relative isolate min-h-svh w-full">
          <AppSidebar />
          <AppHeader />
          <main className="mx-auto max-w-5xl pt-20 pb-10 sm:px-6 lg:px-8">
            <Outlet />
          </main>
          <ChampionshipSelect />
        </AppShell>
      </Suspense>
      <TanStackRouterDevtools position="bottom-right" />
      <ReactQueryDevtools buttonPosition="bottom-right" />
    </RouterProvider>
  );
}
