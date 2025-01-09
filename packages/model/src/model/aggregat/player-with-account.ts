import * as v from 'valibot';

import { AccountSchema } from '../entity/account';
import { PlayerSchema } from '../entity/championship/player';

export const PlayerWithAccountSchema = v.object({
  ...PlayerSchema.entries,
  account: AccountSchema,
});

export type PlayerWithAccountInput = v.InferInput<
  typeof PlayerWithAccountSchema
>;
export type PlayerWithAccount = v.InferOutput<typeof PlayerWithAccountSchema>;
