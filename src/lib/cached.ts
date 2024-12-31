import { env } from '#app/env.ts';
import { storage } from './storage.ts';

export type CacheOptions<FnArgsT extends unknown[]> = {
  name: string;
  getKey: (...args: FnArgsT) => string;
  maxAge?: number;
};

export type CachedEntry<T> = {
  expires: number;
  value: T;
};

export function cachedFunction<T, FnArgsT extends unknown[]>(
  fn: (...args: FnArgsT) => T | Promise<T>,
  { getKey, ...options }: CacheOptions<FnArgsT>,
) {
  const maxAge = options.maxAge ?? env.MAX_AGE;

  async function get(key: string, resolver: () => T | Promise<T>) {
    const cacheKey = `${options.name}:${key}.json`;
    const now = Date.now();

    let cacheEntry = await storage.getItem<CachedEntry<T>>(cacheKey);
    if (!cacheEntry || now > cacheEntry.expires) {
      const data = await resolver();
      cacheEntry = { expires: now + maxAge * 1000, value: data };
      storage.setItem<CachedEntry<T>>(cacheKey, cacheEntry);
    }

    return cacheEntry;
  }

  return async (...args: FnArgsT) => {
    const entry = await get(getKey(...args), () => fn(...args));
    const value = entry.value;
    return value;
  };
}
