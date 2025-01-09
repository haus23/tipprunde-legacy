import * as v from 'valibot';
import type { Rules } from './base-schema';

export const matchRuleNames = [
  'keine-besonderheiten',
  'alleiniger-treffer-drei-punkte',
] as const;

export const matchRules = {
  'keine-besonderheiten': {
    name: 'Keine Besonderheiten',
    description: 'Es gibt keine Sonderregeln für einzelne Spiele.',
  },
  'alleiniger-treffer-drei-punkte': {
    name: 'Alleiniger Treffer gibt drei Punkte',
    description:
      'Falls ein Spieler als einziger für ein Spiel Punkte erhält, bekommt er drei zusätzliche Punkte.',
  },
} satisfies Rules<MatchRuleId>;

export const MatchRuleIdSchema = v.picklist(matchRuleNames);
export type MatchRuleId = v.InferOutput<typeof MatchRuleIdSchema>;
