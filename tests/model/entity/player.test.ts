import { Player } from '~/model/entity/player';
import { it, expect } from 'vitest';

it('can have empty email prop', () => {
  const mock = { id: 'micha', name: 'Micha', email: '' };
  expect(Player.safeParse(mock).success).toBeTruthy();
});

it('but non empty, it must have a valid email', () => {
  const mock = { id: 'micha', name: 'Micha', email: 'micha@haus23.net' };
  expect(Player.safeParse(mock).success).toBeTruthy();
  mock.email = 'micha@';
  expect(Player.safeParse(mock).success).toBeFalsy();
});
