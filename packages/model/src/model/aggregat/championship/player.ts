import type { z } from 'zod';
import { Account } from '../../entity/account';
import { Member } from '../../entity/championship/member';

export const Player = Member.extend({
  account: Account,
});

export type Player = z.infer<typeof Player>;
