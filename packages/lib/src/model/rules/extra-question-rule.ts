import type { Rule } from './rule';

export type ExtraQuestionRuleId = 'keine-zusatzfragen' | 'mit-zusatzfragen';

export type ExtraQuestionRule = Rule & {
  id: ExtraQuestionRuleId;
};

export const extraQuestionRuleDescriptions: ExtraQuestionRule[] = [
  { id: 'keine-zusatzfragen', name: 'Keine Zusatzfragen' },
  { id: 'mit-zusatzfragen', name: 'Mit Zusatzfragen' },
];
