import { useRecoilValue } from 'recoil';
import { createEntity } from '@/firebase/db/repository/create-entity';
import { update } from '@/firebase/db/repository/update-entity';
import { Ruleset } from '@/model/domain/ruleset';
import { rulesetsState } from '@/states/domain/rulesets-state';

export function useRulesets() {
  const rulesets = useRecoilValue(rulesetsState);

  const createRuleset = (ruleset: Ruleset) =>
    createEntity<Ruleset>('rulesets', ruleset);

  const updateRuleset = (ruleset: Ruleset) => update('rulesets', ruleset);

  return { rulesets, createRuleset, updateRuleset };
}
