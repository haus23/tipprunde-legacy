import { Heading } from '@/components/ui/heading';
import { useChampionships } from '@/utils/state/championships';
import { useCurrentMatches } from '@/utils/state/current-championship/matches';

function CurrentMatchesRoute() {
  const { currentChampionship } = useChampionships();
  const { matches } = useCurrentMatches();

  return (
    <div>
      <header className="flex items-center justify-between">
        <Heading className="grow">{currentChampionship.name} - Spiele</Heading>
      </header>
      <p>Anzahl Spiele: {matches?.length}</p>
    </div>
  );
}

export { CurrentMatchesRoute as Component };
