import * as v from 'valibot';

import type { RuleDefinition } from './rule-definition';

export const tipRuleIds = [
  'drei-oder-ein-punkt-joker-verdoppelt',
  'drei-zwei-oder-ein-punkt-joker-verdoppelt',
] as const;

export const TipRuleIdSchema = v.picklist(tipRuleIds);
export type TipRuleId = v.InferOutput<typeof TipRuleIdSchema>;
export type TipRule = RuleDefinition<TipRuleId>;

export const tipRules = [
  {
    id: 'drei-oder-ein-punkt-joker-verdoppelt',
    name: 'Drei oder ein Punkt - Joker verdoppelt',
    description:
      'Für einen genauen Tipp gibt es drei Punkte, für den richtigen Spielausgang einen Punkt. Ein Joker verdoppelt die Punktzahl.',
  },
  {
    id: 'drei-zwei-oder-ein-punkt-joker-verdoppelt',
    name: 'Drei, zwei oder ein Punkt - Joker verdoppelt',
    description:
      'Für einen genauen Tipp gibt es drei Punkte. Bei einem Unentschieden bringt jedes andere Unentschieden zwei Punkte, bei anderen Spielausgängen gibt es ebenfalls zwei Punkte bei korrekter Tordifferenz. Ansonsten gibt es einen Punkt für den richtigen Spielausgang. Ein Joker verdoppelt die Punktzahl.',
  },
] satisfies TipRule[];
