import { roundsState } from '@/state/current-data/rounds-state';
import { createEntity, Round } from 'lib';
import { useRecoilValue } from 'recoil';

import { useCurrentChampionship } from './use-current-championship';

export function useRounds() {
  const { currentChampionship } = useCurrentChampionship();
  const rounds = useRecoilValue(roundsState(currentChampionship?.id));

  const createRound = async (nr: number, isDoubleRound: boolean) =>
    createEntity<Round>(`championships/${currentChampionship?.id}/rounds`, {
      id: '',
      nr,
      published: false,
      completed: false,
      tipsPublished: false,
      isDoubleRound,
    });

  return { rounds, createRound };
}
