import { z } from 'zod';

// Firebase collection path: /leagues

export const League = z.object({
  id: z.string(),
  name: z.string({ required_error: 'League name is required' }),
  shortname: z.string({ required_error: 'League short name is required' }),
});

export type League = z.infer<typeof League>;
