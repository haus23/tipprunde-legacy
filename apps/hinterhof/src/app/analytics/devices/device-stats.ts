import type { DeviceMetrics } from '@haus23/tipprunde-model';
import Bowser from 'bowser';

// Aggregation of the device reports into distributions for the analytics
// page. Each device counts once, with its latest report.

export type Device = DeviceMetrics & {
  browser: string | null;
  os: string | null;
  platform: string | null;
};

/** Browser, OS and device type, derived from user agent and client hints. */
export function withUserAgent(device: DeviceMetrics): Device {
  const hints = device.environment.userAgentData;
  const { browser, os, platform } = Bowser.parse(
    device.environment.userAgent,
    hints
      ? {
          brands: hints.brands,
          mobile: hints.mobile,
          platform: hints.platform,
          platformVersion: hints.platformVersion ?? undefined,
          model: hints.model ?? undefined,
          architecture: hints.architecture ?? undefined,
        }
      : undefined,
  );
  return {
    ...device,
    browser: browser.name ?? null,
    os: os.name ?? null,
    platform: platform.type ?? null,
  };
}

// Filters

export const originOptions = [
  { id: 'production', name: 'Produktion' },
  { id: 'local', name: 'Lokal' },
  { id: 'all', name: 'Alle Herkünfte' },
] as const;
export type OriginFilter = (typeof originOptions)[number]['id'];

const productionOrigins = new Set([
  'https://runde.tips',
  'https://www.runde.tips',
  'https://main.tipprunde-www.pages.dev',
]);

// Former preview origins only show up under all origins
function originGroup(origin: string): OriginFilter | 'other' {
  if (productionOrigins.has(origin)) return 'production';
  if (origin.startsWith('http://localhost')) return 'local';
  return 'other';
}

export const periodOptions = [
  { id: '7', name: 'Letzte 7 Tage' },
  { id: '30', name: 'Letzte 30 Tage' },
  { id: '90', name: 'Letzte 90 Tage' },
  { id: 'all', name: 'Gesamter Zeitraum' },
] as const;
export type PeriodFilter = (typeof periodOptions)[number]['id'];

/** Devices of the chosen origin, seen within the chosen period. */
export function filterDevices(
  devices: Device[],
  origin: OriginFilter,
  period: PeriodFilter,
  now = Date.now(),
) {
  const since = period === 'all' ? 0 : now - Number(period) * 86_400_000;
  return devices.filter(
    (device) =>
      (origin === 'all' || originGroup(device.origin) === origin) &&
      device.lastSeen.getTime() >= since,
  );
}

// Distributions

export type DistributionRow = { label: string; count: number };

const unknown = 'Unbekannt';

/**
 * Counts the devices per value. The rows go by count, or by `compare` for
 * values with a natural order; unknown values come last.
 */
export function distribution(
  devices: Device[],
  value: (device: Device) => string | null,
  compare?: (a: string, b: string) => number,
): DistributionRow[] {
  const counts = new Map<string, number>();
  for (const device of devices) {
    const label = value(device) ?? unknown;
    counts.set(label, (counts.get(label) ?? 0) + 1);
  }

  return [...counts]
    .map(([label, count]) => ({ label, count }))
    .sort((a, b) => {
      if (a.label === unknown) return 1;
      if (b.label === unknown) return -1;
      return compare ? compare(a.label, b.label) : b.count - a.count;
    });
}

/** Compares labels that start with a number, like "2x" or "16 px". */
export const byNumber = (a: string, b: string) =>
  Number.parseFloat(a) - Number.parseFloat(b);

/**
 * Widths grouped by the Tailwind breakpoints the www app is built with.
 * Below sm the steps follow common phone widths: 320, 360, 375, 390/393.
 */
export const widthBuckets = [
  '< 360 px',
  '360–374 px',
  '375–389 px',
  '390–411 px',
  '412–639 px',
  '640–767 px (sm)',
  '768–1023 px (md)',
  '1024–1279 px (lg)',
  '1280–1535 px (xl)',
  '≥ 1536 px (2xl)',
] as const;

export const byWidthBucket = (a: string, b: string) =>
  widthBuckets.indexOf(a as WidthBucket) -
  widthBuckets.indexOf(b as WidthBucket);

type WidthBucket = (typeof widthBuckets)[number];

export function widthBucket(width: number): WidthBucket {
  const limits = [360, 375, 390, 412, 640, 768, 1024, 1280, 1536];
  const index = limits.findIndex((limit) => width < limit);
  return widthBuckets[index === -1 ? limits.length : index];
}

/** CSS width of the device held upright, independent of its orientation. */
export function portraitWidth(device: Device) {
  return Math.min(device.screen.width, device.screen.height);
}

export function pixelRatio(ratio: number) {
  return `${Math.round(ratio * 100) / 100}x`;
}

// German labels of the media feature values
const mediaLabels: Record<string, string> = {
  active: 'Aktiv',
  browser: 'Browser',
  coarse: 'Grob (Finger)',
  custom: 'Eigene',
  dark: 'Dunkel',
  fine: 'Fein (Maus, Stift)',
  fullscreen: 'Vollbild',
  high: 'Hoch (HDR)',
  hover: 'Ja',
  inverted: 'Invertiert',
  less: 'Weniger',
  light: 'Hell',
  'minimal-ui': 'Minimal-UI',
  more: 'Mehr',
  'no-preference': 'Keine Vorgabe',
  none: 'Keine',
  p3: 'Display P3',
  rec2020: 'Rec. 2020',
  reduce: 'Reduziert',
  srgb: 'sRGB',
  standalone: 'Installiert (PWA)',
  standard: 'Standard',
};

export function mediaLabel(value: string | null) {
  return value === null ? null : (mediaLabels[value] ?? value);
}

const platformLabels: Record<string, string> = {
  desktop: 'Desktop',
  mobile: 'Smartphone',
  tablet: 'Tablet',
  tv: 'TV',
  bot: 'Bot',
};

export function platformLabel(platform: string | null) {
  return platform === null ? null : (platformLabels[platform] ?? platform);
}
