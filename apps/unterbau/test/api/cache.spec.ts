import request from 'supertest';
import { beforeEach, expect, it, vi } from 'vitest';

vi.mock('#app/lib/storage.ts', async () => {
  const { createStorage } = await import('unstorage');
  const { default: memoryDriver } = await import('unstorage/drivers/memory');
  return { storage: createStorage({ driver: memoryDriver() }) };
});

import { app } from '#app/app.ts';
import { storage } from '#app/lib/storage.ts';

beforeEach(async () => {
  await storage.clear();
});

it('invalidates exact semantic cache targets', async () => {
  const keys = [
    'teams:list.json',
    'championships:em2024:matches.json',
    'championships:em2024:tips.json',
    'archive:championships:em2024:players.json',
    'championships:wm2022:matches.json',
  ];
  await Promise.all(keys.map((key) => storage.setItem(key, { value: key })));

  const response = await request(app)
    .post('/api/cache/invalidate')
    .send({
      targets: [
        { type: 'championship', id: 'em2024' },
        { type: 'collection', name: 'teams' },
      ],
    });

  expect(response.status).toBe(200);
  expect(response.body.invalidatedKeys).toHaveLength(4);
  expect(response.body.invalidatedKeys).toEqual(
    expect.arrayContaining(keys.slice(0, 4)),
  );
  expect(await storage.getKeys()).toEqual([
    'championships:wm2022:matches.json',
  ]);
});

it('invalidates the championship list independently', async () => {
  await storage.setItem('championships:list.json', { value: [] });
  await storage.setItem('championships:em2024:matches.json', { value: [] });

  const response = await request(app)
    .post('/api/cache/invalidate')
    .send({ targets: [{ type: 'championships' }] });

  expect(response.status).toBe(200);
  expect(response.body.invalidatedKeys).toEqual(['championships:list.json']);
  expect(await storage.getKeys()).toEqual([
    'championships:em2024:matches.json',
  ]);
});

it('rejects unknown invalidation targets', async () => {
  const response = await request(app)
    .post('/api/cache/invalidate')
    .send({ targets: [{ type: 'collection', name: 'unknown' }] });

  expect(response.status).toBe(400);
  expect(response.body).toEqual({
    status: 400,
    error: 'Invalid cache invalidation request',
  });
});
