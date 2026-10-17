import type { DeviceMetricsReport } from '@haus23/tipprunde-model';

export const deviceReport: DeviceMetricsReport = {
  deviceId: '3b241101-e2bb-4255-8caf-4136c566a962',
  appVersion: '1.1.0',
  path: '/em2024',
  screen: {
    width: 2560,
    height: 1440,
    availWidth: 2560,
    availHeight: 1415,
    colorDepth: 24,
    orientation: 'landscape-primary',
  },
  viewport: {
    width: 1280,
    height: 1200,
    visualWidth: 1280,
    visualHeight: 1200,
    visualScale: 1,
  },
  devicePixelRatio: 2,
  rootFontSize: 16,
  input: {
    maxTouchPoints: 0,
    pointer: 'fine',
    anyPointer: 'fine',
    hover: 'hover',
    anyHover: 'hover',
  },
  preferences: {
    colorScheme: 'light',
    colorSchemeChoice: 'dark',
    reducedMotion: 'reduce',
    contrast: 'no-preference',
    reducedTransparency: 'no-preference',
    forcedColors: 'none',
    invertedColors: null,
    reducedData: null,
  },
  display: {
    colorGamut: 'p3',
    dynamicRange: 'standard',
    displayMode: 'browser',
  },
  environment: {
    userAgent:
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36',
    userAgentData: {
      brands: [{ brand: 'Google Chrome', version: '140' }],
      mobile: false,
      platform: 'Windows',
      platformVersion: '19.0.0',
      model: null,
      architecture: 'x86',
    },
    languages: ['de-DE', 'de', 'en'],
    timeZone: 'Europe/Berlin',
    hardwareConcurrency: 16,
    deviceMemory: 8,
    connection: {
      effectiveType: '4g',
      saveData: false,
      downlink: 10,
      rtt: 50,
    },
  },
};
