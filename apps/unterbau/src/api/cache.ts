import { Router } from 'express';
import * as v from 'valibot';
import { storage } from '#app/lib/storage.ts';

export const cacheRouter = Router();

const CacheKeys = v.object({
  keys: v.array(v.string()),
});

cacheRouter.post('/', async (req, res) => {
  const { keys } = v.parse(CacheKeys, req.body);
  const cacheKeys = await storage.getKeys();
  const invalidatedKeys: Array<string> = [];

  for (const key of keys) {
    const effectiveKeys = cacheKeys.filter((k) => k.includes(key));
    for (const effectiveKey of effectiveKeys) {
      invalidatedKeys.push(effectiveKey);
      await storage.removeItem(effectiveKey);
    }
  }

  res.status(200).json({
    invalidatedKeys,
  });
});
