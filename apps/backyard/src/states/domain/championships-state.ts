import { atom } from 'recoil';
import { Championship, collection } from 'lib';

export const championshipsState = atom<Championship[]>({
  key: 'championshipsState',
  effects: [
    ({ setSelf }) =>
      collection<Championship>('championships').subscribe(setSelf),
  ],
});
