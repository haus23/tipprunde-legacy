import * as v from 'valibot';

import { TipSchema } from '../../entity/championship/tip';
import { IdSchema } from '../../id';

export const MatchTipsSchema = v.object({
  matchId: IdSchema,
  tips: v.record(v.string(), TipSchema),
});

export type MatchTipsInput = v.InferInput<typeof MatchTipsSchema>;
export type MatchTips = v.InferOutput<typeof MatchTipsSchema>;
