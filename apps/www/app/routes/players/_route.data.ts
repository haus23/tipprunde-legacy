import type { QueryClient } from '@tanstack/react-query';
import type { LoaderFunctionArgs } from 'react-router';
import {
  championshipsQuery,
  playerTipsQuery,
  playersQuery,
} from '#/backend/queries';
import { getCurrentChampionship } from '#/utils/app/current-championship.server';
import { getCurrentPlayer } from '#/utils/app/current-player.server';

export const playersLoader =
  (queryClient: QueryClient) =>
  async ({ params, request }: LoaderFunctionArgs) => {
    const championships = await queryClient.ensureQueryData(
      championshipsQuery(),
    );
    const championship = getCurrentChampionship(championships, params);

    const players = await queryClient.ensureQueryData(
      playersQuery(championship.id),
    );

    if (players.length === 0) {
      return {
        state: 'error',
        error: 'Bisher keine Spieler in dieser Runde.',
      } as const;
    }

    const player = await getCurrentPlayer(queryClient, players, request);

    const data = await queryClient.ensureQueryData(
      playerTipsQuery(championship.id, player.account.id),
    );

    return { state: 'success', ...data } as const;
  };
