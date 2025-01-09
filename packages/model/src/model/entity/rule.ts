import * as v from 'valibot';

import { IdSchema } from '../id';

// Firebase collection path: /rules

export const RuleSchema = v.object({
  id: IdSchema,
  name: v.pipe(v.string(), v.nonEmpty()),
  description: v.pipe(v.string(), v.nonEmpty()),
  extraQuestionRuleId: IdSchema,
  matchRuleId: IdSchema,
  roundRuleId: IdSchema,
  tipRuleId: IdSchema,
});

export type RuleInput = v.InferInput<typeof RuleSchema>;
export type Rule = v.InferOutput<typeof RuleSchema>;
