import { Rule } from './rule';

export type MatchRuleId =
  | 'keine-besonderheiten'
  | 'alleiniger-treffer-drei-punkte';

export interface MatchRule extends Rule {
  id: MatchRuleId;
}

export const matchRuleDescriptions: MatchRule[] = [
  {
    id: 'keine-besonderheiten',
    name: 'Keine Besonderheiten',
    description: `
    Es gibt keine Sonderregeln für einzelne Spiele.
  `,
  },
  {
    id: 'alleiniger-treffer-drei-punkte',
    name: 'Alleiniger Treffer gibt drei Punkte',
    description: `
    Falls ein Spieler als einziger für ein Spiel Punkte erhält, bekommt er drei zusätzliche Punkte.
  `,
  },
];
