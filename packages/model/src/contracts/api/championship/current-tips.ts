import * as v from 'valibot';

import { TipSchema } from '#model/championship/tip';
import { ResultSchema } from '#model/primitives';
import { DocumentIdSchema } from '#model/shared/document-id';

export const ChampionshipCurrentTipsSchema = v.array(
  v.object({
    matchId: DocumentIdSchema,
    nr: v.pipe(v.number(), v.integer(), v.minValue(1)),
    hometeam: v.optional(v.string(), ''),
    awayteam: v.optional(v.string(), ''),
    result: v.optional(ResultSchema, ''),
    tips: v.pipe(
      v.record(v.string(), TipSchema),
      v.title('Tipps nach Spieler-ID'),
      v.description(
        'Objekt mit der Spieler-ID als Schlüssel und dem zugehörigen Tipp als Wert.',
      ),
    ),
  }),
);

export type ChampionshipCurrentTipsInput = v.InferInput<
  typeof ChampionshipCurrentTipsSchema
>;
export type ChampionshipCurrentTips = v.InferOutput<
  typeof ChampionshipCurrentTipsSchema
>;
