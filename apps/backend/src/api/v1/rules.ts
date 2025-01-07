import type { Request, Response } from 'express';

import { getRules } from '#app/lib/queries/rules.ts';

export async function handler(req: Request, res: Response) {
  const data = await getRules();
  res.json(data);
}
