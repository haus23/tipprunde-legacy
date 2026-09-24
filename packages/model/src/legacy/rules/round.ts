import * as v from 'valibot';
import type { Rules } from './base-schema';

export const roundRuleNames = [
  'keine-besonderheiten',
  'alles-verdoppelt',
] as const;

export const roundRules = {
  'keine-besonderheiten': {
    name: 'Keine Besonderheiten',
    description: 'Es gibt keine Sonderregeln für einzelne Spiele.',
  },
  'alles-verdoppelt': {
    name: 'Alles verdoppelt',
    description: `
      Einzelne Runden können als Doppelrunde markiert werden. Jeder Tipp in dieser Runde bekommt
      die doppelte Punktzahl. Also zwei, vier oder sechs Punkte. Unabhängig davon können Joker
      gesetzt werden (falls erlaubt), die dann nocheinmal beim Treffer verdoppeln. Es sind also
      maximal 12 Punkte möglich pro Tipp möglich.
    `.trim(),
  },
} satisfies Rules<RoundRuleId>;

export const RoundRuleIdSchema = v.picklist(roundRuleNames);
export type RoundRuleId = v.InferOutput<typeof RoundRuleIdSchema>;
