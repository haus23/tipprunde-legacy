import * as v from 'valibot';

import { ResultSchema } from '../../../primitives';
import { TipSchema } from '../../entity/championship/tip';
import { IdSchema } from '../../id';

export const CurrentTipsSchema = v.array(
  v.object({
    matchId: IdSchema,
    hometeam: v.optional(v.string(), ''),
    awayteam: v.optional(v.string(), ''),
    result: v.optional(ResultSchema, ''),
    tips: v.record(v.string(), TipSchema),
  }),
);

export type CurrentTipsInput = v.InferInput<typeof CurrentTipsSchema>;
export type CurrentTips = v.InferOutput<typeof CurrentTipsSchema>;
