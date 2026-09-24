import * as v from 'valibot';
import { expect, it } from 'vitest';

import { SlugIdSchema } from '../../src/shared/id';

it.each(['team', 'team-23', 'em2024'])(
  'accepts a root collection slug %#',
  (id) => {
    expect(v.parse(SlugIdSchema, id)).toBe(id);
  },
);

it.each(['', 'Team', 'team_23', 'team 23', 'team.23', ' team', 'team '])(
  'rejects a non-slug root collection ID %#',
  (id) => {
    expect(v.safeParse(SlugIdSchema, id).success).toBe(false);
  },
);
