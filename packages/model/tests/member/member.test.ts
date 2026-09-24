import * as v from 'valibot';
import { expect, it } from 'vitest';

import { MemberSchema } from '../../src/member/member';

it('can have empty email prop', () => {
  const mock = { id: 'micha', name: 'Micha', email: '' };
  expect(v.safeParse(MemberSchema, mock).success).toBeTruthy();
});

it('defaults a missing notification email', () => {
  const member = v.parse(MemberSchema, {
    id: 'micha',
    name: 'Micha',
  });

  expect(member).toEqual({ id: 'micha', name: 'Micha', email: '' });
});

it('but non empty, it must have a valid email', () => {
  const mock = { id: 'micha', name: 'Micha', email: 'micha@haus23.net' };
  expect(v.safeParse(MemberSchema, mock).success).toBeTruthy();
  mock.email = 'micha@';
  expect(v.safeParse(MemberSchema, mock).success).toBeFalsy();
});
