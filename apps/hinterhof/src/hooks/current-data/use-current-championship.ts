import { type Championship, patchEntity } from 'lib';
import { useCallback } from 'react';
import { useMasterDataStore } from '#/state/master-data-store';
import { useSessionStore } from '#/state/session-store';

export function useCurrentChampionship() {
  const championships = useMasterDataStore((state) => state.championships);
  const currentChampionshipId = useSessionStore(
    (state) => state.currentChampionshipId,
  );
  const setCurrentChampionship = useSessionStore(
    (state) => state.setCurrentChampionship,
  );
  const currentChampionship =
    championships.find(({ id }) => id === currentChampionshipId) ??
    championships.at(0);

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
