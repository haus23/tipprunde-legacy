import type { Request, Response } from 'express';

import { getChampionships } from '#app/lib/queries/championships.ts';

export async function handler(req: Request, res: Response) {
  const data = await getChampionships();
  res.json(data);
}
