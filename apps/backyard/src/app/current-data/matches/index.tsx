import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { ChevronDownIcon } from '@heroicons/react/24/outline';

import {
  Button,
  Card,
  classNames,
  ComboboxField,
  DateField,
  TextField,
} from 'ui';
import { Match } from 'lib';

import { useMatches } from '@/hooks/current-data/use-matches';
import { useRounds } from '@/hooks/current-data/use-rounds';
import { useLeagues } from '@/hooks/master-data/use-leagues';
import { useTeams } from '@/hooks/master-data/use-teams';
import { notify } from '@/utils/notify';

export default function MatchesView() {
  const { leagues } = useLeagues();
  const { teams } = useTeams();
  const { rounds } = useRounds();
  const { matches, createMatch } = useMatches();

  const [currentRound, setCurrentRound] = useState(rounds[rounds.length - 1]);

  const nr = (matches.at(-1)?.nr || 0) + 1;
  const date = matches.at(-1)?.date || new Date().toISOString().slice(0, 10);

  const [isFormOpen, setFormOpen] = useState(matches.length === 0);
  const [editMode, setEditMode] = useState(false);

  const initialFormValues: Partial<Match> = {
    date,
    leagueId: '',
    hometeamId: '',
    awayteamId: '',
  };

  const { control, handleSubmit, reset, setFocus } = useForm<Match>({
    defaultValues: initialFormValues,
  });

  async function saveMatch(match: Match) {
    match.nr = nr;
    match.roundId = currentRound.id;
    match.result = '';
    match.points = 0;
    await notify(createMatch(match), `Spiel ${nr} hinzugefügt.`);
    reset({
      date: match.date,
      leagueId: '',
      hometeamId: '',
      awayteamId: '',
    });
    setFocus('date', { shouldSelect: true });
  }

  function endEdit() {
    reset();
    setEditMode(false);
    setFormOpen(false);
  }

  return (
    <div className="mt-5">
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
        <div className="mt-2">
          <div className="pb-2">
            <button
              onClick={() => setFormOpen(!isFormOpen)}
              className="w-full flex items-center justify-between px-4 py-2 font-semibold"
            >
              <span>{editMode ? 'Spiel bearbeiten' : `Neues Spiel`}</span>
              <ChevronDownIcon
                className={classNames(
                  'h-5 w-5 transition-transform',
                  isFormOpen && 'rotate-180 transform'
                )}
              />
            </button>
          </div>
          {isFormOpen && (
            <div>
              <form noValidate onSubmit={handleSubmit(saveMatch)}>
                <div className="space-y-4 p-4 pt-2">
                  <span className="text-sm font-semibold">Nummer {nr}</span>
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
                <div className="bg-gray-50 px-4 py-3 text-right sm:px-6 space-x-4">
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
    </div>
  );
}
