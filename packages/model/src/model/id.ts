import * as v from 'valibot';

export const IdSchema = v.pipe(
  v.string(),
  v.nonEmpty('Kann nicht leer sein.'),
  v.minLength(3, 'Eine ID muss mindestens drei Zeichen haben'),
  v.regex(/^\w[-\w]+\w$/, 'Ungültige ID.'),
);
export const OptionalIdSchema = v.optional(v.string(), '');
