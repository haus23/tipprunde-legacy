import * as v from 'valibot';
import { expect, it } from 'vitest';

import { ChampionshipIdSchema } from '../../src/championship/championship-id';

it.each(['hr2223', 'wm2022', 'em2024'])(
  'accepts a valid championship ID %#',
  (id) => {
    expect(v.parse(ChampionshipIdSchema, id)).toBe(id);
  },
);

it.each(['', 'em-2024', 'EM2024', 'em24', 'euro2024'])(
  'rejects an invalid championship ID %#',
  (id) => {
    expect(v.safeParse(ChampionshipIdSchema, id).success).toBe(false);
  },
);
