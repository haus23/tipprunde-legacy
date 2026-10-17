import { DeviceMetricsReportSchema } from '@haus23/tipprunde-model';
import { Router } from 'express';
import * as v from 'valibot';
import { recordDeviceVisit } from '#app/lib/device-metrics.ts';

export const metricsRouter = Router();

// Only these sites may report devices. Browsers set the Origin header
// themselves, so a page elsewhere cannot pretend to be runde.tips.
const allowedOrigins = new Set([
  'https://runde.tips',
  'https://www.runde.tips',
  'https://main.tipprunde-www.pages.dev',
  'https://device-metrics.tipprunde-www.pages.dev',
]);
const localhost = /^http:\/\/localhost(:\d+)?$/;

function isAllowedOrigin(origin: string | undefined): origin is string {
  return !!origin && (allowedOrigins.has(origin) || localhost.test(origin));
}

// The report endpoint is public. Updates only touch the document of a known
// device, but every new device adds one, so their number is capped.
const newDeviceLimit = 50;
const newDeviceWindow = 60 * 60 * 1000;
let newDevices: number[] = [];

// Only checks the limit: Firestore may run a transaction more than once, so
// a new device is counted after it got stored.
function hasRoomForNewDevice() {
  const now = Date.now();
  newDevices = newDevices.filter((time) => now - time < newDeviceWindow);
  return newDevices.length < newDeviceLimit;
}

/** Forgets the new devices counted so far, for tests. */
export function resetNewDeviceLimit() {
  newDevices = [];
}

metricsRouter.post('/device', async (req, res) => {
  const origin = req.get('origin');
  if (!isAllowedOrigin(origin)) {
    res.status(403).json({ status: 403, error: 'Forbidden' });
    return;
  }

  const report = v.safeParse(DeviceMetricsReportSchema, req.body);
  if (!report.success) {
    res.status(400).json({ status: 400, error: 'Invalid device report' });
    return;
  }

  const result = await recordDeviceVisit(
    report.output,
    origin,
    hasRoomForNewDevice,
  );
  if (result === 'created') newDevices.push(Date.now());
  if (result === 'rejected') {
    res.status(429).json({ status: 429, error: 'Too Many Requests' });
    return;
  }

  res.status(204).end();
});
