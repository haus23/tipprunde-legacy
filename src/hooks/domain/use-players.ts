import { createEntity } from '@/firebase/db/repository/create-entity';
import { updateEntity } from '@/firebase/db/repository/update-entity';
import { Player } from '@/model/domain/player';
import { playersState } from '@/states/domain/players-state';
import { useRecoilValue } from 'recoil';

export function usePlayers() {
  const players = useRecoilValue(playersState);

  const createPlayer = (player: Player) =>
    createEntity<Player>('players', player);

  const updatePlayer = (player: Player) => updateEntity('players', player);

  return { players, createPlayer, updatePlayer };
}
