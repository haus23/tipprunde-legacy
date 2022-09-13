import { createWithSequence } from '@/firebase/db/repository/create-entity';
import { update } from '@/firebase/db/repository/update-entity';
import { Player } from '@/model/domain/player';
import { playersState } from '@/states/domain/players-state';
import { useRecoilValue } from 'recoil';

export function usePlayers() {
  const players = useRecoilValue(playersState);

  const createPlayer = (player: Player) =>
    createWithSequence<Player>('players', 'player', player);

  const updatePlayer = (player: Player) => update('players', player);

  return { players, createPlayer, updatePlayer };
}
