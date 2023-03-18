import { z } from 'zod';

export const Player = z.object({
  id: z.string(),
  name: z.string({ required_error: 'Player name is required' }),
  email: z.string().email().or(z.literal('')),
});

export type Player = z.infer<typeof Player>;
