import { it, expect } from 'vitest';
import Ajv from 'ajv';
import addFormats from 'ajv-formats';

import { Player } from './player.mjs';

const ajv = new Ajv();
addFormats(ajv);

it('can have email prop empty', () => {
  const mock = { id: 'micha', name: 'Micha', email: '' };
  expect(ajv.validate(Player, mock)).toBeTruthy();
});

it('but non empty, it must have a valid email', () => {
  const mock = { id: 'micha', name: 'Micha', email: 'micha@haus23.net' };
  expect(ajv.validate(Player, mock)).toBeTruthy();
  mock.email = 'micha@';
  expect(ajv.validate(Player, mock)).toBeFalsy();
});
