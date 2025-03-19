import {
  AccountSchema,
  ChampionshipSchema,
  MatchesSchema,
  PlayerWithAccountSchema,
} from '@haus23/tipprunde-model';
import { queryOptions } from '@tanstack/react-query';
import * as v from 'valibot';

const backendHost = import.meta.env.VITE_UNTERBAU_SERVER;
const baseUrl = `${backendHost}/api/v1`;

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
