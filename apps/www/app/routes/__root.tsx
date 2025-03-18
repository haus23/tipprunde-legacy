import type { QueryClient } from '@tanstack/react-query';
import { Outlet, createRootRouteWithContext } from '@tanstack/react-router';

import { championshipsQuery } from '#/unterbau/queries';

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()(
  {
    loader: async ({ context: { queryClient } }) => {
      const championships = await queryClient.ensureQueryData(
        championshipsQuery(),
      );

      return { championship: championships[0] };
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
      <div className="relative isolate min-h-svh w-full">
        <Outlet />
      </div>
    </>
  );
}
