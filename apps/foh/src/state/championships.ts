import { atom } from 'recoil';
import { Championship, collection } from 'lib';

export const championshipsState = atom({
  key: 'championshipsState',
  default: collection<Championship>('championships').getAll(),
});
