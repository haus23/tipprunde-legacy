import * as v from 'valibot';

import { TipSchema } from '#model/championship/tip';
import { DocumentIdSchema } from '#model/shared/document-id';

export const ChampionshipMatchTipsSchema = v.object({
  matchId: DocumentIdSchema,
  tips: v.record(v.string(), TipSchema),
});

export type ChampionshipMatchTipsInput = v.InferInput<
  typeof ChampionshipMatchTipsSchema
>;
export type ChampionshipMatchTips = v.InferOutput<
  typeof ChampionshipMatchTipsSchema
>;
