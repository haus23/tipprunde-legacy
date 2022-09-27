import { atom } from 'jotai';
import { Championship, collection } from 'lib';

export const championshipsState = atom(() =>
  collection<Championship>('championships').get()
);
