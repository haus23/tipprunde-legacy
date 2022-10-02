import { useRecoilState } from 'recoil';
import { currentChampionshipState } from '@/state/current-championship-state';

export function useCurrentChampionship() {
  const [currentChampionship, setCurrentChampionship] = useRecoilState(
    currentChampionshipState
  );

  return { currentChampionship, setCurrentChampionship };
}
