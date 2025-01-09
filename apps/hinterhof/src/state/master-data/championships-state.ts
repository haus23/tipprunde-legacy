import { type Championship, collection, orderByDesc } from 'lib';
import { atom } from 'recoil';

export const championshipsState = atom<Championship[]>({
  key: 'championshipsState',
  effects: [
    ({ setSelf }) =>
      collection<Championship>('championships', orderByDesc('nr')).subscribe(
        setSelf,
      ),
  ],
});
