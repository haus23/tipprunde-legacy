import type { Request, Response } from 'express';

import { getAccounts } from '#app/lib/queries/accounts.ts';

export async function handler(_req: Request, res: Response) {
  const data = await getAccounts();
  res.json(data);
}
