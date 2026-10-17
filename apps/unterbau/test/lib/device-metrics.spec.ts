import { beforeEach, expect, it, vi } from 'vitest';

const { documents, writes } = vi.hoisted(() => ({
  documents: new Map<string, Record<string, unknown>>(),
  writes: [] as { id: string; data: Record<string, unknown>; merge: boolean }[],
}));

// Minimal Firestore stand-in for the calls the device repository makes
vi.mock('#app/lib/firebase/index.ts', () => {
  return {
    db: {
      collection: () => ({
        doc: (id: string) => ({ id }),
      }),
      runTransaction: async (run: (transaction: unknown) => Promise<unknown>) =>
        run({
          get: async ({ id }: { id: string }) => ({
            exists: documents.has(id),
          }),
          set: (
            { id }: { id: string },
            data: Record<string, unknown>,
            options?: { merge: boolean },
          ) => writes.push({ id, data, merge: !!options?.merge }),
        }),
    },
  };
});

import { recordDeviceVisit } from '#app/lib/device-metrics.ts';
import { deviceReport } from '../fixtures/device-report.ts';

const { deviceId, ...report } = deviceReport;
const origin = 'https://www.runde.tips';

beforeEach(() => {
  documents.clear();
  writes.length = 0;
});

it('stores a new device with its first visit', async () => {
  const result = await recordDeviceVisit(deviceReport, origin, () => true);

  expect(result).toBe('created');
  expect(writes).toHaveLength(1);
  expect(writes[0]).toMatchObject({ id: deviceId, merge: false });
  expect(writes[0].data).toMatchObject({ ...report, origin });
  expect(writes[0].data).toHaveProperty('firstSeen');
  expect(writes[0].data).toHaveProperty('lastSeen');
  expect(writes[0].data).toHaveProperty('visits');
  expect(writes[0].data).not.toHaveProperty('deviceId');
});

it('does not store a new device beyond the limit', async () => {
  const result = await recordDeviceVisit(deviceReport, origin, () => false);

  expect(result).toBe('rejected');
  expect(writes).toHaveLength(0);
});

it('updates a known device without asking the limit', async () => {
  documents.set(deviceId, {});
  const allowNewDevice = vi.fn(() => false);

  const result = await recordDeviceVisit(deviceReport, origin, allowNewDevice);

  expect(result).toBe('updated');
  expect(allowNewDevice).not.toHaveBeenCalled();
  expect(writes[0]).toMatchObject({ id: deviceId, merge: true });
  expect(writes[0].data).not.toHaveProperty('firstSeen');
});
