import { atom } from 'recoil';
import { collection, Player } from 'lib';

export const playersState = atom<Player[]>({
  key: 'playersState',
  effects: [({ setSelf }) => collection<Player>('players').subscribe(setSelf)],
});
