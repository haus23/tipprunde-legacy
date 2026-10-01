import type { Round } from '@haus23/tipprunde-model';
import { createEntityWithGeneratedId } from '#/firebase/write';
import { useCurrentDataStore } from '#/state/current-data-store';
import { useCurrentChampionship } from './use-current-championship';

export function useRounds() {
  const { currentChampionship } = useCurrentChampionship();
  const rounds = useCurrentDataStore((state) => state.rounds);

  const createRound = async (nr: number, isDoubleRound: boolean) =>
    createEntityWithGeneratedId<Round>(
      `championships/${currentChampionship?.id}/rounds`,
      {
        nr,
        isDoubleRound,
      },
    );

  return { rounds, createRound };
}
