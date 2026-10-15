import { cn } from '#/utils/cn';

// Row of key figures (label above value), e.g. rank and points of a player.
// On phones a 2×2 grid, so each value gets half the width.

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
        'grid grid-cols-2 rounded-md border bg-background/70 sm:auto-cols-fr sm:grid-flow-col sm:grid-cols-none',
        className,
      )}
    >
      {stats.map((stat) => (
        <div
          key={stat.label}
          className="min-w-0 nth-[n+3]:border-t px-2 py-2 text-center even:border-l sm:nth-[n+3]:border-t-0 sm:not-first:border-l"
        >
          <dt className="font-medium text-muted-foreground text-xs uppercase">
            {stat.label}
          </dt>
          <dd className="wrap-break-word mt-0.5 font-semibold text-accent-strong tabular-nums">
            {stat.value}
          </dd>
        </div>
      ))}
    </dl>
  );
}
