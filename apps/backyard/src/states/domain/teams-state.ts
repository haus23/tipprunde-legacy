import { atom } from 'recoil';

import { collection } from '@/firebase/db/repository/collection';
import { Team } from '@/model/domain/team';

export const teamsState = atom<Team[]>({
  key: 'teamsState',
  effects: [({ setSelf }) => collection<Team>('teams').subscribe(setSelf)],
});
