import { useRecoilValue } from 'recoil';
import { Championship, createEntity } from 'lib';

import { championshipsState } from '@/state/master-data/championships-state';

export function useChampionships() {
  const championships = useRecoilValue(championshipsState);

  const createChampionship = (championship: Championship) =>
    createEntity<Championship>('championships', championship);

  return { championships, createChampionship };
}
