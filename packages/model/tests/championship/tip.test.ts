import * as v from 'valibot';
import { expect, it } from 'vitest';

import { TipSchema } from '../../src/championship/tip';

const tip = {
  id: '5RXTmIjsZkx47sjrOAvA',
  playerId: 'wK2mJ7QpL9xR4sT8vN3b',
  matchId: 'nC8vB4mQ2xL7sR5tK9pD',
  tip: '2:1',
  joker: false,
  points: 3,
};

it('validates a complete tip', () => {
  expect(v.parse(TipSchema, tip)).toEqual(tip);
});

it('allows a computed lonely-hit flag', () => {
  expect(v.safeParse(TipSchema, { ...tip, lonelyHit: true }).success).toBe(
    true,
  );
});

it('requires all original tip fields', () => {
  const { points: _, ...incompleteTip } = tip;
  expect(v.safeParse(TipSchema, incompleteTip).success).toBe(false);
});

it('rejects invalid document references', () => {
  expect(v.safeParse(TipSchema, { ...tip, matchId: '' }).success).toBe(false);
});
