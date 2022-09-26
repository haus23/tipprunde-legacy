import { championshipsState } from '@/state/championships';
import { useRecoilValueLoadable } from 'recoil';

export function useChampionships() {
  const championships = useRecoilValueLoadable(championshipsState);

  return { championships };
}
