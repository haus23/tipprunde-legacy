import * as v from 'valibot';

import { TipSchema } from '#model/championship/tip';
import { DocumentIdSchema } from '#model/shared/document-id';

export const ChampionshipMatchTipsSchema = v.object({
  matchId: DocumentIdSchema,
  tips: v.pipe(
    v.record(v.string(), TipSchema),
    v.title('Tipps nach Spieler-ID'),
    v.description(
      'Objekt mit der Spieler-ID als Schlüssel und dem zugehörigen Tipp als Wert.',
    ),
  ),
});

export type ChampionshipMatchTipsInput = v.InferInput<
  typeof ChampionshipMatchTipsSchema
>;
export type ChampionshipMatchTips = v.InferOutput<
  typeof ChampionshipMatchTipsSchema
>;
