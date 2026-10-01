import type {
  Championship,
  League,
  Member,
  RuleSet,
  Team,
} from '@haus23/tipprunde-model';
import { collection, orderByDesc } from 'lib';
import { create } from 'zustand';

import { liveSource, syncFields } from './live-source';
import { useSessionStore } from './session-store';

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

export const useMasterDataStore = create<MasterData>(() => initialMasterData);

const masterData = liveSource<void>((_, ready, fail) => {
  const sync = syncFields(
    useMasterDataStore,
    ['championships', 'leagues', 'players', 'rules', 'teams'],
    ready,
  );

  const stops = [
    collection<Championship>('championships', orderByDesc('nr')).subscribe(
      sync('championships'),
      fail,
    ),
    collection<League>('leagues').subscribe(sync('leagues'), fail),
    collection<Member>('players').subscribe(sync('players'), fail),
    collection<RuleSet>('rules').subscribe(sync('rules'), fail),
    collection<Team>('teams').subscribe(sync('teams'), fail),
  ];

  return () => {
    for (const stop of stops) stop();
  };
});

/** Stabiles Promise für `use()`: erfüllt, sobald alle Stammdaten geladen sind. */
export const ensureMasterData = () => masterData.ensure(undefined);

// Beim Logout Listener beenden und Daten verwerfen.
useSessionStore.subscribe((state, prev) => {
  if (prev.profile && !state.profile) {
    masterData.stop();
    useMasterDataStore.setState(initialMasterData);
  }
});
