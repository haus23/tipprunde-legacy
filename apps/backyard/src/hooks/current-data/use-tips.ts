import { useRecoilValue } from 'recoil';

import { useCurrentChampionship } from './use-current-championship';
import { createEntity, Tip, updateEntity } from 'lib';
import { tipsState } from '@/state/current-data/tips-state';

export function useTips() {
  const { currentChampionship } = useCurrentChampionship();
  const tips = useRecoilValue(tipsState(currentChampionship?.id));

  const createTip = async (tip: Tip) =>
    createEntity<Tip>(`championships/${currentChampionship?.id}/tips`, tip);

  const updateTip = async (tip: Tip) =>
    updateEntity<Tip>(`championships/${currentChampionship?.id}/tips`, tip);
  return { tips, createTip, updateTip };
}
