import type {
  Championship,
  ChampionshipPlayer,
  Match,
  Round,
  Tip,
} from '@haus23/tipprunde-model';
import { create } from 'zustand';

import { onCommit } from '#/firebase/write';
import {
  applyWrites,
  type Bindings,
  loadCollections,
} from './collection-bindings';
import { loadSource } from './load-source';
import { useSessionStore } from './session-store';

type CurrentData = {
  championshipPlayers: ChampionshipPlayer[];
  matches: Match[];
  rounds: Round[];
  tips: Tip[];
};

const initialCurrentData: CurrentData = {
  championshipPlayers: [],
  matches: [],
  rounds: [],
  tips: [],
};

function bindingsFor(
  championshipId: Championship['id'],
): Bindings<CurrentData> {
  const path = `championships/${championshipId}`;
  return {
    championshipPlayers: { path: `${path}/players` },
    matches: { path: `${path}/matches`, compare: (a, b) => a.nr - b.nr },
    rounds: { path: `${path}/rounds`, compare: (a, b) => a.nr - b.nr },
    tips: { path: `${path}/tips` },
  };
}

export const useCurrentDataStore = create<CurrentData>(
  () => initialCurrentData,
);

let loadedChampionshipId: Championship['id'] | undefined;

const currentData = loadSource(
  (championshipId: Championship['id'] | undefined) =>
    championshipId
      ? loadCollections(bindingsFor(championshipId))
      : Promise.resolve(initialCurrentData),
  (data, championshipId) => {
    loadedChampionshipId = championshipId;
    useCurrentDataStore.setState(data);
  },
);

export const ensureCurrentData = (
  championshipId: Championship['id'] | undefined,
) => currentData.ensure(championshipId);

export const reloadCurrentData = (
  championshipId: Championship['id'] | undefined,
) => currentData.reload(championshipId);

// Eigene Writes für das geladene Turnier direkt in den Store übernehmen.
onCommit((operations) => {
  if (!loadedChampionshipId) return;
  try {
    if (
      applyWrites(
        useCurrentDataStore,
        bindingsFor(loadedChampionshipId),
        operations,
      )
    ) {
      return;
    }
    void reloadCurrentData(loadedChampionshipId).catch(console.error);
  } catch (error) {
    console.error(error);
    void reloadCurrentData(loadedChampionshipId).catch(console.error);
  }
});

// Beim Logout Daten und das gecachte Promise verwerfen.
useSessionStore.subscribe((state, previous) => {
  if (previous.profile && !state.profile) {
    currentData.reset();
    loadedChampionshipId = undefined;
    useCurrentDataStore.setState(initialCurrentData);
  }
});
