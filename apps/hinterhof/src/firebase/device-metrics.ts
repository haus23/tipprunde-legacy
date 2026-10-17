import {
  type DeviceMetrics,
  DeviceMetricsSchema,
} from '@haus23/tipprunde-model';
import { collection, getDocs, type Timestamp } from 'firebase/firestore/lite';
import * as v from 'valibot';

import { db } from './db';

/**
 * Reads the device reports the backend stores. Firestore timestamps become
 * dates; documents that do not fit the schema are skipped.
 */
export async function getDeviceMetrics(): Promise<DeviceMetrics[]> {
  const snapshot = await getDocs(collection(db, 'device-metrics'));
  return snapshot.docs.flatMap((document) => {
    const { firstSeen, lastSeen, ...data } = document.data();
    const result = v.safeParse(DeviceMetricsSchema, {
      id: document.id,
      ...data,
      firstSeen: (firstSeen as Timestamp | undefined)?.toDate(),
      lastSeen: (lastSeen as Timestamp | undefined)?.toDate(),
    });
    if (!result.success) {
      console.warn(`Invalid device report "${document.ref.path}"`);
      return [];
    }
    return [result.output];
  });
}
