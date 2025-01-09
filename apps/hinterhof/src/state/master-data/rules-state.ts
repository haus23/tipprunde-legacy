import { type ChampionshipRules, collection } from 'lib';
import { atom } from 'recoil';

export const rulesState = atom<ChampionshipRules[]>({
  key: 'rulesState',
  effects: [
    ({ setSelf }) => collection<ChampionshipRules>('rules').subscribe(setSelf),
  ],
});
