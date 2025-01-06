import type { QueryClient } from '@tanstack/react-query';
import type { LoaderFunctionArgs } from 'react-router';
import { championshipsQuery, matchTipsQuery } from '#/backend/queries';
import { getCurrentChampionship } from '#/utils/app/current-championship.server';

export const matchesLoader =
  (queryClient: QueryClient) =>
  async ({ params, request }: LoaderFunctionArgs) => {
    const nr = new URL(request.url).searchParams.get('nr');

    const championships = await queryClient.ensureQueryData(
      championshipsQuery(),
    );

    const championship = getCurrentChampionship(championships, params);

    const data = await queryClient.ensureQueryData(
      matchTipsQuery(championship.id, nr),
    );

    return data;
  };
