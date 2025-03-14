import { type Player, createEntity, updateEntity } from 'lib';
import { useRecoilValue } from 'recoil';

import { playersState } from '@/state/master-data/players-state';

export function usePlayers() {
  const players = useRecoilValue(playersState);

  const createPlayer = (player: Player) =>
    createEntity<Player>('players', player);

  const updatePlayer = (player: Player) => updateEntity('players', player);

  return { players, createPlayer, updatePlayer };
}
