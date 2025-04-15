import type { QueryClient } from '@tanstack/react-query';
import type { NavigateOptions, ToOptions } from '@tanstack/react-router';

import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import {
  Outlet,
  createRootRouteWithContext,
  useRouter,
} from '@tanstack/react-router';
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools';
import { Suspense } from 'react';
import { RouterProvider } from 'react-aria-components';

import { SplashScreen } from '#/components/app/splash-screen';
import { championshipsQuery } from '#/utils/queries';

export const Route = createRootRouteWithContext<{
  queryClient: QueryClient;
}>()({
  beforeLoad: async ({ context: { queryClient } }) => {
    const championships = await queryClient.ensureQueryData(
      championshipsQuery(),
    );
    return { championships };
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
        <Outlet />
      </Suspense>
      <TanStackRouterDevtools position="bottom-left" />
      <ReactQueryDevtools buttonPosition="bottom-right" />
    </RouterProvider>
  );
}
