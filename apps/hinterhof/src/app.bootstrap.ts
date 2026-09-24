import { auth } from 'lib';
import { useEffect, useState } from 'react';

import {
  subscribeToCurrentData,
  useCurrentDataStore,
} from '#/state/current-data-store';
import {
  subscribeToMasterData,
  useMasterDataStore,
} from '#/state/master-data-store';
import { useSessionStore } from '#/state/session-store';

export type BootstrapPhase = 'auth' | 'master-data' | 'current-data' | 'ready';

export function useBootstrap(): BootstrapPhase {
  const [isAuthResolved, setAuthResolved] = useState(false);
  const profile = useSessionStore((state) => state.profile);
  const isAuthenticated = profile !== null;
  const setProfile = useSessionStore((state) => state.setProfile);
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

  useEffect(
    () =>
      auth.onAuthStateChanged((user) => {
        setProfile(
          user
            ? {
                uid: user.uid,
                email: user.email,
                displayName: user.displayName,
                photoURL: user.photoURL,
              }
            : null,
        );
        setAuthResolved(true);
      }),
    [setProfile],
  );

  useEffect(() => {
    if (!isAuthResolved || !isAuthenticated) return;
    return subscribeToMasterData();
  }, [isAuthResolved, isAuthenticated]);

  useEffect(() => {
    if (!isAuthenticated || !isMasterDataReady) return;
    return subscribeToCurrentData(currentChampionship?.id);
  }, [currentChampionship?.id, isAuthenticated, isMasterDataReady]);

  if (!isAuthResolved) return 'auth';
  if (!isAuthenticated) return 'ready';
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
