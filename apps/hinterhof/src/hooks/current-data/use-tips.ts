import { useRecoilValue } from 'recoil';

import { tipsState } from '@/state/current-data/tips-state';
import { type Tip, createEntity, updateEntity } from 'lib';
import { useCurrentChampionship } from './use-current-championship';

export function useTips() {
  const { currentChampionship } = useCurrentChampionship();
  const tips = useRecoilValue(tipsState(currentChampionship?.id));

  const createTip = async (tip: Tip) =>
    createEntity<Tip>(`championships/${currentChampionship?.id}/tips`, tip);

  const updateTip = async (tip: Tip) =>
    updateEntity<Tip>(`championships/${currentChampionship?.id}/tips`, tip);
  return { tips, createTip, updateTip };
}
