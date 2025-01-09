import { atom } from 'recoil';
import { Championship, collection, orderByDesc } from 'lib';

export const championshipsState = atom<Championship[]>({
  key: 'championshipsState',
  effects: [
    ({ setSelf }) =>
      collection<Championship>('championships', orderByDesc('nr')).subscribe(
        setSelf
      ),
  ],
});
