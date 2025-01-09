import * as v from 'valibot';
import type { Rules } from './base-schema';

export const extraQuestionRuleNames = [
  'keine-zusatzfragen',
  'mit-zusatzfragen',
] as const;

export const extraQuestionsRules = {
  'keine-zusatzfragen': { name: 'Keine Zusatzfragen' },
  'mit-zusatzfragen': { name: 'Mit Zusatzfragen' },
} satisfies Rules<ExtraQuestionsRuleId>;

export const ExtraQuestionsIdSchema = v.picklist(extraQuestionRuleNames);
export type ExtraQuestionsRuleId = v.InferOutput<typeof ExtraQuestionsIdSchema>;
