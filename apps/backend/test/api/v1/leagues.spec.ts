import request from 'supertest';
import { expect, it } from 'vitest';

import { app } from '#app/app.ts';

it('returns status code 200', async () => {
  const response = await request(app).get('/api/v1/leagues');
  expect(response.status).toBe(200);
});

it('returns json content', async () => {
  const response = await request(app).get('/api/v1/leagues');
  expect(response.headers).toHaveProperty(
    'content-type',
    'application/json; charset=utf-8',
  );
});

it('returns an array', async () => {
  const response = await request(app).get('/api/v1/leagues');
  expect(Array.isArray(response.body)).toBeTruthy();
});
