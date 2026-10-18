import { RefreshCwIcon } from 'lucide-react';
import { Suspense, use, useMemo, useState, useTransition } from 'react';
import Button from '#/components/button';
import Select from '#/components/form/select';
import DataCard from '#/components/layout/data-card';
import LoadingIndicator from '#/components/loading-indicator';
import {
  ensureDeviceMetrics,
  reloadDeviceMetrics,
  useDeviceMetricsStore,
} from '#/state/device-metrics-store';
import { cn } from '#/utils/cn';
import {
  byNumber,
  byWidthBucket,
  type Device,
  type DistributionRow,
  distribution,
  filterDevices,
  mediaLabel,
  type OriginFilter,
  originOptions,
  type PeriodFilter,
  periodOptions,
  pixelRatio,
  platformLabel,
  portraitWidth,
  widthBucket,
  withUserAgent,
} from './device-stats';

const percent = new Intl.NumberFormat('de-DE', { style: 'percent' });
const dateTime = new Intl.DateTimeFormat('de-DE', {
  dateStyle: 'short',
  timeStyle: 'short',
});

type Section = {
  title: string;
  charts: {
    title: string;
    value: (device: Device) => string | null;
    compare?: (a: string, b: string) => number;
    /** Counts only these devices; the shares refer to them. */
    only?: (device: Device) => boolean;
  }[];
};

const sections: Section[] = [
  {
    title: 'Größen',
    charts: [
      {
        title: 'Handys: Breite im Hochformat',
        value: (d) => `${portraitWidth(d)} px`,
        compare: byNumber,
        only: (d) => portraitWidth(d) < 640,
      },
      {
        title: 'Fensterbreite',
        value: (d) => widthBucket(d.viewport.width),
        compare: byWidthBucket,
      },
      {
        title: 'Bildschirmbreite',
        value: (d) => widthBucket(d.screen.width),
        compare: byWidthBucket,
      },
      {
        title: 'Pixeldichte',
        value: (d) => pixelRatio(d.devicePixelRatio),
        compare: byNumber,
      },
      {
        title: 'Schriftgröße',
        value: (d) => `${d.rootFontSize} px`,
        compare: byNumber,
      },
      {
        title: 'Ausrichtung',
        value: (d) =>
          d.screen.orientation?.startsWith('portrait')
            ? 'Hochformat'
            : d.screen.orientation
              ? 'Querformat'
              : null,
      },
    ],
  },
  {
    title: 'Eingabe',
    charts: [
      {
        title: 'Touch',
        value: (d) => (d.input.maxTouchPoints > 0 ? 'Ja' : 'Nein'),
      },
      { title: 'Zeiger', value: (d) => mediaLabel(d.input.pointer) },
      { title: 'Hover', value: (d) => mediaLabel(d.input.hover) },
      {
        title: 'Weitere Zeiger',
        value: (d) => mediaLabel(d.input.anyPointer),
      },
    ],
  },
  {
    title: 'Einstellungen',
    charts: [
      {
        title: 'Farbschema des Systems',
        value: (d) => mediaLabel(d.preferences.colorScheme),
      },
      {
        title: 'Farbschema in der App',
        value: (d) =>
          d.preferences.colorSchemeChoice === null
            ? 'Wie das System'
            : mediaLabel(d.preferences.colorSchemeChoice),
      },
      {
        title: 'Bewegung',
        value: (d) => mediaLabel(d.preferences.reducedMotion),
      },
      { title: 'Kontrast', value: (d) => mediaLabel(d.preferences.contrast) },
      {
        title: 'Transparenz',
        value: (d) => mediaLabel(d.preferences.reducedTransparency),
      },
      {
        title: 'Erzwungene Farben',
        value: (d) => mediaLabel(d.preferences.forcedColors),
      },
      {
        title: 'Datensparmodus',
        value: (d) => mediaLabel(d.preferences.reducedData),
      },
    ],
  },
  {
    title: 'Anzeige',
    charts: [
      { title: 'Farbraum', value: (d) => mediaLabel(d.display.colorGamut) },
      {
        title: 'Dynamikumfang',
        value: (d) => mediaLabel(d.display.dynamicRange),
      },
      {
        title: 'Anzeigemodus',
        value: (d) => mediaLabel(d.display.displayMode),
      },
    ],
  },
  {
    title: 'System',
    charts: [
      { title: 'Gerätetyp', value: (d) => platformLabel(d.platform) },
      { title: 'Betriebssystem', value: (d) => d.os },
      { title: 'Browser', value: (d) => d.browser },
      {
        title: 'Prozessorkerne',
        value: (d) => d.environment.hardwareConcurrency?.toString() ?? null,
        compare: byNumber,
      },
    ],
  },
  {
    title: 'Umgebung',
    charts: [
      {
        title: 'Sprache',
        value: (d) => d.environment.languages[0] ?? null,
      },
      { title: 'Zeitzone', value: (d) => d.environment.timeZone },
      {
        title: 'Verbindung',
        value: (d) => d.environment.connection?.effectiveType ?? null,
      },
      { title: 'App-Version', value: (d) => d.appVersion },
    ],
  },
];

