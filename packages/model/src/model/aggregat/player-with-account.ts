import type { z } from 'zod';
import { Account } from '../entity/account';
import { Player } from '../entity/championship/player';

export const PlayerWithAccount = Player.extend({
  account: Account,
});

export type PlayerWithAccount = z.infer<typeof PlayerWithAccount>;
