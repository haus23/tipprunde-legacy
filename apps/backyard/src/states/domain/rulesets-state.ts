import { atom } from 'recoil';
import { ChampionshipRules, collection } from 'lib';

export const rulesetsState = atom<ChampionshipRules[]>({
  key: 'rulesetsState',
  effects: [
    ({ setSelf }) => collection<ChampionshipRules>('rules').subscribe(setSelf),
  ],
});
