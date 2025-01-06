import { useQuery } from '@tanstack/react-query';
import { useRouteLoaderData } from 'react-router';
import { playersQuery } from '#/backend/queries';
import type { layoutLoader } from '#/routes/_layout.data';

export function usePlayers(championshipId: string) {
  const loaderData = useRouteLoaderData('master') as LoaderType<
    typeof layoutLoader
  >;

  const { data } = useQuery({
    ...playersQuery(championshipId),
    initialData: loaderData.players,
  });

  return data;
}
