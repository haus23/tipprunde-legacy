import { type Match, MatchSchema, type Round } from '@haus23/tipprunde-model';
import { valibotResolver } from '@hookform/resolvers/valibot';
import {
  CheckIcon,
  ChevronsUpDown,
  ChevronsUpDownIcon,
  PenIcon,
} from 'lucide-react';
import { useEffect, useMemo, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import * as v from 'valibot';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Heading } from '@/components/ui/heading';
import { Input } from '@/components/ui/input';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { cn } from '@/utils/cn';
import { fullDateFormat } from '@/utils/misc';
import { useChampionship } from '@/utils/state/current-championship/championship';
import { useMatches } from '@/utils/state/current-championship/matches';
import { useRounds } from '@/utils/state/current-championship/rounds';
import { useLeagues } from '@/utils/state/leagues';
import { useTeams } from '@/utils/state/teams';

const createOrUpdateMatchSchema = v.partial(MatchSchema, ['id']);
type CreateOrUpdateMatch = v.InferInput<typeof createOrUpdateMatchSchema>;

function CurrentMatchesRoute() {
  const roundToCreateMatchForRef = useRef<Round | null>(null);
  const lastMatchRef = useRef<Match | null>(null);
  const [isFormCollapsed, setFormCollapsed] = useState(true);
  const [formMode, setFormMode] = useState<'create' | 'edit' | 'initial'>(
    'initial',
  );

  const form = useForm<CreateOrUpdateMatch>({
    resolver: valibotResolver(createOrUpdateMatchSchema),
    defaultValues: { date: '' },
  });

  const { championship } = useChampionship();
  const { rounds } = useRounds();
  const { matches, createMatch } = useMatches();
  const { teams } = useTeams();
  const { leagues } = useLeagues();

  useEffect(() => {
    const lastMatch = matches.at(-1);
    if (lastMatch) {
      lastMatchRef.current = lastMatch;
      form.reset({
        nr: lastMatch.nr + 1,
        roundId: lastMatch.roundId,
        date: lastMatch.date,
      });
    }
  }, [matches, form]);

  const [activeRoundId, setActiveRoundId] = useState(rounds.at(-1)?.id);
  useEffect(() => {
    const lastRound = rounds.at(-1);
    if (lastRound) {
      setActiveRoundId(lastRound.id);
      roundToCreateMatchForRef.current = lastRound;
      form.reset({
        roundId: lastRound.id,
        nr: (lastMatchRef.current?.nr || 0) + 1,
        date: lastMatchRef.current?.date || new Date().toDateString(),
      });
    }
  }, [rounds, form]);

  const activeMatches = useMemo(
    () => matches.filter((m) => m.roundId === activeRoundId),
    [activeRoundId, matches],
  );
  useEffect(() => {
    setFormCollapsed(formMode !== 'create' && activeMatches.length > 0);
  }, [activeMatches, formMode]);

  async function saveMatch(data: CreateOrUpdateMatch) {
    setFormMode('create');
    await createMatch(data);
  }

  const [isLeagueOpen, setLeagueOpen] = useState(false);
  const [isHometeamOpen, setHometeamOpen] = useState(false);
  const [isAwayteamOpen, setAwayteamOpen] = useState(false);

  return (
    <div>
      <header className="flex items-center justify-between">
        <Heading className="grow">{championship.name} - Spiele</Heading>
      </header>
      <Card className="mt-4">
        <Collapsible
          open={!isFormCollapsed}
          onOpenChange={(open) => setFormCollapsed(!open)}
        >
          <CollapsibleTrigger asChild>
            <Button
              variant="ghost"
              className="flex w-full items-center justify-between font-medium"
            >
              <span>
                {formMode === 'create' ? 'Neues Spiel' : 'Spiel ändern'}
              </span>
              <ChevronsUpDownIcon />
            </Button>
          </CollapsibleTrigger>
          <CardContent>
            <CollapsibleContent>
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(saveMatch)}
                  className="flex flex-col items-start gap-y-4 pt-2"
                >
                  <p className="text-sm">
                    Spiel Nr {(lastMatchRef.current?.nr || 0) + 1}
                  </p>
                  <div className="flex justify-between self-stretch">
                    <FormField
                      control={form.control}
                      name="date"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Wann?</FormLabel>
                          <FormControl>
                            <Input type="date" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="leagueId"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Wo?</FormLabel>
                          <Popover
                            open={isLeagueOpen}
                            onOpenChange={setLeagueOpen}
                          >
                            <PopoverTrigger asChild>
                              <FormControl>
                                <Button
                                  variant="outline"
                                  // biome-ignore lint/a11y/useSemanticElements: <explanation>
                                  role="combobox"
                                  className={cn(
                                    'w-[200px] justify-between',
                                    !field.value && 'text-muted-foreground',
                                  )}
                                >
                                  {field.value
                                    ? leagues.find((l) => l.id === field.value)
                                        ?.name
                                    : 'Liga wählen'}
                                  <ChevronsUpDown className="opacity-50" />
                                </Button>
                              </FormControl>
                            </PopoverTrigger>
                            <PopoverContent className="w-[200px] p-0">
                              <Command>
                                <CommandInput
                                  placeholder="Ligen durchsuchen..."
                                  className="h-9"
                                />
                                <CommandList>
                                  <CommandEmpty>Keine Liga passt.</CommandEmpty>
                                  <CommandGroup>
                                    {leagues.map((l) => (
                                      <CommandItem
                                        value={l.id + l.name + l.shortname}
                                        key={l.id}
                                        onSelect={() => {
                                          form.setValue('leagueId', l.id);
                                          setLeagueOpen(false);
                                        }}
                                      >
                                        {l.name}
                                        <CheckIcon
                                          className={cn(
                                            'ml-auto',
                                            l.id === field.value
                                              ? 'opacity-100'
                                              : 'opacity-0',
                                          )}
                                        />
                                      </CommandItem>
                                    ))}
                                  </CommandGroup>
                                </CommandList>
                              </Command>
                            </PopoverContent>
                          </Popover>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <FormField
                    control={form.control}
                    name="hometeamId"
                    render={({ field }) => (
                      <FormItem className="self-stretch">
                        <FormLabel>Wer?</FormLabel>
                        <Popover
                          open={isHometeamOpen}
                          onOpenChange={setHometeamOpen}
                        >
                          <PopoverTrigger asChild>
                            <FormControl>
                              <Button
                                variant="outline"
                                // biome-ignore lint/a11y/useSemanticElements: <explanation>
                                role="combobox"
                                className={cn(
                                  'w-full justify-between',
                                  !field.value && 'text-muted-foreground',
                                )}
                              >
                                {field.value
                                  ? teams.find((t) => t.id === field.value)
                                      ?.name
                                  : 'Team wählen'}
                                <ChevronsUpDown className="opacity-50" />
                              </Button>
                            </FormControl>
                          </PopoverTrigger>
                          <PopoverContent align="start" className="p-0">
                            <Command>
                              <CommandInput
                                placeholder="Teams durchsuchen..."
                                className="h-9"
                              />
                              <CommandList>
                                <CommandEmpty>Keine Team passt.</CommandEmpty>
                                <CommandGroup>
                                  {teams.map((t) => (
                                    <CommandItem
                                      value={t.id + t.name + t.shortname}
                                      key={t.id}
                                      onSelect={() => {
                                        form.setValue('hometeamId', t.id);
                                        setHometeamOpen(false);
                                      }}
                                    >
                                      {t.name}
                                      <CheckIcon
                                        className={cn(
                                          'ml-auto',
                                          t.id === field.value
                                            ? 'opacity-100'
                                            : 'opacity-0',
                                        )}
                                      />
                                    </CommandItem>
                                  ))}
                                </CommandGroup>
                              </CommandList>
                            </Command>
                          </PopoverContent>
                        </Popover>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="awayteamId"
                    render={({ field }) => (
                      <FormItem className="self-stretch">
                        <FormLabel>Gegen wen?</FormLabel>
                        <Popover
                          open={isAwayteamOpen}
                          onOpenChange={setAwayteamOpen}
                        >
                          <PopoverTrigger asChild>
                            <FormControl>
                              <Button
                                variant="outline"
                                // biome-ignore lint/a11y/useSemanticElements: <explanation>
                                role="combobox"
                                className={cn(
                                  'w-full justify-between',
                                  !field.value && 'text-muted-foreground',
                                )}
                              >
                                {field.value
                                  ? teams.find((t) => t.id === field.value)
                                      ?.name
                                  : 'Team wählen'}
                                <ChevronsUpDown className="opacity-50" />
                              </Button>
                            </FormControl>
                          </PopoverTrigger>
                          <PopoverContent align="start" className="p-0">
                            <Command>
                              <CommandInput
                                placeholder="Teams durchsuchen..."
                                className="h-9"
                              />
                              <CommandList>
                                <CommandEmpty>Keine Team passt.</CommandEmpty>
                                <CommandGroup>
                                  {teams.map((t) => (
                                    <CommandItem
                                      value={t.id + t.name + t.shortname}
                                      key={t.id}
                                      onSelect={() => {
                                        form.setValue('awayteamId', t.id);
                                        setAwayteamOpen(false);
                                      }}
                                    >
                                      {t.name}
                                      <CheckIcon
                                        className={cn(
                                          'ml-auto',
                                          t.id === field.value
                                            ? 'opacity-100'
                                            : 'opacity-0',
                                        )}
                                      />
                                    </CommandItem>
                                  ))}
                                </CommandGroup>
                              </CommandList>
                            </Command>
                          </PopoverContent>
                        </Popover>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button type="submit">Speichern</Button>
                </form>
              </Form>
            </CollapsibleContent>
          </CardContent>
        </Collapsible>
      </Card>

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
