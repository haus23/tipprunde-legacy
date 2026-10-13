import type { Round } from '@haus23/tipprunde-model';
import { ChevronLeftIcon, ChevronRightIcon } from 'lucide-react';
import { cn } from '#/utils/cn';
import Button from './button';

// No chrome of its own: the surrounding layout decides about card, borders
// and width. The navigator spreads its controls over the available width.
type RoundNavigatorProps = {
  className?: string;
  onValueChange: (round: Round) => void;
  rounds: Round[];
  value?: Round;
};

export default function RoundNavigator({
  className,
  onValueChange,
  rounds,
  value,
}: RoundNavigatorProps) {
  const index = rounds.findIndex((round) => round.id === value?.id);
  const previous = index > 0 ? rounds[index - 1] : undefined;
  const next = index >= 0 ? rounds[index + 1] : undefined;

  return (
    <nav
      aria-label="Runden"
      className={cn('flex items-center justify-between gap-x-4', className)}
    >
      <Button
        size="icon"
        aria-label="Vorherige Runde"
        disabled={!previous}
        onClick={() => previous && onValueChange(previous)}
      >
        <ChevronLeftIcon className="size-5" aria-hidden="true" />
      </Button>
      <p className="font-semibold" aria-live="polite">
        Runde {value?.nr}
        <span className="font-normal text-muted-foreground">
          {' '}
          von {rounds.length}
        </span>
      </p>
      <Button
        size="icon"
        aria-label="Nächste Runde"
        disabled={!next}
        onClick={() => next && onValueChange(next)}
      >
        <ChevronRightIcon className="size-5" aria-hidden="true" />
      </Button>
    </nav>
  );
}
