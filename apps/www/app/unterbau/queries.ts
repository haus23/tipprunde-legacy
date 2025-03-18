import { AccountSchema, ChampionshipSchema } from '@haus23/tipprunde-model';
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
