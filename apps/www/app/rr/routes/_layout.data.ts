import type { QueryClient } from '@tanstack/react-query';
import type { LoaderFunctionArgs } from 'react-router';
import {
  championshipsQuery,
  matchesQuery,
  playersQuery,
} from '#/backend/queries';
import { getCurrentChampionship } from '#/utils/app/current-championship.server';

export const layoutLoader =
  (queryClient: QueryClient) =>
  async ({ params }: LoaderFunctionArgs) => {
    const championships = await queryClient.ensureQueryData(
      championshipsQuery(),
    );

    const championship = getCurrentChampionship(championships, params);

    const players = await queryClient.ensureQueryData(
      playersQuery(championship.id),
    );

    const matches = await queryClient.ensureQueryData(
      matchesQuery(championship.id),
    );

    return { matches, players };
  };
