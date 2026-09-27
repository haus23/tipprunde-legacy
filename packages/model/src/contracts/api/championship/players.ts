import * as v from 'valibot';

import { ChampionshipPlayerSchema } from '#model/championship/championship-player';
import { MemberSchema } from '#model/member/member';

export const ChampionshipPlayerWithAccountSchema = v.object({
  ...ChampionshipPlayerSchema.entries,
  account: MemberSchema,
});

export type ChampionshipPlayerWithAccountInput = v.InferInput<
  typeof ChampionshipPlayerWithAccountSchema
>;
export type ChampionshipPlayerWithAccount = v.InferOutput<
  typeof ChampionshipPlayerWithAccountSchema
>;

export const ChampionshipPlayersSchema = v.array(
  ChampionshipPlayerWithAccountSchema,
);

export type ChampionshipPlayersInput = v.InferInput<
  typeof ChampionshipPlayersSchema
>;
export type ChampionshipPlayers = v.InferOutput<
  typeof ChampionshipPlayersSchema
>;
