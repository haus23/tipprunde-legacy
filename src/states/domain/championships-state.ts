import { atom } from 'recoil';

import { collection } from '@/firebase/db/repository/collection';
import { Championship } from '@/model/domain/championship';

export const championshipsState = atom<Championship[]>({
  key: 'championshipsState',
  effects: [
    ({ setSelf }) =>
      collection<Championship>('championships').subscribe(setSelf),
  ],
});
