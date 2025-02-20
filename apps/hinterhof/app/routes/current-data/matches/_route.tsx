import { Heading } from '@/components/ui/heading';
import { useChampionship } from '@/utils/state/current-championship/championship';
import { useMatches } from '@/utils/state/current-championship/matches';

function CurrentMatchesRoute() {
  const { championship } = useChampionship();
  const { matches } = useMatches();

  return (
    <div>
      <header className="flex items-center justify-between">
        <Heading className="grow">{championship.name} - Spiele</Heading>
      </header>
      <p>Anzahl Spiele: {matches.length}</p>
    </div>
  );
}

export { CurrentMatchesRoute as Component };
