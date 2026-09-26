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

it('accepts a player before the first ranking calculation', () => {
  expect(
    v.parse(ChampionshipPlayerSchema, {
      id: championshipPlayer.id,
      playerId: championshipPlayer.playerId,
      nr: championshipPlayer.nr,
    }),
  ).toEqual({
    id: championshipPlayer.id,
    playerId: championshipPlayer.playerId,
    nr: championshipPlayer.nr,
  });
});

it('requires a root member slug', () => {
  expect(
    v.safeParse(ChampionshipPlayerSchema, {
      ...championshipPlayer,
      playerId: 'Micha Buchholz',
    }).success,
  ).toBe(false);
});
