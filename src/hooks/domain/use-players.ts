import { createWithSequence } from '@/firebase/db/repository/create-entity';
import { Player } from '@/model/domain/player';
import { playersState } from '@/states/domain/players-state';
import { useRecoilValue } from 'recoil';

export function usePlayers() {
  const players = useRecoilValue(playersState);

  const createPlayer = (player: Player) =>
    createWithSequence<Player>('players', 'player', player);

  return { players, createPlayer };
}
