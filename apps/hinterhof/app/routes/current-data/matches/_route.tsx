import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Heading } from '@/components/ui/heading';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { fullDateFormat } from '@/utils/misc';
import { useChampionship } from '@/utils/state/current-championship/championship';
import { useMatches } from '@/utils/state/current-championship/matches';
import { useRounds } from '@/utils/state/current-championship/rounds';
import { useLeagues } from '@/utils/state/leagues';
import { useTeams } from '@/utils/state/teams';
import { PenIcon } from 'lucide-react';
import { useMemo, useState } from 'react';

function CurrentMatchesRoute() {
  const { championship } = useChampionship();
  const { rounds } = useRounds();
  const { matches } = useMatches();
  const { teams } = useTeams();
  const { leagues } = useLeagues();

  const [activeRoundId, setActiveRoundId] = useState(rounds.at(-1)?.id);
  const activeMatches = useMemo(
    () => matches.filter((m) => m.roundId === activeRoundId),
    [activeRoundId, matches],
  );

  return (
    <div>
      <header className="flex items-center justify-between">
        <Heading className="grow">{championship.name} - Spiele</Heading>
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
            <TabsContent key={r.id} value={r.id} className="*:overflow-clip">
              {activeMatches.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Nr</TableHead>
                      <TableHead>Datum</TableHead>
                      <TableHead>Liga</TableHead>
                      <TableHead>Spiel</TableHead>
                      <TableHead className="sr-only">Bearbeiten</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {activeMatches.map((m, ix) => (
                      <TableRow key={m.id}>
                        <TableCell>{m.nr}</TableCell>
                        <TableCell>
                          {fullDateFormat.format(new Date(m.date))}
                        </TableCell>
                        <TableCell>
                          {leagues.find((l) => l.id === m.leagueId)?.name}
                        </TableCell>
                        <TableCell>{`${teams.find((t) => t.id === m.hometeamId)?.name || '(Offen)'} - ${teams.find((t) => t.id === m.awayteamId)?.name || '(Offen)'}`}</TableCell>
                        <TableCell>
                          <Button variant="outline">
                            <PenIcon />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <p className="pt-2 pb-4 text-center text-foreground/70">
                  Noch keine Spiele in dieser Runde.
                </p>
              )}
            </TabsContent>
          ))}
        </Tabs>
      </Card>
    </div>
  );
}

export { CurrentMatchesRoute as Component };
