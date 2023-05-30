import { z } from 'zod';

export const Round = z.object({
  id: z.string(),
  nr: z.number().positive(),
  published: z.boolean(),
  tipsPublished: z.boolean(),
  completed: z.boolean(),
});

export type Round = z.infer<typeof Round>;
