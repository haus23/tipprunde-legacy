import * as v from 'valibot';
import { expect, it } from 'vitest';

import { extraQuestionRules } from '../../src/rules/extra-question';
import { MatchRuleIdSchema, matchRules } from '../../src/rules/match';
import { roundRules } from '../../src/rules/round';
import { RuleSetSchema } from '../../src/rules/rule-set';
import { tipRules } from '../../src/rules/tip';

it('provides complete rule definitions', () => {
  for (const rule of [
    ...tipRules,
    ...matchRules,
    ...roundRules,
    ...extraQuestionRules,
  ]) {
    expect(rule.id).not.toBe('');
    expect(rule.name).not.toBe('');
    expect(rule.description).not.toBe('');
  }
});

it('validates category-specific rule IDs', () => {
  expect(v.safeParse(MatchRuleIdSchema, 'keine-besonderheiten').success).toBe(
    true,
  );
  expect(v.safeParse(MatchRuleIdSchema, 'alles-verdoppelt').success).toBe(
    false,
  );
});

it('validates a stored rule set with the canonical plural field', () => {
  const ruleSet = {
    id: 'alles-auf-anfang',
    name: 'Alles auf Anfang',
    description: 'Ein einfaches Regelwerk.',
    extraQuestionsRuleId: 'keine-zusatzfragen',
    matchRuleId: 'keine-besonderheiten',
    roundRuleId: 'keine-besonderheiten',
    tipRuleId: 'drei-oder-ein-punkt-joker-verdoppelt',
  };

  expect(v.safeParse(RuleSetSchema, ruleSet).success).toBe(true);
  expect(
    v.safeParse(RuleSetSchema, {
      ...ruleSet,
      extraQuestionsRuleId: undefined,
      extraQuestionRuleId: 'keine-zusatzfragen',
    }).success,
  ).toBe(false);
});
