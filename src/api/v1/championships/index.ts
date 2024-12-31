import type { Request, Response } from 'express';

import { getChampionships } from '#/lib/queries/championships';

export async function handler(req: Request, res: Response) {
  const data = await getChampionships();
  res.json(data);
}
