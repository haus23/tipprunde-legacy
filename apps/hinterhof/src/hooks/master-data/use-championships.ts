import type { Championship } from '@haus23/tipprunde-model';
import { createEntity } from 'lib';
import { useMasterDataStore } from '#/state/master-data-store';

export function useChampionships() {
  const championships = useMasterDataStore((state) => state.championships);

  const createChampionship = (championship: Championship) =>
    createEntity<Championship>('championships', championship);

  return { championships, createChampionship };
}
