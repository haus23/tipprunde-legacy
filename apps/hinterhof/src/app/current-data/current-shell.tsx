import { Outlet } from 'react-router';
import { useCurrentChampionship } from '@/hooks/current-data/use-current-championship';

export default function CurrentShell() {
  const { currentChampionship } = useCurrentChampionship();
  return (
    <div className="relative">
      <h2 className="font-semibold text-2xl">
        {currentChampionship?.name || 'Hinterhof'}
      </h2>
      <Outlet />
    </div>
  );
}
