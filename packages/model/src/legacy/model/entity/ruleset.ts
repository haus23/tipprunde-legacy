import * as v from 'valibot';

import { ExtraQuestionsIdSchema } from '../../rules/extra-questions';
import { MatchRuleIdSchema } from '../../rules/match';
import { RoundRuleIdSchema } from '../../rules/round';
import { TipRuleIdSchema } from '../../rules/tip';
import { IdSchema } from '../id';

// Firebase collection path: /rules

export const RulesetSchema = v.object({
  id: IdSchema,
  name: v.pipe(v.string(), v.nonEmpty()),
  description: v.pipe(v.string(), v.nonEmpty()),
  extraQuestionsRuleId: ExtraQuestionsIdSchema,
  matchRuleId: MatchRuleIdSchema,
  roundRuleId: RoundRuleIdSchema,
  tipRuleId: TipRuleIdSchema,
});

export type RulesetInput = v.InferInput<typeof RulesetSchema>;
export type Ruleset = v.InferOutput<typeof RulesetSchema>;
