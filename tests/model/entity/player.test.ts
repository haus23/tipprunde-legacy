import { Account } from '~/model/entity/account';
import { it, expect } from 'vitest';

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
