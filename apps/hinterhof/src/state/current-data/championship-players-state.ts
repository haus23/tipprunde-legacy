import { type Championship, type ChampionshipPlayer, collection } from 'lib';
import { atomFamily } from 'recoil';

export const championshipPlayersState = atomFamily<
  ChampionshipPlayer[],
  Championship['id'] | undefined
>({
  key: 'championshipPlayersState',
  effects: (championshipId) => [
    ({ setSelf }) =>
      championshipId
        ? collection<ChampionshipPlayer>(
            `championships/${championshipId}/players`,
          ).subscribe(setSelf)
        : setSelf([]),
  ],
});
