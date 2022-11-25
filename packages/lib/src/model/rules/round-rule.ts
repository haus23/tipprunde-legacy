import { Rule } from './rule';

export type RoundRuleId = 'keine-besonderheiten' | 'alles-verdoppelt';

export type RoundRule = Rule & {
  id: RoundRuleId;
};

export const roundRuleDescriptions: RoundRule[] = [
  {
    id: 'keine-besonderheiten',
    name: 'Keine Besonderheiten',
    description: `
    Es gibt keine Sonderregeln zum Abschluss einer Runde.
  `,
  },
  {
    id: 'alles-verdoppelt',
    name: 'Alles verdoppelt',
    description: `Jeder Tipp in dieser Runde bekommt die doppelte Punktzahl. Also zwei, vier oder sechs Punkte.
    Unabhängig davon können Joker gesetzt werden (falls erlaubt), die dann nocheinmal beim Treffer verdoppeln.
    Es sind also maximal 15 Punkte möglich, falls der richtige Tipp sogar der einzige richtige war.
    `,
  },
];
