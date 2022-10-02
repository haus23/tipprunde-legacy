import { useRecoilState } from 'recoil';
import { currentChampionshipState } from '@/states/current-championship-state';

export function useCurrentChampionship() {
  const [currentChampionship, setCurrentChampionship] = useRecoilState(
    currentChampionshipState
  );

  return { currentChampionship, setCurrentChampionship };
}
