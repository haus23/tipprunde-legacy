import { atom } from 'jotai';
import { Championship, collection, filter, orderByDesc } from 'lib';

export const championshipsState = atom(() =>
  collection<Championship>(
    'championships',
    filter('published', '==', true),
    orderByDesc('nr')
  ).get()
);
