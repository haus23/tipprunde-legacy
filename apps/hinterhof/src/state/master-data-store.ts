import {
  type Championship,
  type ChampionshipRules,
  collection,
  type League,
  orderByDesc,
  type Player,
  type Team,
} from 'lib';
import { create } from 'zustand';

type MasterDataState = {
  championships: Championship[];
  championshipsLoaded: boolean;
  leagues: League[];
  leaguesLoaded: boolean;
  players: Player[];
  playersLoaded: boolean;
  rules: ChampionshipRules[];
  rulesLoaded: boolean;
  teams: Team[];
  teamsLoaded: boolean;
};

const initialMasterDataState: MasterDataState = {
  championships: [],
  championshipsLoaded: false,
  leagues: [],
  leaguesLoaded: false,
  players: [],
  playersLoaded: false,
  rules: [],
  rulesLoaded: false,
  teams: [],
  teamsLoaded: false,
};

export const useMasterDataStore = create<MasterDataState>(
  () => initialMasterDataState,
);

export function subscribeToMasterData() {
  const unsubscribe = [
    collection<Championship>('championships', orderByDesc('nr')).subscribe(
      (championships) =>
        useMasterDataStore.setState({
          championships,
          championshipsLoaded: true,
        }),
    ),
    collection<League>('leagues').subscribe((leagues) =>
      useMasterDataStore.setState({ leagues, leaguesLoaded: true }),
    ),
    collection<Player>('players').subscribe((players) =>
      useMasterDataStore.setState({ players, playersLoaded: true }),
    ),
    collection<ChampionshipRules>('rules').subscribe((rules) =>
      useMasterDataStore.setState({ rules, rulesLoaded: true }),
    ),
    collection<Team>('teams').subscribe((teams) =>
      useMasterDataStore.setState({ teams, teamsLoaded: true }),
    ),
  ];

  return () => {
    for (const stop of unsubscribe) stop();
    useMasterDataStore.setState(initialMasterDataState);
  };
}
