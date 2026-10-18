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
  'https://main.tipprunde-www.pages.dev',
  'https://device-metrics.tipprunde-www.pages.dev',
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

it('does not store reports of bots', async () => {
  const response = await report().send({
    ...deviceReport,
    environment: {
      ...deviceReport.environment,
      userAgent:
        'Mozilla/5.0 (Linux; Android 6.0.1; Nexus 5X Build/MMB29P) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.8010.52 Mobile Safari/537.36 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)',
    },
  });

  expect(response.status).toBe(204);
  expect(recordDeviceVisit).not.toHaveBeenCalled();
});

it('caps the number of new devices per hour', async () => {
  recordDeviceVisit.mockImplementation(async (_report, _origin, canAdd) =>
    canAdd() ? 'created' : 'rejected',
  );

  for (let i = 0; i < 50; i++) {
    expect((await report().send(deviceReport)).status).toBe(204);
  }
  const response = await report().send(deviceReport);

  expect(response.status).toBe(429);
});

it('counts only stored new devices against the cap', async () => {
  // A retried transaction asks more than once, an update does not count
  recordDeviceVisit.mockImplementation(async (_report, _origin, canAdd) => {
    canAdd();
    canAdd();
    return 'updated';
  });
  for (let i = 0; i < 60; i++) {
    expect((await report().send(deviceReport)).status).toBe(204);
  }

  recordDeviceVisit.mockImplementation(async (_report, _origin, canAdd) =>
    canAdd() ? 'created' : 'rejected',
  );
  expect((await report().send(deviceReport)).status).toBe(204);
});

it('reserves slots for concurrent new devices', async () => {
  // All requests check the limit before any device is stored
  const stored: (() => void)[] = [];
  recordDeviceVisit.mockImplementation(async (_report, _origin, canAdd) =>
    canAdd()
      ? new Promise((resolve) => stored.push(() => resolve('created')))
      : 'rejected',
  );

  const responses = Array.from({ length: 60 }, () =>
    report()
      .send(deviceReport)
      .then((response) => response.status),
  );
  await vi.waitFor(() => expect(stored).toHaveLength(50));
  for (const store of stored) store();

  const statuses = await Promise.all(responses);
  expect(statuses.filter((status) => status === 204)).toHaveLength(50);
  expect(statuses.filter((status) => status === 429)).toHaveLength(10);
});

it('frees the slot when storing a new device fails', async () => {
  vi.spyOn(console, 'error').mockImplementation(() => {});
  recordDeviceVisit.mockImplementation(async (_report, _origin, canAdd) => {
    canAdd();
    throw new Error('Firestore unavailable');
  });
  for (let i = 0; i < 50; i++) {
    expect((await report().send(deviceReport)).status).toBe(500);
  }

  recordDeviceVisit.mockImplementation(async (_report, _origin, canAdd) =>
    canAdd() ? 'created' : 'rejected',
  );
  expect((await report().send(deviceReport)).status).toBe(204);
});
