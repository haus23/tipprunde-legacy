import type { Team } from 'lib';
import { useEffect, useMemo, useState } from 'react';
import { useFieldArray, useForm } from 'react-hook-form';
import { Button, Card, classNames, TextField } from 'ui-legacy';
import AppCard from '#/components/layout/app-card';
import { useMatches } from '#/hooks/current-data/use-matches';
import { useRanking } from '#/hooks/current-data/use-ranking';
import { useRounds } from '#/hooks/current-data/use-rounds';
import { useTeams } from '#/hooks/master-data/use-teams';
import { notify } from '#/utils/notify';

type ResultsFormType = {
  results: { matchId: string; result: string }[];
};

export default function ResultsView() {
  const { rounds } = useRounds();
  const [currentRound, setCurrentRound] = useState(rounds[rounds.length - 1]);

  const { teams } = useTeams();
  const { matches, updateMatchResult } = useMatches();

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
    reset,
    formState: { dirtyFields },
  } = useForm<ResultsFormType>({
    defaultValues: {
      results: new Array(matches.length).fill({ matchId: '', result: '' }),
    },
  });

  useEffect(() => {
    reset({
      results: matches.map((m) => ({ matchId: m.id, result: m.result })),
    });
  }, [matches, reset]);

  const { fields } = useFieldArray({ control, name: 'results' });

  const { calculateRanking } = useRanking();

  async function saveAndCalculate(data: ResultsFormType) {
    if (dirtyFields.results) {
      const updateOperations = data.results.flatMap((updates, ix) =>
        dirtyFields.results?.[ix]?.result
          ? [updateMatchResult(matches[ix], updates.result)]
          : [],
      );
      const calculations = await notify(
        Promise.all(updateOperations),
        'Ergebnisse gespeichert und berechnet',
      );
      await notify(
        calculateRanking(calculations.flatMap(({ tips }) => tips)),
        'Tabelle neu berechnet',
      );
    }
  }

  async function calculateCurrentRanking() {
    const calculations = await notify(
      Promise.all(matches.map((m) => updateMatchResult(m, m.result))),
      'Alle Spiele neu berechnet.',
    );
    await notify(
      calculateRanking(calculations.flatMap(({ tips }) => tips)),
      'Tabelle neu berechnet',
    );
  }

  return (
    <div className="mt-5 space-y-8">
      <div>
        <Card>
          <div className="flex items-center gap-x-4 border-gray-200 border-b px-2 font-semibold sm:gap-x-8 sm:px-4">
            <span>Runde</span>
            <nav
              className="-mb-px flex items-center justify-around"
              aria-label="Tabs"
            >
              {rounds.map((round) => (
                <button
                  type="button"
                  key={round.id}
                  onClick={() => setCurrentRound(round)}
                  className={classNames(
                    round === currentRound
                      ? 'border-indigo-500 text-indigo-600'
                      : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700',
                    'whitespace-nowrap border-b-2 px-4 py-4 font-medium text-sm md:px-6',
                  )}
                >
                  {round.nr}
                </button>
              ))}
            </nav>
          </div>
          <div className="flex items-center justify-end gap-x-8 px-4 py-4">
            <Button
              type="button"
              primary={true}
              onClick={calculateCurrentRanking}
            >
              Alles neu berechnen
            </Button>
            <Button
              type="button"
              primary={true}
              onClick={handleSubmit(saveAndCalculate)}
            >
              Speichern und berechnen
            </Button>
          </div>
        </Card>
      </div>
      <AppCard>
        <form>
          <div className="overflow-x-auto overflow-y-hidden">
            <table className="min-w-full divide-y divide-gray-300">
              <thead className="bg-gray-50">
                <tr>
                  <th
                    scope="col"
                    className="w-12 py-3.5 pr-2 pl-4 text-right font-semibold text-gray-900 text-sm"
                  >
                    Nr
                  </th>
                  <th
                    scope="col"
                    className="px-2 py-3.5 text-left font-semibold text-gray-900 text-sm"
                  >
                    Spiel
                  </th>
                  <th
                    scope="col"
                    className="py-3.5 pr-4 pl-2 font-semibold text-gray-900 text-sm sm:pr-6 lg:pr-8"
                  >
                    Ergebnis
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 bg-white pr-1">
                {fields.map((field, ix) =>
                  fixtures[ix].roundId === currentRound.id ? (
                    <tr key={field.id}>
                      <td className="whitespace-nowrap py-4 pr-2 pl-4 text-right text-gray-500 text-sm">
                        {fixtures[ix].nr}
                      </td>
                      <td className="whitespace-nowrap px-2 py-4 text-gray-500 text-sm">
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
                      <td className="w-20 pr-4 pl-2 sm:pr-6 lg:pr-8">
                        <TextField
                          control={control}
                          name={`results.${ix}.result`}
                          label=""
                        />
                      </td>
                    </tr>
                  ) : null,
                )}
              </tbody>
            </table>
          </div>
        </form>
      </AppCard>
    </div>
  );
}
