import { playersState } from '@/states/domain/players-state';
import { useRecoilValue } from 'recoil';

export function usePlayers() {
  const players = useRecoilValue(playersState);

  return { players };
}
