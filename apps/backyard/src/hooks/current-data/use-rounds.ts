import { roundsState } from '@/state/current-data/rounds-state';
import { createEntity, Round } from 'lib';
import { useRecoilValue } from 'recoil';

import { useCurrentChampionship } from './use-current-championship';

export function useRounds() {
  const { currentChampionship } = useCurrentChampionship();
  const rounds = useRecoilValue(roundsState(currentChampionship?.id));

  const createRound = (nr: number) => {
    return createEntity<Round>(
      `championships/${currentChampionship?.id}/rounds`,
      {
        id: `runde-${nr}`,
        nr,
        published: false,
        completed: false,
      }
    );
  };

  return { rounds, createRound };
}
