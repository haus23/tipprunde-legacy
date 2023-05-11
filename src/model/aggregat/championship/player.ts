import { z } from 'zod';
import { Account } from '~/model/entity/account';
import { Member } from '~/model/entity/championship/member';

export const Player = Member.extend({
  player: Account,
});

export type Player = z.infer<typeof Player>;
