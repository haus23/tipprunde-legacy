import * as v from 'valibot';

export const RuleInfoSchema = v.object({
  name: v.pipe(v.string(), v.nonEmpty()),
  description: v.optional(v.string(), ''),
});

export type RuleInfoInput = v.InferInput<typeof RuleInfoSchema>;
export type RuleInfo = v.InferOutput<typeof RuleInfoSchema>;

export type Rules<Names extends string> = {
  [key in Names]: RuleInfoInput;
};
