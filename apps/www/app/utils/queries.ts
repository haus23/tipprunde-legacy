import {
  AccountSchema,
  type Championship,
  ChampionshipSchema,
  CurrentTipsSchema,
  MatchTipsSchema,
  MatchesSchema,
  PlayerTipsSchema,
  PlayerWithAccountSchema,
} from '@haus23/tipprunde-model';
import { queryOptions } from '@tanstack/react-query';
import * as v from 'valibot';

const backendHost = import.meta.env.VITE_UNTERBAU_SERVER;
const baseUrl = `${backendHost}/api/v1`;

// Small debug helper, usage: await sleep(1000)
const sleep = (delay: number) =>
  new Promise((resolve) => setTimeout(resolve, delay));

async function fetchChampionships() {
  const response = await fetch(`${baseUrl}/championships`);
  return v.parse(v.array(ChampionshipSchema), await response.json());
}

export const championshipsQuery = () =>
  queryOptions({
    queryKey: ['championships'],
    queryFn: fetchChampionships,
  });

async function fetchAccounts() {
  const response = await fetch(`${baseUrl}/accounts`);
  return v.parse(v.array(AccountSchema), await response.json());
}

export const accountsQuery = () =>
  queryOptions({
    queryKey: ['accounts'],
    queryFn: fetchAccounts,
  });

async function fetchPlayers(championshipId: string) {
  const response = await fetch(
    `${baseUrl}/championships/${championshipId}/players`,
  );
  return v.parse(v.array(PlayerWithAccountSchema), await response.json());
}

export const playersQuery = (championshipId: string) =>
  queryOptions({
    queryKey: ['players', championshipId],
    queryFn: () => fetchPlayers(championshipId),
  });

async function fetchMatches(championshipId: string) {
  const response = await fetch(
    `${baseUrl}/championships/${championshipId}/matches`,
  );
  return v.parse(MatchesSchema, await response.json());
}

export const matchesQuery = (championshipId: string) =>
  queryOptions({
    queryKey: ['matches', championshipId],
    queryFn: () => fetchMatches(championshipId),
  });

async function fetchPlayerTips(championshipId: string, accountId: string) {
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

async function fetchMatchTips(championshipId: string, nr: number | null) {
  const query = nr ? `?nr=${nr}` : '';

  const url = `${baseUrl}/championships/${championshipId}/match-tips${query}`;
  const response = await fetch(url);
  return v.parse(MatchTipsSchema, await response.json());
}

export const matchTipsQuery = (championshipId: string, nr: number | null) =>
  queryOptions({
    queryKey: ['match-tips', championshipId, nr],
    queryFn: () => fetchMatchTips(championshipId, nr),
  });

async function fetchCurrentTips(championship: Championship) {
  if (championship.completed) return [];

  const response = await fetch(
    `${baseUrl}/championships/${championship.id}/current-tips`,
  );
  return v.parse(CurrentTipsSchema, await response.json());
}

export const currentTipsQuery = (championship: Championship) =>
  queryOptions({
    queryKey: ['current-tips', championship.id],
    queryFn: () => fetchCurrentTips(championship),
  });
