import { useEffect } from 'react';

import { useCurrentChampionship } from '@/hooks/current-data/use-current-championship';
import { subscribeToCurrentData } from '@/state/current-data-store';
import { subscribeToMasterData } from '@/state/master-data-store';

export default function AppShellPreloader() {
  const { currentChampionship } = useCurrentChampionship();

  useEffect(() => subscribeToMasterData(), []);
  useEffect(
    () => subscribeToCurrentData(currentChampionship?.id),
    [currentChampionship?.id],
  );

  return null;
}
