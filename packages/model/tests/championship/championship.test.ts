import * as v from 'valibot';
import { expect, it } from 'vitest';

import { ChampionshipSchema } from '../../src/championship/championship';

it('validates a complete championship', () => {
  const championship = v.parse(ChampionshipSchema, {
    id: 'em2024',
    name: 'EM 2024',
    nr: 55,
    rulesId: 'doppelte-punkte-in-ko-phase',
    published: true,
    extraPointsPublished: true,
    completed: true,
  });

  expect(championship).toEqual({
    id: 'em2024',
    name: 'EM 2024',
    nr: 55,
    rulesId: 'doppelte-punkte-in-ko-phase',
    published: true,
    extraPointsPublished: true,
    completed: true,
  });
});

it('requires all championship state flags', () => {
  const result = v.safeParse(ChampionshipSchema, {
    id: 'em2024',
    name: 'EM 2024',
    nr: 55,
    rulesId: 'doppelte-punkte-in-ko-phase',
  });

  expect(result.success).toBe(false);
});

it('rejects an invalid rules ID', () => {
  const result = v.safeParse(ChampionshipSchema, {
    id: 'em2024',
    name: 'EM 2024',
    nr: 55,
    rulesId: 'Doppelte Punkte',
    published: false,
    extraPointsPublished: false,
    completed: false,
  });

  expect(result.success).toBe(false);
});
