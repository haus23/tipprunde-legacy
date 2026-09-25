import * as v from 'valibot';
import { expect, it } from 'vitest';

import { MatchSchema } from '../../src/championship/match';

const mock = {
  id: '5RXTmIjsZkx47sjrOAvA',
  nr: 1,
  roundId: 'wK2mJ7QpL9xR4sT8vN3b',
};

it('could have an unset match date', () => {
  expect(v.safeParse(MatchSchema, mock).success).toBeTruthy();
});

it('normalizes fields missing from older or unplayed matches', () => {
  expect(v.parse(MatchSchema, mock)).toEqual({
    ...mock,
    date: '',
    result: '',
    points: 0,
    leagueId: '',
    hometeamId: '',
    awayteamId: '',
  });
});

it('allows teams to be assigned later', () => {
  expect(
    v.safeParse(MatchSchema, {
      ...mock,
      leagueId: 'uefa-em',
      hometeamId: 'deutschland',
      awayteamId: '',
    }).success,
  ).toBe(true);
});

it('rejects invalid root collection references', () => {
  expect(
    v.safeParse(MatchSchema, {
      ...mock,
      hometeamId: 'Deutschland',
    }).success,
  ).toBe(false);
});
