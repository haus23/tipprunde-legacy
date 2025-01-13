import type { QueryClient } from '@tanstack/react-query';
import type { LoaderFunctionArgs } from 'react-router';
import {
  championshipsQuery,
  matchTipsQuery,
  matchesQuery,
} from '#/backend/queries';
import { getCurrentChampionship } from '#/utils/app/current-championship.server';

export const matchesLoader =
  (queryClient: QueryClient) =>
  async ({ params, request }: LoaderFunctionArgs) => {
    const nr = new URL(request.url).searchParams.get('nr');

    const championships = await queryClient.ensureQueryData(
      championshipsQuery(),
    );

    const championship = getCurrentChampionship(championships, params);

    const { matches } = await queryClient.ensureQueryData(
      matchesQuery(championship.id),
    );
    if (matches.length === 0) {
      return {
        state: 'error',
        error: 'Bisher keine Spiele in dieser Runde.',
      } as const;
    }

    const data = await queryClient.ensureQueryData(
      matchTipsQuery(championship.id, nr),
    );

    return { state: 'success', ...data } as const;
  };
