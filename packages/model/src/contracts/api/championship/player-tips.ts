import * as v from 'valibot';

import { TipSchema } from '#model/championship/tip';
import { DocumentIdSchema } from '#model/shared/document-id';

export const ChampionshipPlayerTipsSchema = v.object({
  playerId: DocumentIdSchema,
  tips: v.pipe(
    v.record(v.string(), TipSchema),
    v.title('Tipps nach Spiel-ID'),
    v.description(
      'Objekt mit der Spiel-ID als Schlüssel und dem zugehörigen Tipp als Wert.',
    ),
  ),
});

export type ChampionshipPlayerTipsInput = v.InferInput<
  typeof ChampionshipPlayerTipsSchema
>;
export type ChampionshipPlayerTips = v.InferOutput<
  typeof ChampionshipPlayerTipsSchema
>;
