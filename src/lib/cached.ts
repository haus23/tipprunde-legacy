import { env } from '#app/env.ts';
import { storage } from './storage.ts';

export type CacheOptions<FnArgsT extends unknown[]> = {
  name: string;
  getBase?: (...args: FnArgsT) => string;
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
  async function get(
    cacheKey: string,
    maxAge: number,
    resolver: () => T | Promise<T>,
  ) {
    const now = Date.now();

    let cacheEntry = await storage.getItem<CachedEntry<T>>(cacheKey);
    if (
      !cacheEntry ||
      (cacheEntry.expires !== -1 && now > cacheEntry.expires)
    ) {
      const data = await resolver();
      cacheEntry = {
        expires: maxAge === -1 ? maxAge : now + maxAge * 1000,
        value: data,
      };
      storage.setItem<CachedEntry<T>>(cacheKey, cacheEntry);
    }

    return cacheEntry;
  }

  return async (...args: FnArgsT) => {
    const base = options.getBase ? options.getBase(...args) : '';
    const key = getKey(...args);
    const cacheKey = [base, options.name, `${key}.json`]
      .filter(Boolean)
      .join(':');
    const maxAge = options.maxAge ?? (base === 'archive' ? -1 : env.MAX_AGE);
    const entry = await get(cacheKey, maxAge, () => fn(...args));
    const value = entry.value;
    return value;
  };
}
