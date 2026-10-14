import {
  type Championship,
  ChampionshipCurrentTipsSchema,
  ChampionshipMatchesSchema,
  ChampionshipMatchTipsSchema,
  ChampionshipPlayersSchema,
  ChampionshipPlayerTipsSchema,
  ChampionshipSchema,
} from '@haus23/tipprunde-model';
import { queryOptions } from '@tanstack/react-query';
import * as v from 'valibot';

const backendHost = import.meta.env.VITE_UNTERBAU_SERVER;
const baseUrl = `${backendHost}/api/v1`;

// Loads and validates a JSON resource of the backend. Failed responses throw
// instead of being parsed, so the error page shows the real cause.
async function fetchJson<TSchema extends v.GenericSchema>(
  path: string,
  schema: TSchema,
): Promise<v.InferOutput<TSchema>> {
  const response = await fetch(`${baseUrl}${path}`);
  if (!response.ok) {
    throw new Error(`${response.status} ${response.statusText}: ${path}`);
  }
  return v.parse(schema, await response.json());
}

function fetchChampionships() {
  return fetchJson('/championships', v.array(ChampionshipSchema));
}

export const championshipsQuery = () =>
  queryOptions({
    queryKey: ['championships'],
    queryFn: fetchChampionships,
  });

function fetchPlayers(championshipId: string) {
  return fetchJson(
    `/championships/${championshipId}/players`,
    ChampionshipPlayersSchema,
  );
}

export const playersQuery = (championshipId: string) =>
  queryOptions({
    queryKey: ['players', championshipId],
    queryFn: () => fetchPlayers(championshipId),
  });

function fetchMatches(championshipId: string) {
  return fetchJson(
    `/championships/${championshipId}/matches`,
    ChampionshipMatchesSchema,
  );
}

export const matchesQuery = (championshipId: string) =>
  queryOptions({
    queryKey: ['matches', championshipId],
    queryFn: () => fetchMatches(championshipId),
  });

function fetchPlayerTips(championshipId: string, accountId: string) {
  return fetchJson(
    `/championships/${championshipId}/player-tips?name=${encodeURIComponent(accountId)}`,
    ChampionshipPlayerTipsSchema,
  );
}

export const playerTipsQuery = (championshipId: string, accountId: string) =>
  queryOptions({
    queryKey: ['player-tips', championshipId, accountId],
    queryFn: () => fetchPlayerTips(championshipId, accountId),
  });

function fetchMatchTips(championshipId: string, nr: number | null) {
  const query = nr ? `?nr=${nr}` : '';
  return fetchJson(
    `/championships/${championshipId}/match-tips${query}`,
    ChampionshipMatchTipsSchema,
  );
}

export const matchTipsQuery = (championshipId: string, nr: number | null) =>
  queryOptions({
    queryKey: ['match-tips', championshipId, nr],
    queryFn: () => fetchMatchTips(championshipId, nr),
  });

async function fetchCurrentTips(championship: Championship) {
  if (championship.completed) return [];

  return fetchJson(
    `/championships/${championship.id}/current-tips`,
    ChampionshipCurrentTipsSchema,
  );
}

export const currentTipsQuery = (championship: Championship) =>
  queryOptions({
    queryKey: ['current-tips', championship.id],
    queryFn: () => fetchCurrentTips(championship),
  });
