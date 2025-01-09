import { atom } from 'recoil';

import { type League, collection } from 'lib';

export const leaguesState = atom<League[]>({
  key: 'leaguesState',
  effects: [({ setSelf }) => collection<League>('leagues').subscribe(setSelf)],
});
