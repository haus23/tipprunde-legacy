import * as v from 'valibot';

import { TipSchema } from '../../../../championship/tip';
import { ResultSchema } from '../../../../primitives';
import { IdSchema } from '../../id';

export const CurrentTipsSchema = v.array(
  v.object({
    matchId: IdSchema,
    nr: v.pipe(v.number(), v.integer(), v.minValue(1)),
    hometeam: v.optional(v.string(), ''),
    awayteam: v.optional(v.string(), ''),
    result: v.optional(ResultSchema, ''),
    tips: v.record(v.string(), TipSchema),
  }),
);

export type CurrentTipsInput = v.InferInput<typeof CurrentTipsSchema>;
export type CurrentTips = v.InferOutput<typeof CurrentTipsSchema>;
