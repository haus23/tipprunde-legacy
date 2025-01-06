import { useQuery } from '@tanstack/react-query';
import { useParams, useRouteLoaderData } from 'react-router';

import { championshipsQuery } from '#/backend/queries';
import type { rootLoader } from '#/routes/_root.data';

export function useOptionalChampionship() {
  const { championshipId } = useParams();
  const loaderData = useRouteLoaderData('root') as LoaderType<
    typeof rootLoader
  >;

  const { data } = useQuery({
    ...championshipsQuery(),
    initialData: loaderData.championships,
  });

  const championship = data.find((c) => c.id === championshipId);

  if (championship) {
    return championship;
  }
  return championshipId ? undefined : data[0];
}

export function useChampionship() {
  const { championshipId } = useParams();
  const loaderData = useRouteLoaderData('root') as LoaderType<
    typeof rootLoader
  >;

  const { data } = useQuery({
    ...championshipsQuery(),
    initialData: loaderData.championships,
  });

  return data.find((c) => c.id === championshipId) || data[0];
}
