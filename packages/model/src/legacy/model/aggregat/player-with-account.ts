import * as v from 'valibot';

import { ChampionshipPlayerSchema } from '../../../championship/championship-player';
import { MemberSchema } from '../../../member/member';

export const PlayerWithAccountSchema = v.object({
  ...ChampionshipPlayerSchema.entries,
  account: MemberSchema,
});

export type PlayerWithAccountInput = v.InferInput<
  typeof PlayerWithAccountSchema
>;
export type PlayerWithAccount = v.InferOutput<typeof PlayerWithAccountSchema>;
