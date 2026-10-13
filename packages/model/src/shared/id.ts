import * as v from 'valibot';

export const slugIdRegEx = /^[a-z0-9-]+$/;

export const SlugIdSchema = v.pipe(
  v.string(),
  v.regex(slugIdRegEx, 'The ID must be a lowercase slug.'),
);
