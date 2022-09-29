import { atom } from 'recoil';
import { ChampionshipRules, collection } from 'lib';

export const rulesState = atom<ChampionshipRules[]>({
  key: 'rulesState',
  effects: [
    ({ setSelf }) => collection<ChampionshipRules>('rules').subscribe(setSelf),
  ],
});
