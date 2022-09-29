import { Rule } from './rule';

export type ExtraQuestionRuleId = 'keine-zusatzfragen' | 'mit-zusatzfragen';

export interface ExtraQuestionRule extends Rule {
  id: ExtraQuestionRuleId;
}

export const extraQuestionRuleDescriptions: ExtraQuestionRule[] = [
  { id: 'keine-zusatzfragen', name: 'Keine Zusatzfragen' },
  { id: 'mit-zusatzfragen', name: 'Mit Zusatzfragen' },
];
