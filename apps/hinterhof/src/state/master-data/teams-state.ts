import { atom } from 'recoil';

import { type Team, collection } from 'lib';

export const teamsState = atom<Team[]>({
  key: 'teamsState',
  effects: [({ setSelf }) => collection<Team>('teams').subscribe(setSelf)],
});