// One horizontal bar per value; the bar shows the share of all devices
function DistributionChart({
  rows,
  title,
  total,
}: {
  rows: DistributionRow[];
  title: string;
  total: number;
}) {
  return (
    <figure>
      <figcaption className="font-medium text-foreground text-sm">
        {title}
      </figcaption>
      {rows.length === 0 && (
        <p className="mt-2 text-muted-foreground text-sm">Keine Geräte</p>
      )}
      <ul className="mt-2 space-y-1.5">
        {rows.map((row) => (
          <li
            key={row.label}
            className="grid grid-cols-[minmax(0,9rem)_minmax(0,1fr)_4.5rem] items-center gap-x-3 text-sm"
          >
            <span className="truncate text-muted-foreground" title={row.label}>
              {row.label}
            </span>
            <span className="h-2" aria-hidden="true">
              <span
                className="block h-full min-w-0.5 rounded-r bg-primary"
                style={{ width: `${(row.count / total) * 100}%` }}
              />
            </span>
            <span className="text-right text-foreground tabular-nums">
              {row.count}
              <span className="ml-1.5 text-muted-foreground text-xs">
                {percent.format(row.count / total)}
              </span>
            </span>
          </li>
        ))}
      </ul>
    </figure>
  );
}

function KeyFigure({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-md border border-border bg-surface-subtle px-4 py-3">
      <dt className="text-muted-foreground text-sm">{label}</dt>
      <dd className="mt-1 font-semibold text-2xl text-foreground tabular-nums">
        {value}
      </dd>
    </div>
  );
}

