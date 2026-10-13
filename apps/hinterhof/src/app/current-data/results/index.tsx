import {
  Field,
  Form,
  isDirty,
  reset,
  useFieldArray,
  useForm,
} from '@formisch/react';
import { resultRegEx, type Team } from '@haus23/tipprunde-model';
import { useEffect, useMemo } from 'react';
import * as v from 'valibot';
import Button from '#/components/button';
import ResultField from '#/components/form/result-field';
import DataCard from '#/components/layout/data-card';
import RoundNavigator from '#/components/round-navigator';
import { useCurrentChampionship } from '#/hooks/current-data/use-current-championship';
import { useCurrentRound } from '#/hooks/current-data/use-current-round';
import { useMatches } from '#/hooks/current-data/use-matches';
import { useRanking } from '#/hooks/current-data/use-ranking';
import { useTeams } from '#/hooks/master-data/use-teams';
import { invalidateCache } from '#/utils/invalidate-cache';
import { notify } from '#/utils/notify';

const ResultsFormSchema = v.object({
  results: v.array(
    v.pipe(v.string(), v.trim(), v.regex(resultRegEx, 'Ungültiges Ergebnis.')),
  ),
});

export default function ResultsView() {
  const { rounds, currentRound, setCurrentRound } = useCurrentRound();

  const { teams } = useTeams();
  const { matches, updateMatchResult } = useMatches();
  const { currentChampionship } = useCurrentChampionship();

  const fixtures = useMemo(() => {
    const teamsHash = Object.fromEntries(
      teams.map((team) => [team.id, team]),
    ) as Record<string, Team>;
    return matches.map((m) => ({
      ...m,
      hometeam: teamsHash[m.hometeamId],
      awayteam: teamsHash[m.awayteamId],
    }));
  }, [teams, matches]);

  const resultsForm = useForm({
    schema: ResultsFormSchema,
    initialInput: { results: [] },
  });

  // Changing the round discards unsaved results, so saving only ever writes
  // what is visible.
  useEffect(() => {
    reset(resultsForm, {
      initialInput: { results: matches.map((match) => match.result) },
    });
  }, [matches, resultsForm, currentRound.id]);

  const resultFields = useFieldArray(resultsForm, { path: ['results'] });

  const { calculateRanking } = useRanking();

  async function saveAndCalculate(
    data: v.InferOutput<typeof ResultsFormSchema>,
  ) {
    if (!currentChampionship) return;

    const updateOperations = data.results.flatMap((result, index) =>
      result !== matches[index].result
        ? [updateMatchResult(matches[index], result)]
        : [],
    );
    if (updateOperations.length === 0) return;

    const updateResults = async () => {
      const calculations = await Promise.all(updateOperations);
      await calculateRanking({
        matches: calculations.map(({ match }) => match),
        tips: calculations.flatMap(({ tips }) => tips),
      });
      await invalidateCache([
        { type: 'championship', id: currentChampionship.id },
      ]);
    };
    await notify(
      updateResults(),
      'Ergebnisse gespeichert und Tabelle neu berechnet',
    );
  }

  return (
    <div className="mt-5">
      <Form of={resultsForm} onSubmit={saveAndCalculate}>
        <DataCard
          title="Ergebnisse"
          description="Geänderte Ergebnisse speichern und die Tabelle neu berechnen."
          action={
            <Button
              variant="primary"
              type="submit"
              disabled={!isDirty(resultsForm) || resultsForm.isSubmitting}
            >
              Speichern
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
                    className="w-12 py-3.5 pr-2 pl-4 text-right font-semibold text-foreground text-sm sm:pl-6"
                  >
                    Nr
                  </th>
                  <th
                    scope="col"
                    className="px-2 py-3.5 text-left font-semibold text-foreground text-sm"
                  >
                    Spiel
                  </th>
                  <th
                    scope="col"
                    className="py-3.5 pr-4 pl-2 font-semibold text-foreground text-sm sm:pr-6"
                  >
                    Ergebnis
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border bg-card">
                {resultFields.items.map((fieldId, ix) =>
                  fixtures[ix].roundId === currentRound.id ? (
                    <tr key={fieldId}>
                      <td className="whitespace-nowrap py-4 pr-2 pl-4 text-right text-muted-foreground text-sm sm:pl-6">
                        {fixtures[ix].nr}
                      </td>
                      <td className="px-2 py-4 text-muted-foreground text-sm">
                        <span className="hidden lg:inline">
                          {`${fixtures[ix].hometeam?.name || ''} - ${
                            fixtures[ix].awayteam?.name || ''
                          }`.replace(/^ - $/, '')}
                        </span>
                        <span className="lg:hidden">
                          {`${fixtures[ix].hometeam?.shortname || ''} - ${
                            fixtures[ix].awayteam?.shortname || ''
                          }`.replace(/^ - $/, '')}
                        </span>
                      </td>
                      <td className="w-24 py-2 pr-4 pl-2 sm:pr-6">
                        <Field of={resultsForm} path={['results', ix]}>
                          {(field) => (
                            <ResultField
                              {...field.props}
                              label={`Ergebnis für Spiel ${fixtures[ix].nr}`}
                              value={field.input ?? ''}
                              error={field.errors?.[0]}
                              className="justify-end"
                            />
                          )}
                        </Field>
                      </td>
                    </tr>
                  ) : null,
                )}
              </tbody>
            </table>
          </div>
        </DataCard>
      </Form>
    </div>
  );
}
