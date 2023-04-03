export const cachedQuery = <T, K = void>(
  query: (arg: K) => T | Promise<T>,
  options: { name: string; getKey: (arg: K) => string }
) =>
  cachedFunction(query, {
    group: 'api',
    swr: false,
    maxAge: 0,
    name: options.name,
    getKey: options.getKey,
  });
