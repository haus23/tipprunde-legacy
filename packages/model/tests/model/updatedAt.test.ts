import * as v from 'valibot';
import { expect, it } from 'vitest';
import { UpdatedAtSchema } from '../../src/model/updatedAt';

it('validates updatedAt property from Firestore timestamp to Date', () => {
  const time = new Date(2025, 5, 19).getTime() / 1000;

  const result = v.parse(v.object({ updatedAt: UpdatedAtSchema }), {
    updatedAt: { _seconds: time, _nanoseconds: 0 },
  });
  expect(result.updatedAt).toEqual(new Date(2025, 5, 19));
});

it('validates updatedAt property if undefined', () => {
  const result = v.safeParse(v.object({ updatedAt: UpdatedAtSchema }), {});
  expect(result.success).toEqual(true);
});
