import { expect, it, vi } from 'vitest';

import { createStorage } from 'unstorage';
import memoryDriver from 'unstorage/drivers/memory';
import { cachedFunction } from '#/lib/cached';

vi.mock('#/lib/storage.ts', () => ({
  storage: createStorage({ driver: memoryDriver() }),
}));

function resolver(arg: number) {
  return arg * 2;
}

it('creates a cached function, which calls the resolver only on the first call', async () => {
  const resolverFn = vi.fn(resolver);

  const doubleValue = cachedFunction(resolverFn, {
    name: 'test',
    getKey: () => 'doubleValue',
  });

  expect(resolverFn).not.toHaveBeenCalled();

  await doubleValue(20);

  expect(resolverFn).toHaveBeenCalledOnce();

  await doubleValue(20);

  expect(resolverFn).toHaveBeenCalledOnce();
});

it('recalls the resolver after cache is invalid', async () => {
  const resolverFn = vi.fn(resolver);
  const now = Date.now();

  const tripleValue = cachedFunction(resolverFn, {
    name: 'test',
    getKey: () => 'tripleValue',
    maxAge: 10,
  });

  await tripleValue(30);

  expect(resolverFn).toHaveBeenCalledOnce();

  vi.setSystemTime(now + 20 * 1000);
  await tripleValue(30);

  expect(resolverFn).toHaveBeenCalledTimes(2);
});
