import * as v from 'valibot';
import { expect, it } from 'vitest';

import {
  ChampionshipIdSchema,
  MatchDateSchema,
  ResultSchema,
} from '../src/primitives';

it('validates championship ids', () => {
  expect(v.safeParse(ChampionshipIdSchema, 'hr2223').success).toBeTruthy();
  expect(v.safeParse(ChampionshipIdSchema, 'wm2022').success).toBeTruthy();
  expect(v.safeParse(ChampionshipIdSchema, '').success).toBeFalsy();
});

it('date values may be empty', () => {
  expect(v.safeParse(MatchDateSchema, '').success).toBeTruthy();
});

it('date values must have valid date strings', () => {
  expect(v.safeParse(MatchDateSchema, '2023-05-09').success).toBeTruthy();
  expect(v.safeParse(MatchDateSchema, '2023-05-49').success).toBeFalsy();
  expect(v.safeParse(MatchDateSchema, 'heute').success).toBeFalsy();
});

it('validates correct results/tips', () => {
  expect(v.safeParse(ResultSchema, '').success).toBeTruthy();
  expect(v.safeParse(ResultSchema, '0:0').success).toBeTruthy();
  expect(v.safeParse(ResultSchema, '10:10').success).toBeTruthy();
});

it('fails with validation on invalid resul´ts/tips', () => {
  expect(v.safeParse(ResultSchema, ' ').success).toBeFalsy();
  expect(v.safeParse(ResultSchema, 'hoch').success).toBeFalsy();
  expect(v.safeParse(ResultSchema, ' 0:0').success).toBeFalsy();
  expect(v.safeParse(ResultSchema, '0:0 ').success).toBeFalsy();
  expect(v.safeParse(ResultSchema, '0.0').success).toBeFalsy();
  expect(v.safeParse(ResultSchema, '0-0').success).toBeFalsy();
  expect(v.safeParse(ResultSchema, 'a-0').success).toBeFalsy();
  expect(v.safeParse(ResultSchema, '0-a').success).toBeFalsy();
  expect(v.safeParse(ResultSchema, '100:0').success).toBeFalsy();
  expect(v.safeParse(ResultSchema, '0:100').success).toBeFalsy();
});
