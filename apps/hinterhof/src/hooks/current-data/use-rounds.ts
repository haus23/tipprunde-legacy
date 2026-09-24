import { createEntity, type Round } from 'lib';
import { useCurrentDataStore } from '#/state/current-data-store';
import { useCurrentChampionship } from './use-current-championship';

export function useRounds() {
  const { currentChampionship } = useCurrentChampionship();
  const rounds = useCurrentDataStore((state) => state.rounds);

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
