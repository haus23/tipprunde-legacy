import * as v from 'valibot';

const EnvSchema = v.object({
  PORT: v.pipe(v.string(), v.transform(Number)),
  MAX_AGE: v.pipe(v.string(), v.transform(Number)),
  FIREBASE_PROJECT_ID: v.string(),
  FIREBASE_CLIENT_EMAIL: v.string(),
  FIREBASE_PRIVATE_KEY: v.string(),
  CACHE_INVALIDATION_ALLOWED_UIDS: v.pipe(
    v.string(),
    v.transform((value) =>
      value
        .split(',')
        .map((uid) => uid.trim())
        .filter(Boolean),
    ),
    v.minLength(1),
  ),
});

export const env = v.parse(EnvSchema, process.env);
