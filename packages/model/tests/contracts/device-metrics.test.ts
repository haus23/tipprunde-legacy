import * as v from 'valibot';
import { expect, it } from 'vitest';

import {
  type DeviceMetricsReportInput,
  DeviceMetricsReportSchema,
  DeviceMetricsSchema,
} from '../../src/contracts/api/device-metrics';

const report: DeviceMetricsReportInput = {
  deviceId: '3b241101-e2bb-4255-8caf-4136c566a962',
  appVersion: '1.1.0',
  path: '/em2024',
  screen: {
    width: 390,
    height: 844,
    availWidth: 390,
    availHeight: 844,
    colorDepth: 24,
    orientation: 'portrait-primary',
  },
  viewport: {
    width: 390,
    height: 664,
    visualWidth: 390,
    visualHeight: 664,
    visualScale: 1,
  },
  devicePixelRatio: 3,
  rootFontSize: 16,
  input: {
    maxTouchPoints: 5,
    pointer: 'coarse',
    anyPointer: 'coarse',
    hover: 'none',
    anyHover: 'none',
  },
  preferences: {
    colorScheme: 'dark',
    colorSchemeChoice: null,
    reducedMotion: 'no-preference',
    contrast: 'no-preference',
    reducedTransparency: null,
    forcedColors: 'none',
    invertedColors: 'none',
    reducedData: null,
  },
  display: {
    colorGamut: 'p3',
    dynamicRange: 'high',
    displayMode: 'browser',
  },
  environment: {
    userAgent:
      'Mozilla/5.0 (iPhone; CPU iPhone OS 18_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.0 Mobile/15E148 Safari/604.1',
    userAgentData: null,
    languages: ['de-DE', 'de'],
    timeZone: 'Europe/Berlin',
    hardwareConcurrency: 6,
    deviceMemory: null,
    connection: null,
  },
};

it('validates a complete device report', () => {
  expect(v.parse(DeviceMetricsReportSchema, report)).toEqual(report);
});

it('drops unknown report properties', () => {
  const output = v.parse(DeviceMetricsReportSchema, { ...report, extra: 1 });
  expect(output).not.toHaveProperty('extra');
});

it('requires a UUID as device id', () => {
  const result = v.safeParse(DeviceMetricsReportSchema, {
    ...report,
    deviceId: '../players',
  });
  expect(result.success).toBe(false);
});

it('rejects oversized values', () => {
  const result = v.safeParse(DeviceMetricsReportSchema, {
    ...report,
    environment: { ...report.environment, userAgent: 'x'.repeat(513) },
  });
  expect(result.success).toBe(false);
});

it('validates a stored device record', () => {
  const { deviceId, ...entries } = report;
  const record = {
    id: deviceId,
    ...entries,
    origin: 'https://www.runde.tips',
    firstSeen: new Date('2026-10-18T10:15:30.123Z'),
    lastSeen: new Date('2026-10-18T12:00:00.000Z'),
    visits: 3,
  };

  expect(v.parse(DeviceMetricsSchema, record)).toEqual(record);
});
