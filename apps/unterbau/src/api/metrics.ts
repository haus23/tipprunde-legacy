import { DeviceMetricsReportSchema } from '@haus23/tipprunde-model';
import { Router } from 'express';
import * as v from 'valibot';
import {
  type DeviceVisitResult,
  recordDeviceVisit,
} from '#app/lib/device-metrics.ts';
import { isBot } from '#app/lib/util/is-bot.ts';

export const metricsRouter = Router();

// Only these sites may report devices. Browsers set the Origin header
// themselves, so a page elsewhere cannot pretend to be runde.tips.
const allowedOrigins = new Set([
  'https://runde.tips',
  'https://www.runde.tips',
  'https://main.tipprunde-www.pages.dev',
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
let reservedSlots = 0;

/**
 * A slot for one request that may add a device. It gets reserved on the
 * first check, so concurrent requests cannot all pass the limit, and later
 * checks of a retried Firestore transaction get the same answer.
 */
function newDeviceSlot() {
  let reserved: boolean | undefined;

  return {
    canAdd() {
      if (reserved === undefined) {
        const now = Date.now();
        newDevices = newDevices.filter((time) => now - time < newDeviceWindow);
        reserved = newDevices.length + reservedSlots < newDeviceLimit;
        if (reserved) reservedSlots++;
      }
      return reserved;
    },
    release(created: boolean) {
      if (!reserved) return;
      reservedSlots--;
      if (created) newDevices.push(Date.now());
    },
  };
}

/** Forgets the new devices counted so far, for tests. */
export function resetNewDeviceLimit() {
  newDevices = [];
  reservedSlots = 0;
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

  // Accepted, but not stored: bots are no devices of visitors
  if (isBot(report.output.environment.userAgent)) {
    res.status(204).end();
    return;
  }

  const slot = newDeviceSlot();
  let result: DeviceVisitResult | undefined;
  try {
    result = await recordDeviceVisit(report.output, origin, slot.canAdd);
  } finally {
    slot.release(result === 'created');
  }
  if (result === 'rejected') {
    res.status(429).json({ status: 429, error: 'Too Many Requests' });
    return;
  }

  res.status(204).end();
});
