import { z } from 'zod';

// Firebase collection path: /teams

export const Team = z.object({
  id: z.string(),
  name: z.string({ required_error: 'Team name is required' }),
  shortname: z.string({ required_error: 'Team short name is required' }),
});

export type Team = z.infer<typeof Team>;
