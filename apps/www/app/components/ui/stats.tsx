import { cn } from '#/utils/cn';

// Row of key figures (label above value), e.g. rank and points of a player.

export type Stat = {
  label: string;
  value: React.ReactNode;
};

export function Stats({
  className,
  stats,
}: {
  className?: string;
  stats: Stat[];
}) {
  return (
    <dl
      className={cn(
        'grid auto-cols-fr grid-flow-col divide-x rounded-md border bg-background/70',
        className,
      )}
    >
      {stats.map((stat) => (
        <div key={stat.label} className="min-w-0 px-2 py-2 text-center">
          <dt className="font-medium text-muted-foreground text-xs uppercase">
            {stat.label}
          </dt>
          <dd className="mt-0.5 font-semibold text-accent-strong tabular-nums">
            {stat.value}
          </dd>
        </div>
      ))}
    </dl>
  );
}
