import type { Request, Response } from 'express';

import { getTeams } from '#app/lib/queries/teams.ts';

export async function handler(req: Request, res: Response) {
  const data = await getTeams();
  res.json(data);
}
