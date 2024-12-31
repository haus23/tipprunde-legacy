import * as v from 'valibot';

const EnvSchema = v.object({
  MAX_AGE: v.pipe(v.string(), v.transform(Number)),
  FIREBASE_PROJECT_ID: v.string(),
  FIREBASE_CLIENT_EMAIL: v.string(),
  FIREBASE_PRIVATE_KEY: v.string(),
});

export const env = v.parse(EnvSchema, process.env);
