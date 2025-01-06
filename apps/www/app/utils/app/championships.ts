import { useQuery } from '@tanstack/react-query';
import { useRouteLoaderData } from 'react-router';

import { championshipsQuery } from '#/backend/queries';
import type { rootLoader } from '#/routes/_root.data';

export function useChampionships() {
  const loaderData = useRouteLoaderData('root') as LoaderType<
    typeof rootLoader
  >;

  const { data } = useQuery({
    ...championshipsQuery(),
    initialData: loaderData.championships,
  });

  return data;
}
