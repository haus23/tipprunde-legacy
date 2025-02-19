import * as v from 'valibot';

export const IdSchema = v.pipe(
  v.string(),
  v.nonEmpty('Kann nicht leer sein.'),
  v.minLength(2, 'Eine ID muss mindestens zwei Zeichen haben'),
  v.regex(/^\w[-\w]*\w$/, 'Ungültige ID.'),
);
export const OptionalIdSchema = v.nullish(v.string(), '');

export type Id = v.InferOutput<typeof IdSchema>;
export type OptionalId = v.InferOutput<typeof IdSchema>;
