import * as v from 'valibot';

import type { RuleDefinition } from './rule-definition';

export const roundRuleIds = [
  'keine-besonderheiten',
  'alles-verdoppelt',
] as const;

export const RoundRuleIdSchema = v.picklist(roundRuleIds);
export type RoundRuleId = v.InferOutput<typeof RoundRuleIdSchema>;
export type RoundRule = RuleDefinition<RoundRuleId>;

export const roundRules = [
  {
    id: 'keine-besonderheiten',
    name: 'Keine Besonderheiten',
    description: 'Für einzelne Runden gelten keine zusätzlichen Regeln.',
  },
  {
    id: 'alles-verdoppelt',
    name: 'Alles verdoppelt',
    description:
      'Markierte Runden verdoppeln die für einen Tipp berechnete Punktzahl. Ein Joker kann die Punktzahl zusätzlich verdoppeln.',
  },
] satisfies RoundRule[];
