import request from 'supertest';
import { expect, it } from 'vitest';

import { app } from '#/app.ts';

it('delivers the homepage succesfully', async () => {
  const response = await request(app).get('/');
  expect(response.status).toBe(200);
});
