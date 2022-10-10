import { Suspense } from 'react';
import { Outlet } from 'react-router-dom';
import { useCurrentChampionship } from '@/hooks/current-data/use-current-championship';
import CurrentShellFallback from './current-shell.fallback';
import CurrentShellPreloader from './current-shell.preloader';

export default function CurrentShell() {
  const { currentChampionship } = useCurrentChampionship();

  return (
    <div className="relative">
      <h2 className="text-2xl font-semibold">
        {currentChampionship?.name || 'Hinterhof'}
      </h2>
      <Suspense fallback={<CurrentShellFallback />}>
        <CurrentShellPreloader />
        <Outlet />
      </Suspense>
    </div>
  );
}
