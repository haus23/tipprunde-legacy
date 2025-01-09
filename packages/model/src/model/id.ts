import * as v from 'valibot';

export const IdSchema = v.pipe(v.string(), v.nonEmpty());
export const OptionalIdSchema = v.optional(v.string(), '');
