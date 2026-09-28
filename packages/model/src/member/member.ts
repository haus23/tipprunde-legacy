import * as v from 'valibot';

import { SlugIdSchema } from '../shared/id';

export const MemberSchema = v.object({
  id: SlugIdSchema,
  name: v.pipe(v.string(), v.nonEmpty()),
  email: v.pipe(
    v.optional(v.union([v.literal(''), v.pipe(v.string(), v.email())]), ''),
    v.description(
      'Kontaktadresse für Benachrichtigungen. Der Unterbau ersetzt sie in öffentlichen API-Antworten durch einen leeren String.',
    ),
  ),
});

export type MemberInput = v.InferInput<typeof MemberSchema>;
export type Member = v.InferOutput<typeof MemberSchema>;
