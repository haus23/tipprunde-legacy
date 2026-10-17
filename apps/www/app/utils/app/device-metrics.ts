import {
  type DeviceMetricsReportInput,
  DeviceMetricsReportSchema,
} from '@haus23/tipprunde-model';
import * as v from 'valibot';

// Reports the characteristics of this device to the backend, once per
// session. Only part of the bundle when VITE_DEVICE_METRICS is 'on'
// (see entry.client.tsx).

const endpoint = `${import.meta.env.VITE_UNTERBAU_SERVER}/api/metrics/device`;
const deviceIdKey = 'deviceId';
const reportedKey = 'deviceReported';

// Browser features some engines do not know yet
type HighEntropyValues = {
  platformVersion?: string;
  model?: string;
  architecture?: string;
};
type UserAgentData = {
  brands: { brand: string; version: string }[];
  mobile: boolean;
  platform: string;
  getHighEntropyValues(hints: string[]): Promise<HighEntropyValues>;
};
type Connection = {
  effectiveType?: string;
  saveData?: boolean;
  downlink?: number;
  rtt?: number;
};
type ExtendedNavigator = Navigator & {
  userAgentData?: UserAgentData;
  deviceMemory?: number;
  connection?: Connection;
};

// Storage can be missing or throw, e.g. with blocked site data
function read(area: 'local' | 'session', key: string) {
  try {
    return (area === 'local' ? localStorage : sessionStorage).getItem(key);
  } catch {
    return null;
  }
}

function write(area: 'local' | 'session', key: string, value: string) {
  try {
    (area === 'local' ? localStorage : sessionStorage).setItem(key, value);
  } catch {}
}

// A device keeps its id as long as the browser keeps the local storage
function deviceId() {
  let id = read('local', deviceIdKey);
  if (!id) {
    id = crypto.randomUUID();
    write('local', deviceIdKey, id);
  }
  return id;
}

/** The first value of a media feature that matches, `null` if none does. */
function media(feature: string, values: string[]) {
  return (
    values.find((value) => matchMedia(`(${feature}: ${value})`).matches) ?? null
  );
}

async function userAgentData(data: UserAgentData | undefined) {
  if (!data) return null;
  const hints: HighEntropyValues = await data
    .getHighEntropyValues(['platformVersion', 'model', 'architecture'])
    .catch(() => ({}));
  return {
    brands: data.brands.map(({ brand, version }) => ({ brand, version })),
    mobile: data.mobile,
    platform: data.platform,
    platformVersion: hints.platformVersion ?? null,
    model: hints.model || null,
    architecture: hints.architecture || null,
  };
}

async function collect(): Promise<DeviceMetricsReportInput> {
  const nav = navigator as ExtendedNavigator;
  const { visualViewport: visual } = window;
  return {
    deviceId: deviceId(),
    appVersion: import.meta.env.VITE_APP_VERSION,
    path: location.pathname,
    screen: {
      width: screen.width,
      height: screen.height,
      availWidth: screen.availWidth,
      availHeight: screen.availHeight,
      colorDepth: screen.colorDepth,
      orientation: screen.orientation?.type ?? null,
    },
    viewport: {
      width: window.innerWidth,
      height: window.innerHeight,
      visualWidth: visual?.width ?? null,
      visualHeight: visual?.height ?? null,
      visualScale: visual?.scale ?? null,
    },
    devicePixelRatio: window.devicePixelRatio,
    rootFontSize: Number.parseFloat(
      getComputedStyle(document.documentElement).fontSize,
    ),
    input: {
      maxTouchPoints: nav.maxTouchPoints,
      pointer: media('pointer', ['coarse', 'fine', 'none']),
      anyPointer: media('any-pointer', ['coarse', 'fine', 'none']),
      hover: media('hover', ['hover', 'none']),
      anyHover: media('any-hover', ['hover', 'none']),
    },
    preferences: {
      colorScheme: media('prefers-color-scheme', ['dark', 'light']),
      colorSchemeChoice: read('local', 'colorScheme'),
      reducedMotion: media('prefers-reduced-motion', [
        'reduce',
        'no-preference',
      ]),
      contrast: media('prefers-contrast', [
        'more',
        'less',
        'custom',
        'no-preference',
      ]),
      reducedTransparency: media('prefers-reduced-transparency', [
        'reduce',
        'no-preference',
      ]),
      forcedColors: media('forced-colors', ['active', 'none']),
      invertedColors: media('inverted-colors', ['inverted', 'none']),
      reducedData: media('prefers-reduced-data', ['reduce', 'no-preference']),
    },
    display: {
      colorGamut: media('color-gamut', ['rec2020', 'p3', 'srgb']),
      dynamicRange: media('dynamic-range', ['high', 'standard']),
      displayMode: media('display-mode', [
        'fullscreen',
        'standalone',
        'minimal-ui',
        'browser',
      ]),
    },
    environment: {
      userAgent: nav.userAgent.slice(0, 512),
      userAgentData: await userAgentData(nav.userAgentData),
      languages: [...nav.languages].slice(0, 16),
      timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      hardwareConcurrency: nav.hardwareConcurrency ?? null,
      deviceMemory: nav.deviceMemory ?? null,
      connection: nav.connection
        ? {
            effectiveType: nav.connection.effectiveType ?? null,
            saveData: nav.connection.saveData ?? null,
            downlink: nav.connection.downlink ?? null,
            rtt: nav.connection.rtt ?? null,
          }
        : null,
    },
  };
}

async function report() {
  if (read('session', reportedKey)) return;

  const result = v.safeParse(DeviceMetricsReportSchema, await collect());
  if (!result.success) return;

  const response = await fetch(endpoint, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(result.output),
    keepalive: true,
  });
  if (response.ok) write('session', reportedKey, '1');
}

/** Sends the report when the browser is idle; failures stay silent. */
export function reportDevice() {
  const run = () => void report().catch(() => {});
  if ('requestIdleCallback' in window) requestIdleCallback(run);
  else setTimeout(run, 1000);
}
