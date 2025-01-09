import { atom } from 'recoil';

import { collection, Team } from 'lib';

export const teamsState = atom<Team[]>({
  key: 'teamsState',
  effects: [({ setSelf }) => collection<Team>('teams').subscribe(setSelf)],
});
