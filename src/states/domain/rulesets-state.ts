import { atom } from 'recoil';

import { collection } from '@/firebase/db/repository/collection';
import { Ruleset } from '@/model/domain/ruleset';

export const rulesetsState = atom<Ruleset[]>({
  key: 'rulesetsState',
  effects: [
    ({ setSelf }) => collection<Ruleset>('rulesets').subscribe(setSelf),
  ],
});
