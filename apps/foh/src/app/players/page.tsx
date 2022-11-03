import Select from '@/components/elements/select';
import { useRanking } from '@/hooks/use-ranking';
import { useState } from 'react';

export default function PlayersPage() {
  const { players: playersRaw } = useRanking();
  const players = [...playersRaw].sort((a, b) => a.name.localeCompare(b.name));

  const [player, setPlayer] = useState(players[0]);

  return (
    <div className="mx-auto max-w-5xl sm:px-6 lg:px-8">
      <header className="text-center sm:text-left">
        <div>
          <h1 className="text-xl font-semibold leading-tight tracking-tight flex items-center gap-x-4">
            <span>Tipps von</span>
            <div>
              <Select
                options={players}
                value={player}
                onChange={setPlayer}
                displayField="name"
              />
            </div>
          </h1>
        </div>
      </header>
    </div>
  );
}
