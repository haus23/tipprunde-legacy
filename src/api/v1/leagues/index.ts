import type { Request, Response } from 'express';

import { getLeagues } from '#app/lib/queries/leagues.ts';

export async function handler(req: Request, res: Response) {
  const data = await getLeagues();
  res.json(data);
}
