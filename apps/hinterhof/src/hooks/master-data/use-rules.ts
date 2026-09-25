import { createEntity, type RuleSet, updateEntity } from 'lib';
import { useMasterDataStore } from '#/state/master-data-store';

type StoredRules = RuleSet & {
  extraQuestionRuleId: RuleSet['extraQuestionsRuleId'];
};

function withLegacyExtraQuestionField(rules: RuleSet): StoredRules {
  return {
    ...rules,
    extraQuestionRuleId: rules.extraQuestionsRuleId,
  };
}

export function useRules() {
  const rules = useMasterDataStore((state) => state.rules);

  const createRules = (rules: RuleSet) =>
    createEntity<StoredRules>('rules', withLegacyExtraQuestionField(rules));

  const updateRules = (rules: RuleSet) =>
    updateEntity('rules', withLegacyExtraQuestionField(rules));

  return { rules, createRules, updateRules };
}
