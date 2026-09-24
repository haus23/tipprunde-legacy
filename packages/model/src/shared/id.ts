import * as v from 'valibot';

export const SlugIdSchema = v.pipe(
  v.string(),
  v.regex(/^[a-z0-9-]+$/, 'The ID must be a lowercase slug.'),
);
