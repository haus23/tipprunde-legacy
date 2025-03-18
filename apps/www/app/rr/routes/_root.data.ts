import type { QueryClient } from '@tanstack/react-query';

import { accountsQuery, championshipsQuery } from '#/backend/queries';

export const rootLoader = (queryClient: QueryClient) => async () => {
  const championships = await queryClient.ensureQueryData(championshipsQuery());
  const accounts = await queryClient.ensureQueryData(accountsQuery());

  return { accounts, championships };
};
