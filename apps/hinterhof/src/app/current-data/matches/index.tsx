import { ChevronDownIcon, PencilIcon } from '@heroicons/react/24/outline';
import type { League, Match, Team } from 'lib';
import { useMemo, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import {
  Button,
  Card,
  ComboboxField,
  classNames,
  DateField,
  formatDate,
} from 'ui-legacy';

import AppCard from '#/components/layout/app-card';
import { useMatches } from '#/hooks/current-data/use-matches';
import { useRounds } from '#/hooks/current-data/use-rounds';
import { useLeagues } from '#/hooks/master-data/use-leagues';
import { useTeams } from '#/hooks/master-data/use-teams';
import { notify } from '#/utils/notify';

type MatchFormData = Omit<Match, 'id' | 'roundId' | 'result' | 'points'> & {
  id?: string;
};

export default function MatchesView() {
  const { leagues } = useLeagues();
  const { teams } = useTeams();
  const { rounds } = useRounds();
  const { matches, createMatch, updateMatch } = useMatches();

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
    if (matchData.id) {
      const match = matches.find(({ id }) => id === matchData.id);
      if (!match) throw new Error(`Match ${matchData.id} not found`);

      await notify(
        updateMatch({ ...match, ...matchData, id: matchData.id }),
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
        points: 0,
      };
      await notify(createMatch(match), `Spiel ${match.nr} hinzugefügt.`);
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
        <div className="mt-2">
          <div className="pb-2">
            <button
              type="button"
              onClick={() => setFormOpen(!isFormOpen)}
              className="flex w-full items-center justify-between px-4 py-2 font-semibold"
            >
              <span>{editMode ? 'Spiel bearbeiten' : 'Neues Spiel'}</span>
              <ChevronDownIcon
                className={classNames(
                  'h-5 w-5 transition-transform',
                  isFormOpen && 'rotate-180 transform',
                )}
              />
            </button>
          </div>
          {isFormOpen && (
            <div>
              <form noValidate onSubmit={handleSubmit(saveMatch)}>
                <div className="space-y-4 p-4 pt-2">
                  <div className="flex items-center">
                    <span className="font-semibold text-sm">Nummer</span>
                    <input
                      disabled
                      className="w-8 rounded-sm border-transparent bg-white p-1 text-center font-semibold text-sm"
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
                </div>
                <div className="space-x-4 bg-gray-50 px-4 py-3 text-right sm:px-6">
                  <Button type="button" onClick={endEdit}>
                    Abbrechen
                  </Button>
                  <Button primary type="submit">
                    Speichern
                  </Button>
                </div>
              </form>
            </div>
          )}
        </div>
      </Card>
      <AppCard>
        <div className="overflow-x-auto overflow-y-hidden">
          <table className="min-w-full divide-y divide-gray-300">
            <thead className="bg-gray-50">
              <tr>
                <th
                  scope="col"
                  className="py-3.5 pr-2 pl-4 text-left font-semibold text-gray-900 text-sm"
                >
                  Nr
                </th>
                <th
                  scope="col"
                  className="hidden px-2 py-3.5 text-left font-semibold text-gray-900 text-sm sm:table-cell sm:pr-6 lg:pr-8"
                >
                  Datum
                </th>
                <th
                  scope="col"
                  className="hidden px-2 py-3.5 text-left font-semibold text-gray-900 text-sm sm:table-cell sm:pr-6 lg:pr-8"
                >
                  Liga
                </th>
                <th
                  scope="col"
                  className="px-2 py-3.5 text-left font-semibold text-gray-900 text-sm sm:pr-6 lg:pr-8"
                >
                  Spiel
                </th>
                <th scope="col" className="py-3.5 pl-2 sm:pl-6 lg:pl-8">
                  <span className="sr-only">Edit</span>
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 bg-white pr-1">
              {matches
                .filter((m) => m.roundId === currentRound.id)
                .map((m) => (
                  <tr key={m.id}>
                    <td className="whitespace-nowrap py-4 pr-2 pl-4 text-gray-500 text-sm">
                      {m.nr}
                    </td>
                    <td className="hidden whitespace-nowrap py-4 pr-4 pl-2 text-gray-500 text-sm sm:table-cell sm:pr-6 lg:pr-8">
                      <span className="hidden lg:inline">
                        {formatDate(m.date)}
                      </span>
                      <span className="lg:hidden">
                        {formatDate(m.date, true)}
                      </span>
                    </td>
                    <td className="hidden whitespace-nowrap py-4 pr-4 pl-2 text-gray-500 text-sm sm:table-cell sm:pr-6 lg:pr-8">
                      <span className="hidden lg:inline">
                        {leaguesHash[m.leagueId]?.name || ''}
                      </span>
                      <span className="lg:hidden">
                        {leaguesHash[m.leagueId]?.shortname || ''}
                      </span>
                    </td>
                    <td className="whitespace-nowrap py-4 pr-4 pl-2 text-gray-500 text-sm sm:pr-6 lg:pr-8">
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
                      <Button onClick={() => beginEdit(m)}>
                        <PencilIcon className="h-4 w-4 text-indigo-600 hover:text-indigo-900" />
                      </Button>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </AppCard>
    </div>
  );
}
