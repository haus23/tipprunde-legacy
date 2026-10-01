import type {
  Championship,
  ChampionshipPlayer,
  Match,
  Round,
  Tip,
} from '@haus23/tipprunde-model';
import { collection, orderByAsc } from 'lib';
import { create } from 'zustand';

import { liveSource, syncFields } from './live-source';
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

export const useCurrentDataStore = create<CurrentData>(
  () => initialCurrentData,
);

const currentData = liveSource<Championship['id'] | undefined>(
  (championshipId, ready, fail) => {
    if (!championshipId) {
      useCurrentDataStore.setState(initialCurrentData);
      ready();
      return () => undefined;
    }

    const sync = syncFields(
      useCurrentDataStore,
      ['championshipPlayers', 'matches', 'rounds', 'tips'],
      ready,
    );

    const path = `championships/${championshipId}`;
    const stops = [
      collection<ChampionshipPlayer>(`${path}/players`).subscribe(
        sync('championshipPlayers'),
        fail,
      ),
      collection<Match>(`${path}/matches`, orderByAsc('nr')).subscribe(
        sync('matches'),
        fail,
      ),
      collection<Round>(`${path}/rounds`, orderByAsc('nr')).subscribe(
        sync('rounds'),
        fail,
      ),
      collection<Tip>(`${path}/tips`).subscribe(sync('tips'), fail),
    ];

    return () => {
      for (const stop of stops) stop();
    };
  },
);

/** Stabiles Promise für `use()`: erfüllt, sobald die Turnierdaten geladen sind. */
export const ensureCurrentData = (
  championshipId: Championship['id'] | undefined,
) => currentData.ensure(championshipId);

// Beim Logout Listener beenden und Daten verwerfen.
useSessionStore.subscribe((state, prev) => {
  if (prev.profile && !state.profile) {
    currentData.stop();
    useCurrentDataStore.setState(initialCurrentData);
  }
});
