import { Outlet } from 'react-router';
import { useCurrentChampionship } from '@/hooks/current-data/use-current-championship';
import { useCurrentDataStore } from '@/state/current-data-store';
import CurrentShellFallback from './current-shell.fallback';

export default function CurrentShell() {
  const { currentChampionship } = useCurrentChampionship();
  const isCurrentDataReady = useCurrentDataStore(
    (state) =>
      state.championshipPlayersLoaded &&
      state.matchesLoaded &&
      state.roundsLoaded &&
      state.tipsLoaded,
  );

  return (
    <div className="relative">
      <h2 className="font-semibold text-2xl">
        {currentChampionship?.name || 'Hinterhof'}
      </h2>
      {isCurrentDataReady ? <Outlet /> : <CurrentShellFallback />}
    </div>
  );
}
