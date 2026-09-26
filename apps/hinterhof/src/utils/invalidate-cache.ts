export type CacheInvalidationTarget =
  | { type: 'championships' }
  | { type: 'championship'; id: string }
  | {
      type: 'collection';
      name: 'accounts' | 'teams' | 'leagues' | 'rules';
    };

type CacheInvalidationResult = {
  invalidatedKeys: string[];
};

export async function invalidateCache(
  targets: readonly CacheInvalidationTarget[],
): Promise<CacheInvalidationResult> {
  const cacheUri = `${import.meta.env.VITE_H23_API_SERVER}/api/cache/invalidate`;
  const response = await fetch(cacheUri, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ targets }),
  });

  if (!response.ok) {
    throw new Error(
      `Cache invalidation failed with ${response.status} ${response.statusText}`,
    );
  }

  return response.json() as Promise<CacheInvalidationResult>;
}
