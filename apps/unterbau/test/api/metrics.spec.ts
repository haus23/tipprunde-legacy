import request from 'supertest';
import { beforeEach, expect, it, vi } from 'vitest';

const { recordDeviceVisit } = vi.hoisted(() => ({
  recordDeviceVisit: vi.fn(),
}));

vi.mock('#app/lib/device-metrics.ts', () => ({ recordDeviceVisit }));

import { resetNewDeviceLimit } from '#app/api/metrics.ts';
import { app } from '#app/app.ts';
import { deviceReport } from '../fixtures/device-report.ts';

beforeEach(() => {
  vi.clearAllMocks();
  resetNewDeviceLimit();
  recordDeviceVisit.mockResolvedValue('updated');
});

const report = (origin = 'https://www.runde.tips') =>
  request(app).post('/api/metrics/device').set('Origin', origin);

it.each([
  'https://runde.tips',
  'https://www.runde.tips',
  'https://main.tipprunde-www.pages.dev',
  'https://device-metrics.tipprunde-www.pages.dev',
  'http://localhost:5173',
])('records a device report from %s', async (origin) => {
  const response = await report(origin).send(deviceReport);

  expect(response.status).toBe(204);
  expect(recordDeviceVisit).toHaveBeenCalledWith(
    deviceReport,
    origin,
    expect.any(Function),
  );
});

it.each([
  'https://evil.example',
  'https://other.tipprunde-www.pages.dev',
  'https://www.runde.tips.evil.example',
  'http://localhost.evil.example',
])('rejects a device report from %s', async (origin) => {
  const response = await report(origin).send(deviceReport);

  expect(response.status).toBe(403);
  expect(recordDeviceVisit).not.toHaveBeenCalled();
});

it('rejects a device report without origin', async () => {
  const response = await request(app)
    .post('/api/metrics/device')
    .send(deviceReport);

  expect(response.status).toBe(403);
  expect(recordDeviceVisit).not.toHaveBeenCalled();
});

it('rejects an invalid device report', async () => {
  const response = await report().send({ ...deviceReport, deviceId: 'x' });

  expect(response.status).toBe(400);
  expect(response.body).toEqual({
    status: 400,
    error: 'Invalid device report',
  });
  expect(recordDeviceVisit).not.toHaveBeenCalled();
});

it('caps the number of new devices per hour', async () => {
  recordDeviceVisit.mockImplementation(async (_report, _origin, allow) =>
    allow() ? 'created' : 'rejected',
  );

  for (let i = 0; i < 50; i++) {
    expect((await report().send(deviceReport)).status).toBe(204);
  }
  const response = await report().send(deviceReport);

  expect(response.status).toBe(429);
});
