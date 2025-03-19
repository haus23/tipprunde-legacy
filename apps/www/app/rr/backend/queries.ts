import {
  CurrentTipsSchema,
  MatchTipsSchema,
  PlayerTipsSchema,
} from '@haus23/tipprunde-model';

import { queryOptions } from '@tanstack/react-query';
import { data } from 'react-router';
import * as v from 'valibot';

async function fetchCurrentTips(championshipId: string) {
  console.log('Fetching current tips', championshipId);
  const response = await fetch(
    `${baseUrl}/championships/${championshipId}/current-tips`,
  );
  return v.parse(CurrentTipsSchema, await response.json());
}

export const currentTipsQuery = (championshipId: string) =>
  queryOptions({
    queryKey: ['current-tips', championshipId],
    queryFn: () => fetchCurrentTips(championshipId),
  });

async function fetchPlayerTips(championshipId: string, accountId: string) {
  console.log('Fetching player tips', championshipId, accountId);
  const query = `?name=${accountId}`;

  const url = `${baseUrl}/championships/${championshipId}/player-tips${query}`;
  const response = await fetch(url);
  return v.parse(PlayerTipsSchema, await response.json());
}

export const playerTipsQuery = (championshipId: string, accountId: string) =>
  queryOptions({
    queryKey: ['player-tips', championshipId, accountId],
    queryFn: () => fetchPlayerTips(championshipId, accountId),
  });

async function fetchMatchTips(championshipId: string, nr: string | null) {
  console.log('Fetching match tips', championshipId, nr);
  const query = nr ? `?nr=${nr}` : '';

  const url = `${baseUrl}/championships/${championshipId}/match-tips${query}`;
  const response = await fetch(url);
  if (!response.ok) {
    if (!nr) {
      throw data('Bisher noch keine Spiele in dieser Runde.', response.status);
    }
    throw data('Dieses Spiel gibt es nicht in dieser Runde.', response.status);
  }

  return v.parse(MatchTipsSchema, await response.json());
}

export const matchTipsQuery = (championshipId: string, nr: string | null) =>
  queryOptions({
    queryKey: ['match-tips', championshipId, nr],
    queryFn: () => fetchMatchTips(championshipId, nr),
  });
