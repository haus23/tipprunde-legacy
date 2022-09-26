import { atom } from 'recoil';

import { collection } from '@/firebase/db/repository/collection';
import { League } from '@/model/domain/league';

export const leaguesState = atom<League[]>({
  key: 'leaguesState',
  effects: [({ setSelf }) => collection<League>('leagues').subscribe(setSelf)],
});
