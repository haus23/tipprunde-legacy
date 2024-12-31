import * as v from 'valibot';

const EnvSchema = v.object({
  MAX_AGE: v.pipe(v.string(), v.transform(Number)),
});

export const env = v.parse(EnvSchema, process.env);
