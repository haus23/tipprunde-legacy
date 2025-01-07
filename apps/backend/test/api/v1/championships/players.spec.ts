import request from 'supertest';
import { expect, it } from 'vitest';

import { app } from '#app/app.ts';

it('returns status code 200', async () => {
  const response = await request(app).get(
    '/api/v1/championships/hr2425/players',
  );
  expect(response.status).toBe(200);
});

it('returns json content', async () => {
  const response = await request(app).get(
    '/api/v1/championships/hr2425/players',
  );
  expect(response.headers).toHaveProperty(
    'content-type',
    'application/json; charset=utf-8',
  );
});

it('returns an array', async () => {
  const response = await request(app).get(
    '/api/v1/championships/hr2425/players',
  );
  expect(Array.isArray(response.body)).toBeTruthy();
});

it('returns status 406 for an invalid championship', async () => {
  const response = await request(app).get(
    '/api/v1/championships/abcdef/players',
  );
  expect(response.statusCode).toBe(406);
});

it('returns status 404 for an unknown championship', async () => {
  const response = await request(app).get(
    '/api/v1/championships/hr0102/players',
  );
  expect(response.statusCode).toBe(404);
});
