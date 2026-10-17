import * as v from 'valibot';

// Bounded primitives: the report comes from an unauthenticated client.
const Text = v.pipe(v.string(), v.maxLength(512));
const Keyword = v.pipe(v.string(), v.maxLength(64));
const Measure = v.pipe(v.number(), v.finite(), v.minValue(0), v.maxValue(1e5));

/** Matching value of a media feature, `null` if the browser knows none. */
const MediaValue = v.nullable(Keyword);

const BrandSchema = v.object({ brand: Keyword, version: Keyword });

/** Device characteristics a browser of runde.tips reports once per session. */
export const DeviceMetricsReportSchema = v.object({
  deviceId: v.pipe(v.string(), v.uuid()),
  appVersion: Keyword,
  path: Text,
  screen: v.object({
    width: Measure,
    height: Measure,
    availWidth: Measure,
    availHeight: Measure,
    colorDepth: Measure,
    orientation: v.nullable(Keyword),
  }),
  viewport: v.object({
    width: Measure,
    height: Measure,
    visualWidth: v.nullable(Measure),
    visualHeight: v.nullable(Measure),
    visualScale: v.nullable(Measure),
  }),
  devicePixelRatio: Measure,
  rootFontSize: Measure,
  input: v.object({
    maxTouchPoints: Measure,
    pointer: MediaValue,
    anyPointer: MediaValue,
    hover: MediaValue,
    anyHover: MediaValue,
  }),
  preferences: v.object({
    colorScheme: MediaValue,
    /** Color scheme picked in the app, `null` while it follows the system. */
    colorSchemeChoice: v.nullable(Keyword),
    reducedMotion: MediaValue,
    contrast: MediaValue,
    reducedTransparency: MediaValue,
    forcedColors: MediaValue,
    invertedColors: MediaValue,
    reducedData: MediaValue,
  }),
  display: v.object({
    colorGamut: MediaValue,
    dynamicRange: MediaValue,
    displayMode: MediaValue,
  }),
  environment: v.object({
    userAgent: Text,
    userAgentData: v.nullable(
      v.object({
        brands: v.pipe(v.array(BrandSchema), v.maxLength(16)),
        mobile: v.boolean(),
        platform: Keyword,
        platformVersion: v.nullable(Keyword),
        model: v.nullable(Keyword),
        architecture: v.nullable(Keyword),
      }),
    ),
    languages: v.pipe(v.array(Keyword), v.maxLength(16)),
    timeZone: Keyword,
    hardwareConcurrency: v.nullable(Measure),
    deviceMemory: v.nullable(Measure),
    connection: v.nullable(
      v.object({
        effectiveType: v.nullable(Keyword),
        saveData: v.nullable(v.boolean()),
        downlink: v.nullable(Measure),
        rtt: v.nullable(Measure),
      }),
    ),
  }),
});

export type DeviceMetricsReportInput = v.InferInput<
  typeof DeviceMetricsReportSchema
>;
export type DeviceMetricsReport = v.InferOutput<
  typeof DeviceMetricsReportSchema
>;

const { deviceId, ...reportEntries } = DeviceMetricsReportSchema.entries;

/**
 * Firestore document of a device: its latest report and visit history. The
 * timestamps are Firestore timestamps, converted to dates when read.
 */
export const DeviceMetricsSchema = v.object({
  id: deviceId,
  ...reportEntries,
  origin: v.string(),
  firstSeen: v.date(),
  lastSeen: v.date(),
  visits: v.pipe(v.number(), v.integer(), v.minValue(1)),
});

export type DeviceMetricsInput = v.InferInput<typeof DeviceMetricsSchema>;
export type DeviceMetrics = v.InferOutput<typeof DeviceMetricsSchema>;
