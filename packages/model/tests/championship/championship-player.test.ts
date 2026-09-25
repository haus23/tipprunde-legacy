import * as v from 'valibot';
import { expect, it } from 'vitest';

import { ChampionshipPlayerSchema } from '../../src/championship/championship-player';

const championshipPlayer = {
  id: '5RXTmIjsZkx47sjrOAvA',
  playerId: 'micha',
  nr: 1,
  rank: 1,
  points: 12,
  extraPoints: 3,
  totalPoints: 15,
};

it('validates a championship player', () => {
  expect(v.parse(ChampionshipPlayerSchema, championshipPlayer)).toEqual(
    championshipPlayer,
  );
});

it('requires all ranking values', () => {
  const { totalPoints: _, ...incompletePlayer } = championshipPlayer;
  expect(v.safeParse(ChampionshipPlayerSchema, incompletePlayer).success).toBe(
    false,
  );
});

it('requires a root member slug', () => {
  expect(
    v.safeParse(ChampionshipPlayerSchema, {
      ...championshipPlayer,
      playerId: 'Micha Buchholz',
    }).success,
  ).toBe(false);
});