function RecentDevices({ devices }: { devices: Device[] }) {
  const recent = [...devices]
    .sort((a, b) => b.lastSeen.getTime() - a.lastSeen.getTime())
    .slice(0, 50);

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-border">
        <caption className="sr-only">Zuletzt gesehene Geräte</caption>
        <thead className="bg-surface-subtle">
          <tr className="text-left font-semibold text-foreground text-sm">
            <th scope="col" className="py-3.5 pr-2 pl-4 sm:pl-6">
              Zuletzt
            </th>
            <th scope="col" className="px-2 py-3.5">
              Gerät
            </th>
            <th scope="col" className="hidden px-2 py-3.5 sm:table-cell">
              Fenster
            </th>
            <th scope="col" className="hidden px-2 py-3.5 md:table-cell">
              Bildschirm
            </th>
            <th scope="col" className="py-3.5 pr-4 pl-2 text-right sm:pr-6">
              Besuche
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-border bg-card text-muted-foreground text-sm">
          {recent.map((device) => (
            <tr key={device.id}>
              <td className="whitespace-nowrap py-3 pr-2 pl-4 tabular-nums sm:pl-6">
                {dateTime.format(device.lastSeen)}
              </td>
              <td className="px-2 py-3">
                {[platformLabel(device.platform), device.os, device.browser]
                  .filter(Boolean)
                  .join(' · ')}
              </td>
              <td className="hidden whitespace-nowrap px-2 py-3 tabular-nums sm:table-cell">
                {device.viewport.width} × {device.viewport.height}
              </td>
              <td className="hidden whitespace-nowrap px-2 py-3 tabular-nums md:table-cell">
                {device.screen.width} × {device.screen.height} @
                {pixelRatio(device.devicePixelRatio)}
              </td>
              <td className="py-3 pr-4 pl-2 text-right tabular-nums sm:pr-6">
                {device.visits}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function DevicesView() {
  const reports = useDeviceMetricsStore((state) => state.devices);
  const loadedAt = useDeviceMetricsStore((state) => state.loadedAt);
  const [origin, setOrigin] = useState<OriginFilter>('production');
  const [period, setPeriod] = useState<PeriodFilter>('30');
  const [reloading, startReload] = useTransition();

  const allDevices = useMemo(() => reports.map(withUserAgent), [reports]);
  const devices = filterDevices(allDevices, origin, period);
  const total = devices.length;
  const visits = devices.reduce((sum, device) => sum + device.visits, 0);
  const share = (match: (device: Device) => boolean) =>
    total ? percent.format(devices.filter(match).length / total) : '–';

  return (
    <DataCard
      title="Geräte"
      description={`Womit runde.tips besucht wird. Jedes Gerät zählt einmal, mit seinem letzten Bericht.${
        loadedAt ? ` Stand ${dateTime.format(loadedAt)}.` : ''
      }`}
      action={
        <Button
          className="max-sm:w-9 max-sm:px-0"
          disabled={reloading}
          onClick={() => startReload(() => reloadDeviceMetrics())}
        >
          <RefreshCwIcon
            className={cn(
              'size-4 sm:mr-1.5 sm:-ml-1',
              reloading && 'animate-spin motion-reduce:animate-none',
            )}
            aria-hidden="true"
          />
          <span className="max-sm:sr-only">Neu laden</span>
        </Button>
      }
      toolbar={
        <div className="grid max-w-md grid-cols-2 gap-3">
          <Select
            aria-label="Herkunft"
            options={originOptions}
            value={origin}
            onValueChange={setOrigin}
          />
          <Select
            aria-label="Zeitraum"
            options={periodOptions}
            value={period}
            onValueChange={setPeriod}
          />
        </div>
      }
    >
      {total === 0 ? (
        <p className="px-4 py-6 text-muted-foreground text-sm sm:px-6">
          Keine Geräte für diese Auswahl.
        </p>
      ) : (
        <>
          <div className="space-y-8 px-4 py-6 sm:px-6">
            <dl className="grid grid-cols-2 gap-3 lg:grid-cols-4">
              <KeyFigure label="Geräte" value={total.toString()} />
              <KeyFigure label="Besuche insgesamt" value={visits.toString()} />
              <KeyFigure
                label="Mit Touch"
                value={share((d) => d.input.maxTouchPoints > 0)}
              />
              <KeyFigure
                label="Fenster unter 640 px"
                value={share((d) => d.viewport.width < 640)}
              />
            </dl>
            {sections.map((section) => (
              <section key={section.title}>
                <h4 className="border-border border-b pb-2 font-semibold text-foreground">
                  {section.title}
                </h4>
                <div className="mt-4 grid gap-x-10 gap-y-6 lg:grid-cols-2">
                  {section.charts.map((chart) => {
                    const counted = chart.only
                      ? devices.filter(chart.only)
                      : devices;
                    return (
                      <DistributionChart
                        key={chart.title}
                        title={chart.title}
                        total={counted.length}
                        rows={distribution(counted, chart.value, chart.compare)}
                      />
                    );
                  })}
                </div>
              </section>
            ))}
          </div>
          <RecentDevices devices={devices} />
        </>
      )}
    </DataCard>
  );
}

// Waits for the reports once; reloads keep showing the current numbers
function DevicesLoader() {
  use(ensureDeviceMetrics());
  return <DevicesView />;
}

export default function DevicesPage() {
  return (
    <div className="mt-5">
      <Suspense fallback={<LoadingIndicator message="Lade Gerätedaten ..." />}>
        <DevicesLoader />
      </Suspense>
    </div>
  );
}
