import * as v from 'valibot';

import { DocumentIdSchema } from '../shared/document-id';
import { SlugIdSchema } from '../shared/id';

export const ChampionshipPlayerSchema = v.object({
  id: DocumentIdSchema,
  playerId: SlugIdSchema,
  nr: v.pipe(v.number(), v.integer(), v.minValue(1)),
  rank: v.pipe(
    v.optional(v.pipe(v.number(), v.integer(), v.minValue(1))),
    v.description(
      'Aktueller Rang des Teilnehmers. Fehlt, solange noch kein Spiel ausgewertet wurde.',
    ),
  ),
  points: v.pipe(
    v.optional(v.number()),
    v.description(
      'Summe der für alle Tipps berechneten Punkte ohne Zusatzpunkte. Fehlt, solange noch kein Spiel ausgewertet wurde.',
    ),
  ),
  extraPoints: v.pipe(
    v.optional(v.number()),
    v.description('Punkte aus den Zusatzfragen des Turniers.'),
  ),
  totalPoints: v.pipe(
    v.optional(v.number()),
    v.description(
      'Für das Ranking verwendete Gesamtpunktzahl. Sie enthält die Zusatzpunkte nur, wenn diese veröffentlicht sind, und fehlt vor der ersten Spielauswertung.',
    ),
  ),
});

export type ChampionshipPlayerInput = v.InferInput<
  typeof ChampionshipPlayerSchema
>;
export type ChampionshipPlayer = v.InferOutput<typeof ChampionshipPlayerSchema>;
