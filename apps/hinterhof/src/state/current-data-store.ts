import {
  type Championship,
  type ChampionshipPlayer,
  collection,
  type Match,
  orderByAsc,
  type Round,
  type Tip,
} from 'lib';
import { create } from 'zustand';

type CurrentDataState = {
  championshipId: Championship['id'] | undefined;
  championshipPlayers: ChampionshipPlayer[];
  championshipPlayersLoaded: boolean;
  matches: Match[];
  matchesLoaded: boolean;
  rounds: Round[];
  roundsLoaded: boolean;
  tips: Tip[];
  tipsLoaded: boolean;
};

const initialCurrentDataState: CurrentDataState = {
  championshipId: undefined,
  championshipPlayers: [],
  championshipPlayersLoaded: false,
  matches: [],
  matchesLoaded: false,
  rounds: [],
  roundsLoaded: false,
  tips: [],
  tipsLoaded: false,
};

export const useCurrentDataStore = create<CurrentDataState>(
  () => initialCurrentDataState,
);

export function subscribeToCurrentData(
  championshipId: Championship['id'] | undefined,
) {
  if (!championshipId) {
    useCurrentDataStore.setState(initialCurrentDataState);
    return () => undefined;
  }

  useCurrentDataStore.setState({
    ...initialCurrentDataState,
    championshipId,
  });

  const path = `championships/${championshipId}`;
  const unsubscribe = [
    collection<ChampionshipPlayer>(`${path}/players`).subscribe(
      (championshipPlayers) =>
        useCurrentDataStore.setState({
          championshipPlayers,
          championshipPlayersLoaded: true,
        }),
    ),
    collection<Match>(`${path}/matches`, orderByAsc('nr')).subscribe(
      (matches) =>
        useCurrentDataStore.setState({ matches, matchesLoaded: true }),
    ),
    collection<Round>(`${path}/rounds`, orderByAsc('nr')).subscribe((rounds) =>
      useCurrentDataStore.setState({ rounds, roundsLoaded: true }),
    ),
    collection<Tip>(`${path}/tips`).subscribe((tips) =>
      useCurrentDataStore.setState({ tips, tipsLoaded: true }),
    ),
  ];

  return () => {
    for (const stop of unsubscribe) stop();
    useCurrentDataStore.setState(initialCurrentDataState);
  };
}
