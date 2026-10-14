import type { Championship } from '@haus23/tipprunde-model';
import { useCallback } from 'react';
import { useParams } from 'react-router';
import { patchEntity } from '#/firebase/write';
import { useMasterDataStore } from '#/state/master-data-store';
import { useSessionStore } from '#/state/session-store';

// The championship lives in the URL (/:turnier/...). Routes without it, such
// as the master data, use the last visited championship, else the latest.
export function useCurrentChampionship() {
  const championships = useMasterDataStore((state) => state.championships);
  const { turnier } = useParams();
  const lastChampionshipId = useSessionStore(
    (state) => state.currentChampionshipId,
  );

  const currentChampionship = turnier
    ? championships.find(({ id }) => id === turnier)
    : (championships.find(({ id }) => id === lastChampionshipId) ??
      championships.at(0));

  const updateCurrentChampionship = useCallback(
    (changes: Partial<Championship>) =>
      currentChampionship
        ? patchEntity('championships', currentChampionship, changes)
        : Promise.resolve(),
    [currentChampionship],
  );

  return { currentChampionship, updateCurrentChampionship };
}
