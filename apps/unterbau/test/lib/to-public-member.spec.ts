import { expect, it } from 'vitest';

import { toPublicMember } from '#app/lib/util/to-public-member.ts';

it('redacts the notification email', () => {
  expect(
    toPublicMember({
      id: 'micha',
      name: 'Micha',
      email: 'micha@example.com',
    }),
  ).toEqual({
    id: 'micha',
    name: 'Micha',
    email: '',
  });
});
