import { expect, it } from 'vitest';
import { Account } from '../../../src/model/entity/account';

it('can have empty email prop', () => {
  const mock = { id: 'micha', name: 'Micha', email: '' };
  expect(Account.safeParse(mock).success).toBeTruthy();
});

it('but non empty, it must have a valid email', () => {
  const mock = { id: 'micha', name: 'Micha', email: 'micha@haus23.net' };
  expect(Account.safeParse(mock).success).toBeTruthy();
  mock.email = 'micha@';
  expect(Account.safeParse(mock).success).toBeFalsy();
});
