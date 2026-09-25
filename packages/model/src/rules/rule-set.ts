import * as v from 'valibot';

import { SlugIdSchema } from '../shared/id';
import { ExtraQuestionRuleIdSchema } from './extra-question';
import { MatchRuleIdSchema } from './match';
import { RoundRuleIdSchema } from './round';
import { TipRuleIdSchema } from './tip';

// Firebase collection path: /rules

export const RuleSetSchema = v.object({
  id: SlugIdSchema,
  name: v.pipe(v.string(), v.nonEmpty()),
  description: v.pipe(v.string(), v.nonEmpty()),
  extraQuestionsRuleId: ExtraQuestionRuleIdSchema,
  matchRuleId: MatchRuleIdSchema,
  roundRuleId: RoundRuleIdSchema,
  tipRuleId: TipRuleIdSchema,
});

export type RuleSetInput = v.InferInput<typeof RuleSetSchema>;
export type RuleSet = v.InferOutput<typeof RuleSetSchema>;
