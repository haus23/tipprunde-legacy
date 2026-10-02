import type { League, Match, Team } from '@haus23/tipprunde-model';
import { cn } from 'cn';
import { ChevronDownIcon, PencilIcon } from 'lucide-react';
import { useMemo, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import Button from '#/components/button';
import { Card, CardContent, CardFooter } from '#/components/card';
import ComboboxField from '#/components/form/combobox-field';
import DateField from '#/components/form/date-field';
import RoundTabs from '#/components/round-tabs';
import { useCurrentChampionship } from '#/hooks/current-data/use-current-championship';
import { useMatches } from '#/hooks/current-data/use-matches';
import { useRounds } from '#/hooks/current-data/use-rounds';
import { useLeagues } from '#/hooks/master-data/use-leagues';
import { useTeams } from '#/hooks/master-data/use-teams';
import { focusRing } from '#/styles/focus';
import { formatDate } from '#/utils/format-date';
import { invalidateCache } from '#/utils/invalidate-cache';
import { notify } from '#/utils/notify';

type MatchFormData = Omit<Match, 'id' | 'roundId' | 'result' | 'points'> & {
  id?: string;
};

export default function MatchesView() {
  const { leagues } = useLeagues();
  const { teams } = useTeams();
  const { rounds } = useRounds();
  const { matches, createMatch, updateMatch } = useMatches();
  const { currentChampionship } = useCurrentChampionship();

  const leaguesHash = useMemo(
    () =>
      leagues.reduce(
        (hash, league) => {
          hash[league.id] = league;
          return hash;
        },
        {} as Record<string, League>,
      ),
    [leagues],
  );

  const teamsHash = useMemo(
    () =>
      teams.reduce(
        (hash, team) => {
          hash[team.id] = team;
          return hash;
        },
        {} as Record<string, Team>,
      ),
    [teams],
  );

  const [currentRound, setCurrentRound] = useState(rounds[rounds.length - 1]);

  const [isFormOpen, setFormOpen] = useState(matches.length === 0);
  const [editMode, setEditMode] = useState(false);

  let nr = (matches.at(-1)?.nr || 0) + 1;
  const date = matches.reduce(
    (lastDate, match) => (match.date > lastDate ? match.date : lastDate),
    '',
  );

  const initialFormValues: Partial<MatchFormData> = {
    nr,
    date,
    leagueId: '',
    hometeamId: '',
    awayteamId: '',
  };

  const { control, handleSubmit, register, reset, setFocus } =
    useForm<MatchFormData>({ defaultValues: initialFormValues });

  async function saveMatch(matchData: MatchFormData) {
    if (!currentChampionship) return;

    if (matchData.id) {
      const match = matches.find(({ id }) => id === matchData.id);
      if (!match) throw new Error(`Match ${matchData.id} not found`);

      await notify(
        updateMatch({ ...match, ...matchData, id: matchData.id }).then(() =>
          invalidateCache([
            { type: 'championship', id: currentChampionship.id },
          ]),
        ),
        `Spiel ${matchData.nr} geändert.`,
      );
      endEdit();
    } else {
      const match: Omit<Match, 'id'> = {
        nr: matchData.nr,
        date: matchData.date,
        leagueId: matchData.leagueId,
        hometeamId: matchData.hometeamId,
        awayteamId: matchData.awayteamId,
        roundId: currentRound.id,
        result: '',
      };
      await notify(
        createMatch(match).then(() =>
          invalidateCache([
            { type: 'championship', id: currentChampionship.id },
          ]),
        ),
        `Spiel ${match.nr} hinzugefügt.`,
      );
      reset({ ...initialFormValues, date: match.date, nr: ++nr });
      setFocus('date', { shouldSelect: true });
    }
  }

  const topRef = useRef<HTMLDivElement>(null);

  function beginEdit(match: Match) {
    reset(match.date ? match : { ...match, date });
    setEditMode(true);
    setFormOpen(true);
    topRef.current?.scrollIntoView();
  }

  function endEdit() {
    reset(initialFormValues);
    setEditMode(false);
    setFormOpen(false);
  }

  return (
    <div ref={topRef} className="mt-5 space-y-8">
      <Card>
        <RoundTabs
          rounds={rounds}
          value={currentRound?.id}
          onValueChange={setCurrentRound}
        />
        <button
          type="button"
          onClick={() => setFormOpen(!isFormOpen)}
          className={cn(
            focusRing,
            'm-2 flex w-[calc(100%-1rem)] items-center justify-between rounded-md px-2 py-1 font-semibold transition-colors hover:bg-accent motion-reduce:transition-none sm:px-4',
          )}
          aria-expanded={isFormOpen}
          aria-controls="match-form"
        >
          <span>{editMode ? 'Spiel bearbeiten' : 'Neues Spiel'}</span>
          <ChevronDownIcon
            className={cn(
              'h-5 w-5 transition-transform motion-reduce:transition-none',
              isFormOpen && 'rotate-180',
            )}
            aria-hidden="true"
          />
        </button>
        {isFormOpen && (
          <form id="match-form" noValidate onSubmit={handleSubmit(saveMatch)}>
            <CardContent className="space-y-4 border-border border-t">
              <div className="flex items-center">
                <span className="font-semibold text-sm">Nummer</span>
                <input
                  disabled
                  className="w-8 rounded-sm border-transparent bg-transparent p-1 text-center font-semibold text-sm"
                  {...register('nr')}
                />
              </div>
              <div className="flex flex-col gap-y-4 sm:flex-row sm:justify-between">
                <DateField label="Wann?" control={control} name="date" />
                <ComboboxField
                  label="Wo?"
                  control={control}
                  name="leagueId"
                  options={leagues}
                  filter={(query, league) =>
                    `${league.name} ${league.shortname}`
                      .toLowerCase()
                      .includes(query.toLowerCase())
                  }
                />
              </div>
              <ComboboxField
                label="Wer?"
                control={control}
                name="hometeamId"
                options={teams}
                filter={(q, team) =>
                  `${team.name} ${team.shortname}`
                    .toLowerCase()
                    .includes(q.toLowerCase())
                }
              />
              <ComboboxField
                label="Gegen wen?"
                control={control}
                name="awayteamId"
                options={teams}
                filter={(q, team) =>
                  `${team.name} ${team.shortname}`
                    .toLowerCase()
                    .includes(q.toLowerCase())
                }
              />
            </CardContent>
            <CardFooter className="justify-end gap-x-4">
              <Button type="button" onClick={endEdit}>
                Abbrechen
              </Button>
              <Button variant="primary" type="submit">
                Speichern
              </Button>
            </CardFooter>
          </form>
        )}
      </Card>
      <Card>
        <div className="overflow-x-auto overflow-y-hidden">
          <table className="min-w-full divide-y divide-border">
            <thead className="bg-surface-subtle">
              <tr>
                <th
                  scope="col"
                  className="py-3.5 pr-2 pl-4 text-left font-semibold text-foreground text-sm"
                >
                  Nr
                </th>
                <th
                  scope="col"
                  className="hidden px-2 py-3.5 text-left font-semibold text-foreground text-sm sm:table-cell sm:pr-6 lg:pr-8"
                >
                  Datum
                </th>
                <th
                  scope="col"
                  className="hidden px-2 py-3.5 text-left font-semibold text-foreground text-sm sm:table-cell sm:pr-6 lg:pr-8"
                >
                  Liga
                </th>
                <th
                  scope="col"
                  className="px-2 py-3.5 text-left font-semibold text-foreground text-sm sm:pr-6 lg:pr-8"
                >
                  Spiel
                </th>
                <th scope="col" className="py-3.5 pl-2 sm:pl-6 lg:pl-8">
                  <span className="sr-only">Edit</span>
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border bg-card pr-1">
              {matches
                .filter((m) => m.roundId === currentRound.id)
                .map((m) => (
                  <tr key={m.id}>
                    <td className="whitespace-nowrap py-4 pr-2 pl-4 text-muted-foreground text-sm">
                      {m.nr}
                    </td>
                    <td className="hidden whitespace-nowrap py-4 pr-4 pl-2 text-muted-foreground text-sm sm:table-cell sm:pr-6 lg:pr-8">
                      <span className="hidden lg:inline">
                        {formatDate(m.date)}
                      </span>
                      <span className="lg:hidden">
                        {formatDate(m.date, true)}
                      </span>
                    </td>
                    <td className="hidden whitespace-nowrap py-4 pr-4 pl-2 text-muted-foreground text-sm sm:table-cell sm:pr-6 lg:pr-8">
                      <span className="hidden lg:inline">
                        {leaguesHash[m.leagueId]?.name || ''}
                      </span>
                      <span className="lg:hidden">
                        {leaguesHash[m.leagueId]?.shortname || ''}
                      </span>
                    </td>
                    <td className="whitespace-nowrap py-4 pr-4 pl-2 text-muted-foreground text-sm sm:pr-6 lg:pr-8">
                      <span className="hidden lg:inline">
                        {`${teamsHash[m.hometeamId]?.name || ''} - ${
                          teamsHash[m.awayteamId]?.name || ''
                        }`.replace(/^ - $/, '')}
                      </span>
                      <span className="lg:hidden">
                        {`${teamsHash[m.hometeamId]?.shortname || ''} - ${
                          teamsHash[m.awayteamId]?.shortname || ''
                        }`.replace(/^ - $/, '')}
                      </span>
                    </td>
                    <td className="pr-3 text-right">
                      <Button
                        size="icon"
                        aria-label={`Spiel ${m.nr} bearbeiten`}
                        onClick={() => beginEdit(m)}
                      >
                        <PencilIcon className="h-4 w-4" aria-hidden="true" />
                      </Button>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
