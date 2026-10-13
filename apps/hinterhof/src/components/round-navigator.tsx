import type { Round } from '@haus23/tipprunde-model';
import { ChevronLeftIcon, ChevronRightIcon } from 'lucide-react';
import { cn } from '#/utils/cn';
import Button from './button';

// No chrome of its own: the surrounding layout decides about card, borders
// and placement. The navigator only takes the width it needs; the label has a
// fixed width so the arrows do not move when the round number grows.
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
      className={cn('flex w-fit items-center gap-x-3', className)}
    >
      <Button
        size="icon"
        aria-label="Vorherige Runde"
        disabled={!previous}
        onClick={() => previous && onValueChange(previous)}
      >
        <ChevronLeftIcon className="size-5" aria-hidden="true" />
      </Button>
      <p
        className="min-w-[14ch] text-center font-semibold tabular-nums"
        aria-live="polite"
      >
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
