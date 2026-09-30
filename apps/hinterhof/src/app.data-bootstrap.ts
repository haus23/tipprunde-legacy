import { useEffect } from 'react';

import {
  subscribeToCurrentData,
  useCurrentDataStore,
} from '#/state/current-data-store';
import {
  subscribeToMasterData,
  useMasterDataStore,
} from '#/state/master-data-store';
import { useSessionStore } from '#/state/session-store';

export type DataBootstrapPhase = 'master-data' | 'current-data' | 'ready';

export function useDataBootstrap(): DataBootstrapPhase {
  const currentChampionshipId = useSessionStore(
    (state) => state.currentChampionshipId,
  );
  const championships = useMasterDataStore((state) => state.championships);
  const isMasterDataReady = useMasterDataStore(
    (state) =>
      state.championshipsLoaded &&
      state.leaguesLoaded &&
      state.playersLoaded &&
      state.rulesLoaded &&
      state.teamsLoaded,
  );
  const currentDataChampionshipId = useCurrentDataStore(
    (state) => state.championshipId,
  );
  const isCurrentDataReady = useCurrentDataStore(
    (state) =>
      state.championshipPlayersLoaded &&
      state.matchesLoaded &&
      state.roundsLoaded &&
      state.tipsLoaded,
  );

  const currentChampionship =
    championships.find(({ id }) => id === currentChampionshipId) ??
    championships.at(0);

  useEffect(() => subscribeToMasterData(), []);

  useEffect(() => {
    if (!isMasterDataReady) return;
    return subscribeToCurrentData(currentChampionship?.id);
  }, [currentChampionship?.id, isMasterDataReady]);

  if (!isMasterDataReady) return 'master-data';
  if (
    currentChampionship &&
    (currentDataChampionshipId !== currentChampionship.id ||
      !isCurrentDataReady)
  ) {
    return 'current-data';
  }
  return 'ready';
}
