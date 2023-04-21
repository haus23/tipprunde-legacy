import { Player } from '@haus23/tipprunde-types';
import { getPlayers } from '~/lib/query/get-players';

export default cachedEventHandler(getPlayers, { name: 'players' });
