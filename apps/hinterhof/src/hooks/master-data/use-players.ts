import { createEntity, type Player, updateEntity } from 'lib';
import { useMasterDataStore } from '@/state/master-data-store';

export function usePlayers() {
  const players = useMasterDataStore((state) => state.players);

  const createPlayer = (player: Player) =>
    createEntity<Player>('players', player);

  const updatePlayer = (player: Player) => updateEntity('players', player);

  return { players, createPlayer, updatePlayer };
}
