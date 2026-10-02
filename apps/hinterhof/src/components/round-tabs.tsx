import type { Round } from '@haus23/tipprunde-model';
import { cn } from 'cn';
import { focusRingInset } from '#/styles/focus';
import { CardHeader, CardTitle } from './card';

type RoundTabsProps = {
  onValueChange: (round: Round) => void;
  rounds: Round[];
  value?: string;
};

export default function RoundTabs({
  onValueChange,
  rounds,
  value,
}: RoundTabsProps) {
  return (
    <CardHeader className="flex flex-row items-center gap-x-4 overflow-hidden py-0 pr-0 sm:gap-x-8">
      <CardTitle className="shrink-0 text-base">Runde</CardTitle>
      <nav
        className="flex min-w-0 items-center gap-x-1 overflow-x-auto"
        aria-label="Runden"
      >
        {rounds.map((round) => {
          const selected = round.id === value;
          return (
            <button
              type="button"
              key={round.id}
              onClick={() => onValueChange(round)}
              aria-pressed={selected}
              className={cn(
                focusRingInset,
                selected
                  ? 'text-primary after:bg-primary'
                  : 'text-muted-foreground after:bg-transparent hover:text-foreground hover:after:bg-border',
                'relative my-1 whitespace-nowrap rounded-sm px-4 py-3 font-medium text-sm transition-colors after:absolute after:inset-x-0 after:-bottom-1 after:h-0.5 after:transition-colors motion-reduce:transition-none motion-reduce:after:transition-none md:px-6',
              )}
            >
              {round.nr}
            </button>
          );
        })}
      </nav>
    </CardHeader>
  );
}
