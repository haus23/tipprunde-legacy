import { useMemo, useState } from 'react';
import { Card, classNames, Select } from 'ui';

import { useRounds } from '@/hooks/current-data/use-rounds';
import { useChampionshipPlayers } from '@/hooks/current-data/use-championship-players';
import { usePlayers } from '@/hooks/master-data/use-players';
import { Player } from 'lib';

export default function TipsView() {
  const { players } = usePlayers();
  const { championshipPlayers } = useChampionshipPlayers();
  const { rounds } = useRounds();

  const playersHash = useMemo(
    () =>
      players.reduce((hash, player) => {
        hash[player.id] = player;
        return hash;
      }, {} as Record<string, Player>),
    [players]
  );

  const playerSelectOptions = championshipPlayers
    .map((cp) => ({
      ...cp,
      name: playersHash[cp.playerId].name,
    }))
    .sort((a, b) => a.name.localeCompare(b.name));

  const [currentRound, setCurrentRound] = useState(rounds[rounds.length - 1]);
  const [player, setPlayer] = useState(playerSelectOptions[0]);

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
        <div className="py-4 px-4">
          <h3 className="font-semibold flex items-center gap-x-4">
            <span>Tipps von</span>
            <div className="grow">
              <Select
                options={playerSelectOptions}
                selected={player}
                onChange={setPlayer}
              />
            </div>
          </h3>
        </div>
      </Card>
    </div>
  );
}
