import * as v from 'valibot';
import { expect, it } from 'vitest';

import { RoundSchema } from '../../src/championship/round';

it('validates a complete round', () => {
  const round = v.parse(RoundSchema, {
    id: '5RXTmIjsZkx47sjrOAvA',
    nr: 1,
    isDoubleRound: true,
  });

  expect(round).toEqual({
    id: '5RXTmIjsZkx47sjrOAvA',
    nr: 1,
    isDoubleRound: true,
  });
});

it('normalizes the double-round flag missing from older rounds', () => {
  const round = v.parse(RoundSchema, {
    id: '5RXTmIjsZkx47sjrOAvA',
    nr: 1,
  });

  expect(round).toEqual({
    id: '5RXTmIjsZkx47sjrOAvA',
    nr: 1,
    isDoubleRound: false,
  });
});

it('requires a positive round number', () => {
  const result = v.safeParse(RoundSchema, {
    id: '5RXTmIjsZkx47sjrOAvA',
    nr: 0,
  });

  expect(result.success).toBe(false);
});

it('rejects an empty document ID', () => {
  const result = v.safeParse(RoundSchema, {
    id: '',
    nr: 1,
  });

  expect(result.success).toBe(false);
});
