import type { RuleSet } from '@haus23/tipprunde-model';
import { createEntity, updateEntity } from '#/firebase/write';
import { useMasterDataStore } from '#/state/master-data-store';

export function useRules() {
  const rules = useMasterDataStore((state) => state.rules);

  const createRules = (rules: RuleSet) => createEntity<RuleSet>('rules', rules);

  const updateRules = (rules: RuleSet) => updateEntity('rules', rules);

  return { rules, createRules, updateRules };
}
