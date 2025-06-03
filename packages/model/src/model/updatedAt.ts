import * as v from 'valibot';

export const UpdatedAtSchema = v.pipe(
  v.object({
    _seconds: v.number(),
    _nanoseconds: v.number(),
  }),
  v.transform((input) => new Date(input._seconds * 1000)),
);
