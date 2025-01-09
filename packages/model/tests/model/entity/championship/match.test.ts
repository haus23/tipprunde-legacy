import * as v from 'valibot';
import { expect, it } from 'vitest';

import { MatchSchema } from '../../../../src/model/entity/championship/match';

const mock = {
  id: 'abcdef',
  nr: 1,
  roundId: 'abcdef',
};

it('could have an unset match date', () => {
  expect(v.safeParse(MatchSchema, mock).success).toBeTruthy();
});
