import { useEffect, useMemo, useState } from 'react';
import { Button, Card, classNames, TextField } from 'ui';

import { Team } from 'lib';

import { useRounds } from '@/hooks/current-data/use-rounds';
import AppCard from '@/components/layout/app-card';
import { useTeams } from '@/hooks/master-data/use-teams';
import { useMatches } from '@/hooks/current-data/use-matches';
import { useFieldArray, useForm } from 'react-hook-form';
import { notify } from '@/utils/notify';
import { useRanking } from '@/hooks/current-data/use-ranking';

type ResultsFormType = {
  results: { matchId: string; result: string }[];
};

export default function ResultsView() {
  const { rounds } = useRounds();
  const [currentRound, setCurrentRound] = useState(rounds[rounds.length - 1]);

  const { teams } = useTeams();
  const { matches, updateMatchResult } = useMatches();

  const fixtures = useMemo(() => {
    const teamsHash = teams.reduce(
      (hash, team) => ({ ...hash, [team.id]: team }),
      {} as Record<string, Team>
    );
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
      const updateOperations = dirtyFields.results.reduce((promises, _, ix) => {
        const updates = data.results[ix];
        promises.push(updateMatchResult(matches[ix], updates.result));
        return promises;
      }, [] as Promise<void>[]);
      await notify(
        Promise.all(updateOperations),
        'Ergebnisse gespeichert und berechnet'
      );
      await notify(calculateRanking(), 'Tabelle neu berechnet');
    }
  }

  async function calculateCurrentRanking() {
    await notify(
      Promise.all(matches.map((m) => updateMatchResult(m, m.result))),
      `Alle Spiele neu berechnet.`
    );
    await notify(calculateRanking(), 'Tabelle neu berechnet');
  }

  return (
    <div className="mt-5 space-y-8">
      <div>
        <Card>
          <div className="flex items-center border-b border-gray-200 font-semibold px-2 sm:px-4 gap-x-4 sm:gap-x-8">
            <span>Runde</span>
            <nav
              className="-mb-px flex items-center justify-around"
              aria-label="Tabs"
            >
              {rounds.map((round) => (
                <button
                  key={round.id}
                  onClick={() => setCurrentRound(round)}
                  className={classNames(
                    round === currentRound
                      ? 'border-indigo-500 text-indigo-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300',
                    'whitespace-nowrap py-4 px-4 md:px-6 border-b-2 font-medium text-sm'
                  )}
                >
                  {round.nr}
                </button>
              ))}
            </nav>
          </div>
          <div className="py-4 px-4 flex items-center justify-end gap-x-8">
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
                    className="pl-4 pr-2 py-3.5 w-12 text-right text-sm font-semibold text-gray-900"
                  >
                    Nr
                  </th>
                  <th
                    scope="col"
                    className="px-2 py-3.5 text-left text-sm font-semibold text-gray-900 "
                  >
                    Spiel
                  </th>
                  <th
                    scope="col"
                    className="py-3.5 pl-2 pr-4 text-sm font-semibold text-gray-900 sm:pr-6 lg:pr-8"
                  >
                    Ergebnis
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 bg-white pr-1">
                {fields.map((field, ix) =>
                  fixtures[ix].roundId === currentRound.id ? (
                    <tr key={field.id}>
                      <td className="whitespace-nowrap text-right pl-4 pr-2 py-4 text-sm text-gray-500">
                        {fixtures[ix].nr}
                      </td>
                      <td className="whitespace-nowrap py-4 px-2 text-sm text-gray-500">
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
                      <td className="w-20 pl-2 pr-4 sm:pr-6 lg:pr-8">
                        <TextField
                          control={control}
                          name={`results.${ix}.result`}
                          label=""
                        />
                      </td>
                    </tr>
                  ) : null
                )}
              </tbody>
            </table>
          </div>
        </form>
      </AppCard>
    </div>
  );
}
