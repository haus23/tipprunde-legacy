import { useRecoilValue } from 'recoil';

import { createEntity } from '@/firebase/db/repository/create-entity';
import { championshipsState } from '@/states/domain/championships-state';
import { Championship } from '@/model/domain/championship';

export function useChampionships() {
  const championships = useRecoilValue(championshipsState);

  const createChampionship = (championship: Championship) =>
    createEntity<Championship>('championships', championship);

  return { championships, createChampionship };
}
