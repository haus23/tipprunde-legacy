import { z } from 'zod';

// Firebase collection path: /rules

export const Rule = z.object({
  id: z.string(),
  name: z.string({ required_error: 'Rule name is required' }),
  description: z.string({ required_error: 'Rule description is required' }),
  extraQuestionRuleId: z.string(),
  matchRuleId: z.string(),
  roundRuleId: z.string(),
  tipRuleId: z.string(),
});

export type Rule = z.infer<typeof Rule>;
