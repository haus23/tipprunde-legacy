import * as v from 'valibot';

import { TipSchema } from '#/championship/tip';
import { ResultSchema } from '#/primitives';
import { DocumentIdSchema } from '#/shared/document-id';

export const ChampionshipCurrentTipsSchema = v.array(
  v.object({
    matchId: DocumentIdSchema,
    nr: v.pipe(v.number(), v.integer(), v.minValue(1)),
    hometeam: v.optional(v.string(), ''),
    awayteam: v.optional(v.string(), ''),
    result: v.optional(ResultSchema, ''),
    tips: v.record(v.string(), TipSchema),
  }),
);

export type ChampionshipCurrentTipsInput = v.InferInput<
  typeof ChampionshipCurrentTipsSchema
>;
export type ChampionshipCurrentTips = v.InferOutput<
  typeof ChampionshipCurrentTipsSchema
>;
