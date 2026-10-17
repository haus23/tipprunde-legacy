import type { DeviceMetricsReport } from '@haus23/tipprunde-model';
import { FieldValue } from 'firebase-admin/firestore';

import { db } from './firebase/index.ts';

const collection = () => db.collection('device-metrics');

export type DeviceVisitResult = 'created' | 'updated' | 'rejected';

/**
 * Stores the latest report of a device and counts the visit. A device seen
 * for the first time is only stored when `canAddDevice` agrees.
 */
export async function recordDeviceVisit(
  { deviceId, ...report }: DeviceMetricsReport,
  origin: string,
  canAddDevice: () => boolean,
): Promise<DeviceVisitResult> {
  const ref = collection().doc(deviceId);

  return db.runTransaction(async (transaction) => {
    const snapshot = await transaction.get(ref);
    const visit = {
      ...report,
      origin,
      lastSeen: FieldValue.serverTimestamp(),
      visits: FieldValue.increment(1),
    };

    if (snapshot.exists) {
      transaction.set(ref, visit, { merge: true });
      return 'updated';
    }
    if (!canAddDevice()) return 'rejected';

    transaction.set(ref, {
      ...visit,
      firstSeen: FieldValue.serverTimestamp(),
    });
    return 'created';
  });
}
