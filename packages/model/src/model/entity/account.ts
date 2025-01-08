import { z } from 'zod';

// Firebase collection path: /players

export const Account = z.object({
  id: z.string(),
  name: z.string({ required_error: 'Player name is required' }),
  email: z.string().email().or(z.literal('')),
});

export type Account = z.infer<typeof Account>;
