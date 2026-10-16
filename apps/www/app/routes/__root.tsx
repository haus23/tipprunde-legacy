import type { QueryClient } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import {
  createRootRouteWithContext,
  HeadContent,
  Outlet,
} from '@tanstack/react-router';
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools';

import { Backdrop } from '#/components/app/backdrop';
import { NotFoundComponent } from '#/components/app/error';
import { RootPendingComponent } from '#/components/app/loading';
import { useDropStaticTitle } from '#/utils/app/title';
import { championshipsQuery } from '#/utils/queries';

export const Route = createRootRouteWithContext<{
  queryClient: QueryClient;
}>()({
  beforeLoad: async ({ context: { queryClient } }) => {
    const championships = await queryClient.query({
      ...championshipsQuery(),
      staleTime: 'static',
    });
    return { championships };
  },
  head: () => ({ meta: [{ title: 'runde.tips' }] }),
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  pendingComponent: RootPendingComponent,
});

function RootComponent() {
  useDropStaticTitle();
  return (
    <>
      <HeadContent />
      <Backdrop />
      <Outlet />
      <TanStackRouterDevtools position="bottom-left" />
      <ReactQueryDevtools buttonPosition="bottom-right" />
    </>
  );
}
