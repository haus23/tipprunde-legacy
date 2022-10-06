import { atomFamily } from 'recoil';
import { Championship, ChampionshipPlayer, collection } from 'lib';

export const championshipPlayersState = atomFamily<
  ChampionshipPlayer[],
  Championship['id'] | undefined
>({
  key: 'championshipPlayersState',
  effects: (championshipId) => [
    ({ setSelf }) =>
      collection<ChampionshipPlayer>(
        `championships/${championshipId}/players`
      ).subscribe(setSelf),
  ],
});
