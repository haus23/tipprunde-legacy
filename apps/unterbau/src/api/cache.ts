import { ChampionshipIdSchema } from '@haus23/tipprunde-model';
import type { RequestHandler } from 'express';
import { Router } from 'express';
import { getAuth } from 'firebase-admin/auth';
import * as v from 'valibot';
import { env } from '#app/env.ts';
import { app } from '#app/lib/firebase/app.ts';
import { storage } from '#app/lib/storage.ts';

export const cacheRouter = Router();

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

const allowedUids = new Set(env.CACHE_INVALIDATION_ALLOWED_UIDS);

const requireAuthorizedUser: RequestHandler = async (req, res, next) => {
  const authorization = req.get('authorization');
  const match = authorization?.match(/^Bearer (.+)$/);

  if (!match) {
    res.status(401).json({ status: 401, error: 'Authentication required' });
    return;
  }

  try {
    const token = await getAuth(app).verifyIdToken(match[1]);
    if (!allowedUids.has(token.uid)) {
      res.status(403).json({ status: 403, error: 'Forbidden' });
      return;
    }
  } catch {
    res.status(401).json({ status: 401, error: 'Authentication required' });
    return;
  }

  next();
};

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

cacheRouter.post('/invalidate', requireAuthorizedUser, async (req, res) => {
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
