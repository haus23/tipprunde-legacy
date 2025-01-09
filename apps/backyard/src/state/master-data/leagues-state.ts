import { atom } from 'recoil';

import { collection, League } from 'lib';

export const leaguesState = atom<League[]>({
  key: 'leaguesState',
  effects: [({ setSelf }) => collection<League>('leagues').subscribe(setSelf)],
});
