import { it, expect } from 'vitest';

import { ChampionshipId, MatchDate, Result } from './primitives';

it('validates championship ids', () => {
  expect(ChampionshipId.safeParse('hr2223').success).toBeTruthy();
  expect(ChampionshipId.safeParse('wm2022').success).toBeTruthy();
  expect(ChampionshipId.safeParse('').success).toBeFalsy();
});

it('date values may be empty', () => {
  expect(MatchDate.safeParse('').success).toBeTruthy();
});

it('date values must have valid date strings', () => {
  expect(MatchDate.safeParse('2023-05-09').success).toBeTruthy();
  expect(MatchDate.safeParse('2023-05-49').success).toBeFalsy();
  expect(MatchDate.safeParse('heute').success).toBeFalsy();
});
