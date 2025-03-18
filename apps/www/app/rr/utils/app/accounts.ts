import { useQuery } from '@tanstack/react-query';
import { useRouteLoaderData } from 'react-router';
import { accountsQuery } from '#/backend/queries';
import type { rootLoader } from '#/routes/_root.data';

export function useAccounts() {
  const loaderData = useRouteLoaderData('root') as LoaderType<
    typeof rootLoader
  >;

  const { data } = useQuery({
    ...accountsQuery(),
    initialData: loaderData.accounts,
  });

  return data;
}
