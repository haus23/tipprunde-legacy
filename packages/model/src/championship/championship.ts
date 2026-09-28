import * as v from 'valibot';

import { SlugIdSchema } from '../shared/id';
import { ChampionshipIdSchema } from './championship-id';

export const ChampionshipSchema = v.object({
  id: ChampionshipIdSchema,
  name: v.pipe(v.string(), v.nonEmpty()),
  nr: v.pipe(v.number(), v.integer(), v.minValue(1)),
  rulesId: SlugIdSchema,
  published: v.pipe(
    v.boolean(),
    v.description(
      'Gibt das Turnier für die öffentliche Anzeige frei. In Antworten der öffentlichen Unterbau-API ist dieser Wert immer true, da unveröffentlichte Turniere nicht ausgeliefert werden.',
    ),
  ),
  extraPointsPublished: v.pipe(
    v.boolean(),
    v.description(
      'Steuert, ob Zusatzpunkte öffentlich sichtbar sind und in die Gesamtpunktzahl sowie das Ranking einfließen.',
    ),
  ),
  completed: v.pipe(
    v.boolean(),
    v.description(
      'Kennzeichnet das Turnier als abgeschlossen. Für abgeschlossene Turniere werden keine aktuellen Tipps mehr ausgegeben.',
    ),
  ),
});

export type ChampionshipInput = v.InferInput<typeof ChampionshipSchema>;
export type Championship = v.InferOutput<typeof ChampionshipSchema>;
