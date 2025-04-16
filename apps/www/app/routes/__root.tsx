import type { QueryClient } from '@tanstack/react-query';
import type { NavigateOptions, ToOptions } from '@tanstack/react-router';

import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import {
  Outlet,
  createRootRouteWithContext,
  useRouter,
} from '@tanstack/react-router';
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools';
import { RouterProvider } from 'react-aria-components';

import { NotFoundComponent } from '#/components/app/error';
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
  notFoundComponent: NotFoundComponent,
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
      <div className="absolute inset-0 h-[480px] bg-gradient-to-b from-accent-4 to-background opacity-60" />
      <Outlet />
      <TanStackRouterDevtools position="bottom-left" />
      <ReactQueryDevtools buttonPosition="bottom-right" />
    </RouterProvider>
  );
}
