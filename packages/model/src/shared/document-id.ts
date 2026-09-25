import * as v from 'valibot';

export const DocumentIdSchema = v.pipe(v.string(), v.nonEmpty());
