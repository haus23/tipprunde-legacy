import * as v from 'valibot';
import { expect, it } from 'vitest';

import { AccountSchema } from '../../../src/model/entity/account';

it('can have empty email prop', () => {
  const mock = { id: 'micha', name: 'Micha', email: '' };
  expect(v.safeParse(AccountSchema, mock).success).toBeTruthy();
});

it('but non empty, it must have a valid email', () => {
  const mock = { id: 'micha', name: 'Micha', email: 'micha@haus23.net' };
  expect(v.safeParse(AccountSchema, mock).success).toBeTruthy();
  mock.email = 'micha@';
  expect(v.safeParse(AccountSchema, mock).success).toBeFalsy();
});
