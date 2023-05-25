import { Championship, Player } from '@haus23/tipprunde-types';
import { z } from 'zod';

const baseUrl = `${process.env.BACKEND_HOST_URL}/api/v1`;

export async function fetchChampionships() {
  const response = await fetch(`${baseUrl}/championships`);
  return z.array(Championship).parseAsync(await response.json());
}

export async function fetchChampionshipPlayers(championshipId?: string) {
  championshipId = championshipId ?? 'current';

  const response = await fetch(`${baseUrl}/championships/${championshipId}/players`);
  return z.array(Player).parseAsync(await response.json());
}
