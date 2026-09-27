import * as v from 'valibot';

import { TipSchema } from '#model/championship/tip';
import { DocumentIdSchema } from '#model/shared/document-id';

export const ChampionshipPlayerTipsSchema = v.object({
  playerId: DocumentIdSchema,
  tips: v.record(v.string(), TipSchema),
});

export type ChampionshipPlayerTipsInput = v.InferInput<
  typeof ChampionshipPlayerTipsSchema
>;
export type ChampionshipPlayerTips = v.InferOutput<
  typeof ChampionshipPlayerTipsSchema
>;
