import { currentChampionshipState } from '@/state/current-data/current-championship-state';
import { type Championship, patchEntity } from 'lib';
import { useCallback } from 'react';
import { useRecoilState } from 'recoil';

export function useCurrentChampionship() {
  const [currentChampionship, setCurrentChampionship] = useRecoilState(
    currentChampionshipState,
  );

  const updateCurrentChampionship = useCallback(
    (changes: Partial<Championship>) =>
      currentChampionship
        ? patchEntity('championships', currentChampionship, changes)
        : Promise.resolve(),
    [currentChampionship],
  );

  return {
    currentChampionship,
    setCurrentChampionship,
    updateCurrentChampionship,
  };
}
