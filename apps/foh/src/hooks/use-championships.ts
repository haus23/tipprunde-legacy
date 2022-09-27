import { championshipsState } from '@/state/championships-state';
import { useAtomValue } from 'jotai';

export function useChampionships() {
  const championships = useAtomValue(championshipsState);
  return { championships };
}
