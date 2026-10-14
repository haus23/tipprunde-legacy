import type { Championship } from '@haus23/tipprunde-model';
import { cn } from '#/utils/cn';

// Completed is the normal case for all but the newest championships, so only
// the open ones carry a marker: a filled dot while running, a hollow one
// before it is published.
export default function ChampionshipStatus({
  className,
  championship,
}: {
  className?: string;
  championship: Championship;
}) {
  if (championship.completed) return null;
  const label = championship.published ? 'läuft' : 'nicht veröffentlicht';
  return (
    <span
      title={label}
      className={cn(
        'inline-block size-2 shrink-0 rounded-full border border-current',
        championship.published && 'bg-current',
        className,
      )}
    >
      <span className="sr-only">{label}</span>
    </span>
  );
}
