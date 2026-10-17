import type { DeviceMetrics } from '@haus23/tipprunde-model';
import { create } from 'zustand';

import { getDeviceMetrics } from '#/firebase/device-metrics';
import { loadSource } from './load-source';

type DeviceMetricsState = {
  devices: DeviceMetrics[];
  loadedAt: Date | undefined;
};

export const useDeviceMetricsStore = create<DeviceMetricsState>(() => ({
  devices: [],
  loadedAt: undefined,
}));

// Loaded when the analytics page opens, not with the app: the reports are
// only needed there.
const deviceMetrics = loadSource(
  (_key: 'all') => getDeviceMetrics(),
  (devices) =>
    useDeviceMetricsStore.setState({ devices, loadedAt: new Date() }),
);

export const ensureDeviceMetrics = () => deviceMetrics.ensure('all');
export const reloadDeviceMetrics = () => deviceMetrics.reload('all');
