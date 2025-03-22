import { Outlet, createFileRoute } from '@tanstack/react-router';
import {
  championshipsQuery,
  matchesQuery,
  playersQuery,
} from '#/utils/queries';

export const Route = createFileRoute('/$championship')({
  beforeLoad: async ({
    params: { championship: turnier },
    context: { queryClient },
  }) => {
    const championships = await queryClient.ensureQueryData(
      championshipsQuery(),
    );
    const championship =
      championships.find((c) => c.id === turnier) || championships[0];
    return { championship };
  },
  loader: async ({ context: { queryClient, championship } }) => {
    queryClient.prefetchQuery(playersQuery(championship.id));
    queryClient.prefetchQuery(matchesQuery(championship.id));

    return {
      championship,
    };
  },
  component: RouteComponent,
});

function RouteComponent() {
  return <Outlet />;
}
