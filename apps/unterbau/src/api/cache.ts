import { ChampionshipIdSchema } from '@haus23/tipprunde-model';
import { Router } from 'express';
import * as v from 'valibot';
import { storage } from '#app/lib/storage.ts';

export const cacheRouter = Router();

const CacheKeys = v.object({
  keys: v.array(v.string()),
});

const CacheInvalidationTargetSchema = v.variant('type', [
  v.object({ type: v.literal('championships') }),
  v.object({
    type: v.literal('championship'),
    id: ChampionshipIdSchema,
  }),
  v.object({
    type: v.literal('collection'),
    name: v.picklist(['accounts', 'teams', 'leagues', 'rules']),
  }),
]);

const CacheInvalidationSchema = v.object({
  targets: v.pipe(v.array(CacheInvalidationTargetSchema), v.nonEmpty()),
});

type CacheInvalidationTarget = v.InferOutput<
  typeof CacheInvalidationTargetSchema
>;

function getCacheKeys(target: CacheInvalidationTarget): string[] {
  switch (target.type) {
    case 'championships':
      return ['championships:list.json'];
    case 'collection':
      return [`${target.name}:list.json`];
    case 'championship':
      return ['matches', 'players', 'rounds', 'tips'].flatMap((resource) => [
        `championships:${target.id}:${resource}.json`,
        `archive:championships:${target.id}:${resource}.json`,
      ]);
  }
}

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

cacheRouter.post('/invalidate', async (req, res) => {
  const request = v.safeParse(CacheInvalidationSchema, req.body);
  if (!request.success) {
    res.status(400).json({
      status: 400,
      error: 'Invalid cache invalidation request',
    });
    return;
  }

  const storedKeys = new Set(await storage.getKeys());
  const requestedKeys = new Set(request.output.targets.flatMap(getCacheKeys));
  const invalidatedKeys = [...requestedKeys].filter((key) =>
    storedKeys.has(key),
  );

  await Promise.all(invalidatedKeys.map((key) => storage.removeItem(key)));

  res.status(200).json({ invalidatedKeys });
});
