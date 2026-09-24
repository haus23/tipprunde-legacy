import * as v from 'valibot';

import { MemberSchema } from '../../../member/member';
import { PlayerSchema } from '../entity/championship/player';

export const PlayerWithAccountSchema = v.object({
  ...PlayerSchema.entries,
  account: MemberSchema,
});

export type PlayerWithAccountInput = v.InferInput<
  typeof PlayerWithAccountSchema
>;
export type PlayerWithAccount = v.InferOutput<typeof PlayerWithAccountSchema>;
