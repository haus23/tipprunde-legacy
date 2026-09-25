import * as v from 'valibot';

import type { RuleDefinition } from './rule-definition';

export const matchRuleIds = [
  'keine-besonderheiten',
  'alleiniger-treffer-drei-punkte',
] as const;

export const MatchRuleIdSchema = v.picklist(matchRuleIds);
export type MatchRuleId = v.InferOutput<typeof MatchRuleIdSchema>;
export type MatchRule = RuleDefinition<MatchRuleId>;

export const matchRules = [
  {
    id: 'keine-besonderheiten',
    name: 'Keine Besonderheiten',
    description: 'Für einzelne Spiele gelten keine zusätzlichen Regeln.',
  },
  {
    id: 'alleiniger-treffer-drei-punkte',
    name: 'Alleiniger Treffer gibt drei Punkte',
    description:
      'Falls ein Spieler als einziger für ein Spiel Punkte erhält, bekommt er drei zusätzliche Punkte.',
  },
] satisfies MatchRule[];
