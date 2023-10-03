import { ChampionshipId } from '@haus23/tipprunde-types';
import { z } from 'zod';

const CacheKeys = z.object({
  routes: z.boolean(),
  resources: z.array(
    z.union([z.literal('accounts'), z.literal('championships'), z.literal('leagues'), z.literal('teams')])
  ),
  standings: ChampionshipId.optional(),
});

type CacheKeys = z.infer<typeof CacheKeys>;

export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  const cacheKeys = CacheKeys.parse(body);

  const clearedCaches = new Array<string>();

  const storage = useStorage('cache');
  const keys = await storage.getKeys();

  if (cacheKeys.routes) {
    keys
      .filter((k) => k.startsWith('nitro:routes:'))
      .forEach(async (k) => {
        await storage.removeItem(k, true);
        clearedCaches.push(k);
      });
  }

  cacheKeys.resources.forEach(async (resourceKey) => {
    const cacheItemKey = keys.find((k) => k.includes(`:${resourceKey}:`));
    if (cacheItemKey) {
      await storage.removeItem(cacheItemKey, true);
      clearedCaches.push(cacheItemKey);
    }
  });

  if (cacheKeys.standings) {
    keys
      .filter((k) => k.endsWith(`:${cacheKeys.standings}.json`))
      .forEach(async (k) => {
        await storage.removeItem(k, true);
        clearedCaches.push(k);
      });
  }

  return { cleared: clearedCaches };
});
