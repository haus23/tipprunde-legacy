import { Suspense } from 'react';
import { Outlet } from 'react-router-dom';
import { useCurrentChampionship } from '@/hooks/current-data/use-current-championship';

export default function CurrentShell() {
  const { currentChampionship } = useCurrentChampionship();

  return (
    <div>
      <h2 className="text-2xl font-semibold">
        {currentChampionship?.name || 'Hinterhof'}
      </h2>
      <Suspense fallback={<div>Loading ...</div>}>
        <Outlet />
      </Suspense>
    </div>
  );
}
