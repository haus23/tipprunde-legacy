import { createEntityWithGeneratedId, type Tip, updateEntity } from 'lib';
import { useCurrentDataStore } from '#/state/current-data-store';
import { useCurrentChampionship } from './use-current-championship';

export function useTips() {
  const { currentChampionship } = useCurrentChampionship();
  const tips = useCurrentDataStore((state) => state.tips);

  const createTip = async (tip: Omit<Tip, 'id'>) =>
    createEntityWithGeneratedId<Tip>(
      `championships/${currentChampionship?.id}/tips`,
      tip,
    );

  const updateTip = async (tip: Tip) =>
    updateEntity<Tip>(`championships/${currentChampionship?.id}/tips`, tip);
  return { tips, createTip, updateTip };
}
