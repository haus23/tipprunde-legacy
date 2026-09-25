import * as v from 'valibot';

import type { RuleDefinition } from './rule-definition';

export const extraQuestionRuleIds = [
  'keine-zusatzfragen',
  'mit-zusatzfragen',
] as const;

export const ExtraQuestionRuleIdSchema = v.picklist(extraQuestionRuleIds);
export type ExtraQuestionRuleId = v.InferOutput<
  typeof ExtraQuestionRuleIdSchema
>;
export type ExtraQuestionRule = RuleDefinition<ExtraQuestionRuleId>;

export const extraQuestionRules = [
  {
    id: 'keine-zusatzfragen',
    name: 'Keine Zusatzfragen',
    description: 'Das Regelwerk enthält keine Zusatzfragen.',
  },
  {
    id: 'mit-zusatzfragen',
    name: 'Mit Zusatzfragen',
    description: 'Das Regelwerk enthält zusätzliche Turnierfragen.',
  },
] satisfies ExtraQuestionRule[];
