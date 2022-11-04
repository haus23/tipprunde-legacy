import { Disclosure } from '@headlessui/react';
import { ChevronDownIcon } from '@heroicons/react/24/outline';

import Select from '@/components/elements/select';
import { useRanking } from '@/hooks/use-ranking';
import { classNames } from '@/utils/class-names';
import { formatDate } from '@/utils/format-date';
import { useNavigate, useParams } from 'react-router-dom';

export default function PlayersPage() {
  const { playerId, championshipId } = useParams();
  const navigate = useNavigate();

  const { players: playersRaw, rounds, matches, tips } = useRanking();

  const players = [...playersRaw].sort((a, b) => a.name.localeCompare(b.name));

  // playersRaw[0] -> damit wird der Spitzenreiter per Default angezeigt.
  const player = playerId
    ? players.find((p) => p.playerId === playerId) || playersRaw[0]
    : playersRaw[0];

  const championshipRouteSegment = championshipId ? `/${championshipId}` : '';
  function navigateTo(playerId: string) {
    navigate(`${championshipRouteSegment}/spieler/${playerId}`);
  }

  return (
    <div className="mx-auto max-w-5xl sm:px-6 lg:px-8">
      <header className="flex justify-center text-center sm:text-left sm:justify-start">
        <h1 className="text-xl font-semibold leading-tight tracking-tight flex items-center gap-x-4">
          <span>Tipps von</span>
          <div>
            <Select
              options={players}
              value={player}
              onChange={(p) => navigateTo(p.playerId)}
              displayField="name"
            />
          </div>
        </h1>
      </header>
      <div className="pt-6">
        {rounds.map((round, ix) => (
          <Disclosure key={round.id} defaultOpen={ix === rounds.length - 1}>
            <Disclosure.Button
              className={classNames(
                'flex items-center justify-between w-full px-5 py-4 font-medium text-left text-gray-500 border border-gray-200 dark:border-gray-700 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800',
                ix !== rounds.length - 1 && 'border-b-0'
              )}
            >
              <span>Runde {round.nr}</span>
              <ChevronDownIcon className="w-5 h-5 transition-transform ui-open:rotate-180 ui-open:transform" />
            </Disclosure.Button>
            <Disclosure.Panel>
              <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                  <tr>
                    <th scope="col" className="py-3 pl-2 pr-1 sm:px-4 md:px-6">
                      Wann
                    </th>
                    <th
                      scope="col"
                      className="py-3 px-1 sm:px-4 md:px-6 w-full"
                    >
                      Spiel
                    </th>
                    <th scope="col" className="py-3 px-1 sm:px-4 md:px-6">
                      Ergebnis
                    </th>
                    <th scope="col" className="py-3 px-1 sm:px-4 md:px-6">
                      Tipp
                    </th>
                    <th scope="col" className="py-3 pl-1 pr-2 sm:px-4 md:px-6">
                      Punkte
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {matches
                    .filter((m) => m.roundId === round.id)
                    .map((m, ix, roundMatches) => {
                      const tip = tips.find(
                        (t) => t.matchId === m.id && t.playerId === player.id
                      );
                      return (
                        <tr
                          key={m.id}
                          className={classNames(
                            'bg-white dark:bg-gray-800 dark:border-gray-700 text-gray-900 dark:text-white',
                            ix !== roundMatches.length - 1 && 'border-b'
                          )}
                        >
                          <td className="text-right py-4 px-1 sm:px-4 md:px-6">
                            <span className="sm:hidden">
                              {formatDate(m.date, true)}
                            </span>
                            <span className="hidden sm:inline">
                              {formatDate(m.date)}
                            </span>
                          </td>
                          <td className="py-4 px-1 sm:px-4 md:px-6">
                            <span className="md:hidden">
                              {`${m.hometeam?.shortname || ''} - ${
                                m.awayteam?.shortname || ''
                              }`.replace(/^ - $/, '')}
                            </span>
                            <span className="hidden md:inline">
                              {`${m.hometeam?.name || ''} - ${
                                m.awayteam?.name || ''
                              }`.replace(/^ - $/, '')}
                            </span>
                          </td>
                          <td className="text-center py-4 px-1 sm:px-4 md:px-6">
                            {m.result}
                          </td>
                          <td className="text-center py-4 px-1 sm:px-4 md:px-6">
                            {tip?.tip}
                          </td>
                          <td className="text-center py-4 px-1 sm:px-4 md:px-6">
                            {tip?.points}
                          </td>
                        </tr>
                      );
                    })}
                </tbody>
              </table>
            </Disclosure.Panel>
          </Disclosure>
        ))}
      </div>
    </div>
  );
}
