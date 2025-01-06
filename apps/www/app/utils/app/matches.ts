import { useQuery } from '@tanstack/react-query';
import { useRouteLoaderData } from 'react-router';
import { matchesQuery } from '#/backend/queries';
import type { layoutLoader } from '#/routes/_layout.data';

export function useMatches(championshipId: string) {
  const loaderData = useRouteLoaderData('master') as LoaderType<
    typeof layoutLoader
  >;

  const { data } = useQuery({
    ...matchesQuery(championshipId),
    initialData: loaderData.matches,
  });

  return data;
}
