import type { Request, Response } from 'express';

import { getRules } from '#app/lib/queries/rules.ts';

export async function handler(_req: Request, res: Response) {
  const data = await getRules();
  res.json(data);
}
