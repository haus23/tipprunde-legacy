import * as v from 'valibot';

import { TipSchema } from '../../entity/championship/tip';
import { IdSchema } from '../../id';

export const PlayerTipsSchema = v.object({
  playerId: IdSchema,
  tips: v.record(v.string(), TipSchema),
});

export type PlayerTipsInput = v.InferInput<typeof PlayerTipsSchema>;
export type PlayerTips = v.InferOutput<typeof PlayerTipsSchema>;
