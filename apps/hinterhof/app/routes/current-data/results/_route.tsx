import { Heading } from '@/components/ui/heading';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useChampionship } from '@/utils/state/championships';
import { useRounds } from '@/utils/state/current-championship/rounds';

function CurrentResultsRoute() {
  const { championship } = useChampionship();
  const { rounds } = useRounds();

  return (
    <div>
      <header className="flex items-center justify-between">
        <Heading className="grow">{championship.name} - Ergebnisse</Heading>
      </header>
      <Tabs defaultValue={rounds?.at(-1)?.id}>
        <TabsList>
          {rounds?.map((r) => (
            <TabsTrigger key={r.id} value={r.id}>
              Runde {r.nr}
            </TabsTrigger>
          ))}
        </TabsList>
        {rounds?.map((r) => (
          <TabsContent key={r.id} value={r.id}>
            Spiele der Runde {r.nr}
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}

export { CurrentResultsRoute as Component };
