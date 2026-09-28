import { auth } from 'lib';

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

export class CacheInvalidationError extends Error {
  override readonly name = 'CacheInvalidationError';
}

export async function invalidateCache(
  targets: readonly CacheInvalidationTarget[],
): Promise<CacheInvalidationResult> {
  const user = auth.currentUser;
  if (!user)
    throw new CacheInvalidationError(
      'Cache invalidation requires authentication',
    );

  const token = await user.getIdToken();
  const cacheUri = `${import.meta.env.VITE_H23_API_SERVER}/api/cache/invalidate`;
  const response = await fetch(cacheUri, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ targets }),
  });

  if (!response.ok) {
    throw new CacheInvalidationError(
      `Cache invalidation failed with ${response.status} ${response.statusText}`,
    );
  }

  return response.json() as Promise<CacheInvalidationResult>;
}
