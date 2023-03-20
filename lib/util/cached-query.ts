export const cachedQuery = <T>(
  query: (...args: unknown[]) => T | Promise<T>,
  options: { name: string; getKey: (...args: unknown[]) => string }
) =>
  cachedFunction(query, {
    group: 'api',
    swr: false,
    maxAge: 0,
    name: options.name,
    getKey: options.getKey,
  });
