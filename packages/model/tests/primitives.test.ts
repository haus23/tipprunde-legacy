import { expect, it } from 'vitest';
import { ChampionshipId, MatchDate, Result } from '../src/primitives';

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

it('validates correct results/tips', () => {
  expect(Result.safeParse('').success).toBeTruthy();
  expect(Result.safeParse('0:0').success).toBeTruthy();
  expect(Result.safeParse('10:10').success).toBeTruthy();
});

it('fails with validation on invalid resul´ts/tips', () => {
  expect(Result.safeParse(' ').success).toBeFalsy();
  expect(Result.safeParse('hoch').success).toBeFalsy();
  expect(Result.safeParse(' 0:0').success).toBeFalsy();
  expect(Result.safeParse('0:0 ').success).toBeFalsy();
  expect(Result.safeParse('0.0').success).toBeFalsy();
  expect(Result.safeParse('0-0').success).toBeFalsy();
  expect(Result.safeParse('a-0').success).toBeFalsy();
  expect(Result.safeParse('0-a').success).toBeFalsy();
  expect(Result.safeParse('100:0').success).toBeFalsy();
  expect(Result.safeParse('0:100').success).toBeFalsy();
});
