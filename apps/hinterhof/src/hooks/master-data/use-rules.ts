import { type ChampionshipRules, createEntity, updateEntity } from 'lib';
import { useMasterDataStore } from '@/state/master-data-store';

export function useRules() {
  const rules = useMasterDataStore((state) => state.rules);

  const createRules = (rules: ChampionshipRules) =>
    createEntity<ChampionshipRules>('rules', rules);

  const updateRules = (rules: ChampionshipRules) =>
    updateEntity('rules', rules);

  return { rules, createRules, updateRules };
}
