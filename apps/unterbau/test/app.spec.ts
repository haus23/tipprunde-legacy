import request from 'supertest';
import { expect, it } from 'vitest';

import { app } from '#app/app.ts';

it('delivers the homepage succesfully', async () => {
  const response = await request(app).get('/');
  expect(response.status).toBe(200);
});

it('does not expose Express in the response headers', async () => {
  const response = await request(app).get('/');
  expect(response.headers).not.toHaveProperty('x-powered-by');
});

it('delivers the public OpenAPI document', async () => {
  const response = await request(app).get('/openapi.json');

  expect(response.status).toBe(200);
  expect(response.body.openapi).toBe('3.1.1');
  expect(Object.keys(response.body.paths)).toHaveLength(10);
  expect(response.body.paths).not.toHaveProperty('/api/cache/invalidate');
});

it('delivers the API documentation', async () => {
  const response = await request(app).get('/docs');

  expect(response.status).toBe(200);
  expect(response.type).toBe('text/html');
  expect(response.text).toContain('runde.tips API-Dokumentation');
  expect(response.text).toContain('/openapi.json');
});

it('returns a custom JSON response for unknown routes', async () => {
  const response = await request(app).get('/not-found');
  expect(response.status).toBe(404);
  expect(response.body).toEqual({
    status: 404,
    error: 'Not Found',
  });
});

it('does not expose error details in the response', async () => {
  const response = await request(app)
    .post('/api/cache/invalidate')
    .set('Content-Type', 'application/json')
    .send('{');
  expect(response.status).toBe(500);
  expect(response.body).toEqual({
    status: 500,
    error: 'Internal Server Error',
  });
});
