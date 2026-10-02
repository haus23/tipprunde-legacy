import type { Team } from '@haus23/tipprunde-model';
import { useEffect, useMemo, useState } from 'react';
import { useFieldArray, useForm } from 'react-hook-form';
import Button from '#/components/button';
import { Card, CardContent, CardHeader, CardTitle } from '#/components/card';
import { fieldControlStyles } from '#/components/form/field';
import RoundTabs from '#/components/round-tabs';
import { useCurrentChampionship } from '#/hooks/current-data/use-current-championship';
import { useMatches } from '#/hooks/current-data/use-matches';
import { useRanking } from '#/hooks/current-data/use-ranking';
import { useRounds } from '#/hooks/current-data/use-rounds';
import { useTeams } from '#/hooks/master-data/use-teams';
import { invalidateCache } from '#/utils/invalidate-cache';
import { notify } from '#/utils/notify';

type ResultsFormType = {
  results: { matchId: string; result: string }[];
};

export default function ResultsView() {
  const { rounds } = useRounds();
  const [currentRound, setCurrentRound] = useState(rounds[rounds.length - 1]);

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

  const {
    control,
    handleSubmit,
    register,
    reset,
    formState: { dirtyFields },
  } = useForm<ResultsFormType>({ defaultValues: { results: [] } });

  useEffect(() => {
    reset({
      results: matches.map((m) => ({ matchId: m.id, result: m.result })),
    });
  }, [matches, reset]);

  const { fields } = useFieldArray({ control, name: 'results' });

  const { calculateRanking } = useRanking();

  async function saveAndCalculate(data: ResultsFormType) {
    if (!dirtyFields.results || !currentChampionship) return;

    const updateOperations = data.results.flatMap((updates, ix) =>
      dirtyFields.results?.[ix]?.result
        ? [updateMatchResult(matches[ix], updates.result)]
        : [],
    );
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
    <div className="mt-5 space-y-8">
      <Card>
        <RoundTabs
          rounds={rounds}
          value={currentRound?.id}
          onValueChange={setCurrentRound}
        />
      </Card>
      <form onSubmit={handleSubmit(saveAndCalculate)}>
        <Card>
          <CardHeader className="flex flex-col items-stretch gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <CardTitle>Ergebnisse</CardTitle>
              <p className="mt-1 text-muted-foreground text-sm">
                Geänderte Ergebnisse speichern und die Tabelle neu berechnen.
              </p>
            </div>
            <Button
              className="whitespace-nowrap sm:shrink-0"
              variant="primary"
              type="submit"
            >
              Speichern und berechnen
            </Button>
          </CardHeader>
          <CardContent className="p-0 sm:p-0">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-border">
                <thead className="bg-surface-subtle">
                  <tr>
                    <th
                      scope="col"
                      className="w-12 py-3.5 pr-2 pl-4 text-right font-semibold text-foreground text-sm"
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
                      className="py-3.5 pr-4 pl-2 font-semibold text-foreground text-sm sm:pr-6 lg:pr-8"
                    >
                      Ergebnis
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border bg-card">
                  {fields.map((field, ix) =>
                    fixtures[ix].roundId === currentRound.id ? (
                      <tr key={field.id}>
                        <td className="whitespace-nowrap py-4 pr-2 pl-4 text-right text-muted-foreground text-sm">
                          {fixtures[ix].nr}
                        </td>
                        <td className="whitespace-nowrap px-2 py-4 text-muted-foreground text-sm">
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
                        <td className="w-24 py-2 pr-4 pl-2 sm:pr-6 lg:pr-8">
                          <input
                            {...register(`results.${ix}.result`)}
                            type="text"
                            aria-label={`Ergebnis für Spiel ${fixtures[ix].nr}`}
                            className={fieldControlStyles({
                              className:
                                'ml-auto w-16 text-center font-medium tabular-nums',
                            })}
                          />
                        </td>
                      </tr>
                    ) : null,
                  )}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </form>
    </div>
  );
}
