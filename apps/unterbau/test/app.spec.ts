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

it('returns a custom JSON response for unknown routes', async () => {
  const response = await request(app).get('/not-found');
  expect(response.status).toBe(404);
  expect(response.body).toEqual({
    status: 404,
    error: 'Not Found',
  });
});

it('does not expose error details in the response', async () => {
  const response = await request(app).post('/api/cache').send({});
  expect(response.status).toBe(500);
  expect(response.body).toEqual({
    status: 500,
    error: 'Internal Server Error',
  });
});
