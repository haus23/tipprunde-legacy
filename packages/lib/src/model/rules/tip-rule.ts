import { Rule } from './rule';

export type TipRuleId =
  | 'drei-oder-ein-punkt-joker-verdoppelt'
  | 'drei-zwei-oder-ein-punkt-joker-verdoppelt';

export interface TipRule extends Rule {
  id: TipRuleId;
}

export const tipRuleDescriptions: TipRule[] = [
  {
    id: 'drei-oder-ein-punkt-joker-verdoppelt',
    name: 'Drei oder ein Punkt - Joker verdoppelt',
    description: `
    Für einen genauen Tipp gibt es drei Punkte, für den richtigen Spielausgang einen Punkt.
    Ein Joker verdoppelt die Punktzahl.
  `,
  },
  {
    id: 'drei-zwei-oder-ein-punkt-joker-verdoppelt',
    name: 'Drei, zwei oder ein Punkt - Joker verdoppelt',
    description: `
    Für einen genauen Tipp gibt es drei Punkte. Bei einem Unentschieden bringt jedes andere
    Unentschieden zwei Punkte, bei anderen Spielausgängen gibt es ebenfalls zwei Punkte bei korrekter
    Tordifferenz. Ansonsten einen Punkt für den richtigen Spielausgang. Ein Joker verdoppelt
    die Punktzahl.
  `,
  },
];
