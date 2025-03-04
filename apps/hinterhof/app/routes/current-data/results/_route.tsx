import { ResultSchema } from '@haus23/tipprunde-model';
import { valibotResolver } from '@hookform/resolvers/valibot';
import { useEffect, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import * as v from 'valibot';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem } from '@/components/ui/form';
import { Heading } from '@/components/ui/heading';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { updateMatchResult } from '@/lib/api/update-match-results';
import { useChampionship } from '@/utils/state/current-championship/championship';
import { useMatches } from '@/utils/state/current-championship/matches';
import { useRounds } from '@/utils/state/current-championship/rounds';
import { useTeams } from '@/utils/state/teams';
import { toast } from '@/utils/toast';

const formSchema = v.object({
  results: v.array(
    v.object({
      matchId: v.string(),
      result: ResultSchema,
    }),
  ),
});

function CurrentResultsRoute() {
  const { championship } = useChampionship();
  const { rounds } = useRounds();
  const { teams } = useTeams();
  const { matches } = useMatches();

  const [activeRoundId, setActiveRoundId] = useState(rounds.at(-1)?.id);
  useEffect(() => setActiveRoundId(rounds.at(-1)?.id), [rounds]);

  const activeMatches = useMemo(
    () => matches.filter((m) => m.roundId === activeRoundId),
    [activeRoundId, matches],
  );

  const form = useForm({
    resolver: valibotResolver(formSchema),
    defaultValues: {
      results: new Array(matches.length).fill({ matchId: '', result: '' }),
    },
  });

  useEffect(() => {
    form.reset({
      results: activeMatches.map((m) => ({ matchId: m.id, result: m.result })),
    });
  }, [activeMatches, form]);

  function saveResults(formData: v.InferOutput<typeof formSchema>) {
    if (form.formState.dirtyFields?.results) {
      const resultsToUpdate = form.formState.dirtyFields.results.reduce(
        (coll, _, ix) => {
          coll.push(formData.results[ix]);
          return coll;
        },
        [],
      );
      toast.promise(
        Promise.all(
          resultsToUpdate.map((r: any) =>
            updateMatchResult(r.matchId, r.result),
          ),
        ),
        {
          loading: 'Speichern und berechnen ...',
          success: 'Fertig. Alles aktualisiert.',
        },
      );
    }
  }

  return (
    <div>
      <header className="flex items-center justify-between">
        <Heading className="grow">{championship.name} - Ergebnisse</Heading>
      </header>
      <Card className="mt-4 overflow-clip">
        <Tabs value={activeRoundId} onValueChange={setActiveRoundId}>
          <TabsList className="flex w-full justify-start gap-x-4 rounded-none">
            <span className="pl-4 font-semibold">Runde</span>
            {rounds.map((r) => (
              <TabsTrigger key={r.id} value={r.id} className="px-4">
                {r.nr}
              </TabsTrigger>
            ))}
          </TabsList>
          {rounds.map((r) => (
            <TabsContent key={r.id} value={r.id}>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(saveResults)}>
                  <div className="sticky top-4 right-4 z-10 flex justify-end bg-background/50 p-2 ">
                    <Button variant="default" type="submit">
                      Speichern
                    </Button>
                  </div>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Nr</TableHead>
                        <TableHead>Spiel</TableHead>
                        <TableHead>Ergebnis</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {activeMatches.map((m, ix) => (
                        <TableRow key={m.id}>
                          <TableCell>{m.nr}</TableCell>
                          <TableCell>{`${teams.find((t) => t.id === m.hometeamId)?.name || '(Offen)'} - ${teams.find((t) => t.id === m.awayteamId)?.name || '(Offen)'}`}</TableCell>
                          <TableCell>
                            <FormField
                              control={form.control}
                              name={`results.${ix}.result`}
                              render={({ field }) => (
                                <FormItem>
                                  <FormControl>
                                    <Input
                                      className="w-16 text-center"
                                      {...field}
                                    />
                                  </FormControl>
                                </FormItem>
                              )}
                            />
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </form>
              </Form>
            </TabsContent>
          ))}
        </Tabs>
      </Card>
    </div>
  );
}

export { CurrentResultsRoute as Component };
