import { Field, focus, getInput, reset, useForm } from '@formisch/react';
import {
  type League,
  type Match,
  MatchDateSchema,
  type Team,
} from '@haus23/tipprunde-model';
import { PencilIcon, PlusIcon } from 'lucide-react';
import { useMemo, useRef, useState } from 'react';
import * as v from 'valibot';
import Button from '#/components/button';
import ComboboxField from '#/components/form/combobox-field';
import DateField from '#/components/form/date-field';
import FormDialog from '#/components/form-dialog';
import DataCard from '#/components/layout/data-card';
import RoundNavigator from '#/components/round-navigator';
import { useCurrentChampionship } from '#/hooks/current-data/use-current-championship';
import { useCurrentRound } from '#/hooks/current-data/use-current-round';
import { useMatches } from '#/hooks/current-data/use-matches';
import { useLeagues } from '#/hooks/master-data/use-leagues';
import { useTeams } from '#/hooks/master-data/use-teams';
import { formatDate } from '#/utils/format-date';
import { invalidateCache } from '#/utils/invalidate-cache';
import { notify } from '#/utils/notify';

const MatchFormSchema = v.object({
  id: v.optional(v.string()),
  nr: v.number(),
  date: MatchDateSchema,
  leagueId: v.string(),
  hometeamId: v.string(),
  awayteamId: v.string(),
});

type MatchFormData = v.InferOutput<typeof MatchFormSchema>;

export default function MatchesView() {
  const { leagues } = useLeagues();
  const { teams } = useTeams();
  const { rounds, currentRound, setCurrentRound } = useCurrentRound();
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

  // The page controls the dialog: creating matches one after another or
  // editing a single match. The mode outlives closing, so title and buttons
  // do not switch during the closing animation.
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogMode, setDialogMode] = useState<'create' | 'edit'>('create');
  const dateInputRef = useRef<HTMLInputElement | null>(null);

  const nextNr = (matches.at(-1)?.nr || 0) + 1;
  const latestDate = matches.reduce(
    (lastDate, match) => (match.date > lastDate ? match.date : lastDate),
    '',
  );

  const emptyMatch: MatchFormData = {
    nr: nextNr,
    date: latestDate,
    leagueId: '',
    hometeamId: '',
    awayteamId: '',
  };

  const matchForm = useForm({
    schema: MatchFormSchema,
    initialInput: emptyMatch,
  });
  const nr = getInput(matchForm, { path: ['nr'] });

  function beginCreate() {
    reset(matchForm, { initialInput: emptyMatch });
    setDialogMode('create');
    setDialogOpen(true);
  }

  function beginEdit(match: Match) {
    // Suggest the date of the preceding match for a match without date
    const previousMatch = matches.reduce<Match | undefined>(
      (previous, m) =>
        m.nr < match.nr && (!previous || m.nr > previous.nr) ? m : previous,
      undefined,
    );
    reset(matchForm, {
      initialInput: {
        id: match.id,
        nr: match.nr,
        date: match.date || previousMatch?.date || '',
        leagueId: match.leagueId,
        hometeamId: match.hometeamId,
        awayteamId: match.awayteamId,
      },
    });
    setDialogMode('edit');
    setDialogOpen(true);
  }

  function closeDialog() {
    setDialogOpen(false);
  }

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
      closeDialog();
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
      // Matches are entered one after another: stay open for the next one
      reset(matchForm, {
        initialInput: { ...emptyMatch, date: match.date, nr: match.nr + 1 },
      });
      focus(matchForm, { path: ['date'] });
    }
  }

  return (
    <div className="mt-5">
      <FormDialog
        open={dialogOpen}
        onOpenChange={(open) => {
          if (!open) closeDialog();
        }}
        form={matchForm}
        onSubmit={saveMatch}
        initialFocus={dateInputRef}
        title={
          dialogMode === 'edit'
            ? `Spiel ${nr} bearbeiten`
            : `Spiel ${nr} anlegen`
        }
        cancelLabel={dialogMode === 'edit' ? 'Abbrechen' : 'Schließen'}
        submitLabel={dialogMode === 'edit' ? 'Speichern' : 'Anlegen'}
      >
        <div className="flex flex-col gap-4 sm:flex-row">
          <Field of={matchForm} path={['date']}>
            {(field) => (
              <DateField
                {...field.props}
                ref={(element) => {
                  field.props.ref(element);
                  dateInputRef.current = element;
                }}
                label="Wann?"
                value={field.input ?? ''}
                error={field.errors?.[0]}
              />
            )}
          </Field>
          <div className="min-w-0 grow">
            <Field of={matchForm} path={['leagueId']}>
              {(field) => (
                <ComboboxField
                  label="Wo?"
                  name={field.props.name}
                  value={field.input ?? ''}
                  onValueChange={field.onChange}
                  onBlur={field.props.onBlur}
                  ref={field.props.ref}
                  options={leagues}
                  filter={(query, league) =>
                    `${league.name} ${league.shortname}`
                      .toLowerCase()
                      .includes(query.toLowerCase())
                  }
                />
              )}
            </Field>
          </div>
        </div>
        <Field of={matchForm} path={['hometeamId']}>
          {(field) => (
            <ComboboxField
              label="Wer?"
              name={field.props.name}
              value={field.input ?? ''}
              onValueChange={field.onChange}
              onBlur={field.props.onBlur}
              ref={field.props.ref}
              options={teams}
              filter={(q, team) =>
                `${team.name} ${team.shortname}`
                  .toLowerCase()
                  .includes(q.toLowerCase())
              }
            />
          )}
        </Field>
        <Field of={matchForm} path={['awayteamId']}>
          {(field) => (
            <ComboboxField
              label="Gegen wen?"
              name={field.props.name}
              value={field.input ?? ''}
              onValueChange={field.onChange}
              onBlur={field.props.onBlur}
              ref={field.props.ref}
              options={teams}
              filter={(q, team) =>
                `${team.name} ${team.shortname}`
                  .toLowerCase()
                  .includes(q.toLowerCase())
              }
            />
          )}
        </Field>
      </FormDialog>
      <DataCard
        title="Spiele"
        description="Spiele der ausgewählten Runde anlegen und bearbeiten."
        action={
          <Button variant="primary" onClick={beginCreate}>
            <PlusIcon className="mr-1.5 -ml-1 size-4" aria-hidden="true" />
            Neues Spiel
          </Button>
        }
        toolbar={
          <RoundNavigator
            rounds={rounds}
            value={currentRound}
            onValueChange={setCurrentRound}
          />
        }
      >
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-border">
            <thead className="bg-surface-subtle">
              <tr>
                <th
                  scope="col"
                  className="py-3.5 pr-2 pl-4 text-left font-semibold text-foreground text-sm sm:pl-6"
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
                <th scope="col" className="py-3.5 pr-4 pl-2 sm:pr-6">
                  <span className="sr-only">Edit</span>
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border bg-card pr-1">
              {matches
                .filter((m) => m.roundId === currentRound.id)
                .map((m) => (
                  <tr key={m.id}>
                    <td className="whitespace-nowrap py-4 pr-2 pl-4 text-muted-foreground text-sm sm:pl-6">
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
                    <td className="py-4 pr-4 pl-2 text-muted-foreground text-sm sm:pr-6 lg:pr-8">
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
                    <td className="py-2 pr-4 pl-2 text-right sm:pr-6">
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
      </DataCard>
    </div>
  );
}
