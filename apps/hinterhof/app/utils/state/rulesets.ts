import type { Ruleset } from '@haus23/tipprunde-model';
import { atom, useAtomValue } from 'jotai';
import { observe } from 'jotai-effect';

import {
  collection,
  createEntity,
  updateEntity,
} from '@/lib/firebase/repository';
import { store } from '../store';

const rulesetsAtom = atom<Ruleset[]>([]);

observe((get, set) => {
  collection<Ruleset>('rules').subscribe((rulesets) => {
    console.log('Subscription: rulesets');
    set(rulesetsAtom, rulesets);
  });
}, store);

export function useRulesets() {
  const createRuleset = (team: Ruleset) => createEntity<Ruleset>('rules', team);
  const updateRuleset = (team: Ruleset) => updateEntity('rules', team);

  return { rulesets: useAtomValue(rulesetsAtom), createRuleset, updateRuleset };
}
