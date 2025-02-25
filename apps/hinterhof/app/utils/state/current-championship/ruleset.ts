import { invariant } from '@/utils/invariant';
import type { Ruleset } from '@haus23/tipprunde-model';
import { atom, useAtomValue } from 'jotai';
import { rulesetsAtom } from '../rulesets';
import { currentChampionshipAtom } from './championship';

export const rulesetAtom = atom<Ruleset>((get) => {
  const championship = get(currentChampionshipAtom);
  const rulesets = get(rulesetsAtom);
  const ruleset = rulesets.find((r) => championship.rulesId === r.id);
  invariant(ruleset);
  return ruleset;
});

export function useRuleset() {
  return useAtomValue(rulesetAtom);
}
