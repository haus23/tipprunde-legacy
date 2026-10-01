import type {
  Championship,
  League,
  Member,
  RuleSet,
  Team,
} from '@haus23/tipprunde-model';
import { create } from 'zustand';

import { onCommit } from '#/firebase/write';
import {
  applyWrites,
  type Bindings,
  loadCollections,
} from './collection-bindings';
import { loadSource } from './load-source';

type MasterData = {
  championships: Championship[];
  leagues: League[];
  players: Member[];
  rules: RuleSet[];
  teams: Team[];
};

const initialMasterData: MasterData = {
  championships: [],
  leagues: [],
  players: [],
  rules: [],
  teams: [],
};

const bindings: Bindings<MasterData> = {
  championships: { path: 'championships', compare: (a, b) => b.nr - a.nr },
  leagues: { path: 'leagues' },
  players: { path: 'players' },
  rules: { path: 'rules' },
  teams: { path: 'teams' },
};

export const useMasterDataStore = create<MasterData>(() => initialMasterData);

const masterData = loadSource(
  () => loadCollections(bindings),
  (data) => useMasterDataStore.setState(data),
);

/** Stabiles Promise für `use()`: erfüllt, sobald alle Stammdaten geladen sind. */
export const ensureMasterData = () => masterData.ensure(undefined);

export const reloadMasterData = () => masterData.reload(undefined);

export function resetMasterData() {
  masterData.reset();
  useMasterDataStore.setState(initialMasterData);
}

// Eigene Writes direkt in den Store übernehmen.
onCommit((operations) => {
  try {
    if (applyWrites(useMasterDataStore, bindings, operations)) return;
    void reloadMasterData().catch(console.error);
  } catch (error) {
    console.error(error);
    void reloadMasterData().catch(console.error);
  }
});
