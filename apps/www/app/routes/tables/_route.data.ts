import type { QueryClient } from '@tanstack/react-query';
import type { LoaderFunctionArgs } from 'react-router';
import { championshipsQuery, currentTipsQuery } from '#/backend/queries';
import { getCurrentChampionship } from '#/utils/app/current-championship.server';

export const tablesLoader =
  (queryClient: QueryClient) =>
  async ({ params }: LoaderFunctionArgs) => {
    const championships = await queryClient.ensureQueryData(
      championshipsQuery(),
    );

    const championship = getCurrentChampionship(championships, params);

    const currentTips = await queryClient.ensureQueryData(
      currentTipsQuery(championship.id),
    );

    return { currentTips };
  };
