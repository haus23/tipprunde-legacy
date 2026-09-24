import { createEntity, type Member, updateEntity } from 'lib';
import { useMasterDataStore } from '#/state/master-data-store';

export function usePlayers() {
  const players = useMasterDataStore((state) => state.players);

  const createPlayer = (player: Member) =>
    createEntity<Member>('players', player);

  const updatePlayer = (player: Member) => updateEntity('players', player);

  return { players, createPlayer, updatePlayer };
}
